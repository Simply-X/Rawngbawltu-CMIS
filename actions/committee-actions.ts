
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCommittee(data: {
    tenant_id: string
    name: string
    budget_total?: number
}) {
    const supabase = await createClient()

    const { data: record, error } = await supabase
        .from('committees')
        .insert({
            tenant_id: data.tenant_id,
            name: data.name,
            budget_total: data.budget_total || 0,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating committee:', error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/committees')
    return record
}

export async function getCommittees(tenant_id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('committees')
        .select('*')
        .eq('tenant_id', tenant_id)
        .order('name')

    if (error) throw error
    return data
}
