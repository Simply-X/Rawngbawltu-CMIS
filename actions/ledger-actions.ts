
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTransaction(data: {
    tenant_id: string
    family_id?: string
    head_id: string
    amount: number
    date: string
}) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('transactions')
        .insert({
            tenant_id: data.tenant_id,
            family_id: data.family_id,
            head_id: data.head_id,
            amount: data.amount,
            date: data.date
        })

    if (error) throw new Error(error.message)
    revalidatePath('/[tenantId]/ledger')
}

export async function getLedgerHeads(tenantId: string) {
    const supabase = await createClient()
    const { data } = await supabase.from('ledger_heads').select('*').eq('tenant_id', tenantId)
    return data
}

export async function getFamilies(tenantId: string) {
    const supabase = await createClient()
    // Get families via bials -> tenant (simplified for now directly or need join)
    // Assuming appropriate join or we fetch all families and filter (inefficient but ok for prototype)
    // Better: add tenant_id to families for quick lookup or use proper query

    // For prototype speed, assuming families have direct or indirect link. 
    // Adding tenant_id to families would be good, but following schema provided:
    // families -> bials -> tenants.

    const { data, error } = await supabase
        .from('families')
        .select('id, head_name, bials!inner(tenant_id)')
        .eq('bials.tenant_id', tenantId)

    if (error) console.error(error)
    return data
}
