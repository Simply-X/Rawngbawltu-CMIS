
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitPrayerRequest(data: { tenant_id: string, member_id: string, content: string, is_anonymous: boolean }) {
    const supabase = await createClient()
    const { error } = await supabase.from('prayer_requests').insert(data)
    if (error) throw new Error(error.message)
    revalidatePath('/[tenantId]/prayer')
}

export async function getPrayerRequests(tenantId: string) {
    const supabase = await createClient()
    // Mocking permission check here. In real app, RLS handles "Visible ONLY to Pastor..."
    // Here we just fetch all for the demo.
    const { data, error } = await supabase
        .from('prayer_requests')
        .select('*, member:member_id(full_name)')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}
