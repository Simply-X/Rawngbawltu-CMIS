
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Role = 'SuperAdmin' | 'CommitteeAdmin' | 'Member'

export async function addMember(data: {
    family_id?: string
    full_name: string
    phone: string
    role: Role
}) {
    const supabase = await createClient()
    const { data: record, error } = await supabase
        .from('members')
        .insert({
            full_name: data.full_name,
            phone: data.phone,
            role: data.role,
            family_id: data.family_id
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/[tenantId]/admin')
    return record
}

export async function updateMemberRole(memberId: string, newRole: Role) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('members')
        .update({ role: newRole })
        .eq('id', memberId)

    if (error) throw new Error(error.message)
    revalidatePath('/[tenantId]/admin')
}

export async function getMembers() {
    const supabase = await createClient()
    // In a real app, filter by tenant via Family -> Bial -> Tenant
    // For now, fetching all for the prototype context
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('full_name')

    if (error) throw error
    return data
}
