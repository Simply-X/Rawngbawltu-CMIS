
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function transferSuperAdmin(currentAdminId: string, successorId: string, keepCurrentAsAdmin: boolean) {
    const supabase = await createClient()

    // 1. Verify current user is actually SuperAdmin (Security Check)
    const { data: current, error: fetchError } = await supabase
        .from('members')
        .select('role')
        .eq('id', currentAdminId)
        .single()

    if (fetchError || current.role !== 'SuperAdmin') {
        throw new Error('Unauthorized: Only SuperAdmins can initiate succession.')
    }

    // 2. Promote Successor
    const { error: promoteError } = await supabase
        .from('members')
        .update({ role: 'SuperAdmin' })
        .eq('id', successorId)

    if (promoteError) throw new Error('Failed to promote successor: ' + promoteError.message)

    // 3. Handle incumbent
    if (!keepCurrentAsAdmin) {
        const { error: demoteError } = await supabase
            .from('members')
            .update({ role: 'Member' }) // or CommitteeAdmin? Defaulting to Member.
            .eq('id', currentAdminId)

        if (demoteError) throw new Error('Failed to demote incumbent: ' + demoteError.message)
    }

    revalidatePath('/[tenantId]/admin')
}
