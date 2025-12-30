
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createClass(data: { tenant_id: string, name: string }) {
    const supabase = await createClient()
    const { error } = await supabase.from('ss_classes').insert(data)
    if (error) throw new Error(error.message)
    revalidatePath('/[tenantId]/sundayschool')
}

export async function assignTeacher(classId: string, teacherId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('ss_classes')
        .update({ teacher_id: teacherId })
        .eq('id', classId)

    if (error) throw new Error(error.message)
    revalidatePath('/[tenantId]/sundayschool')
}

export async function getClasses(tenantId: string) {
    const supabase = await createClient()
    // Join teacher details
    const { data, error } = await supabase
        .from('ss_classes')
        .select('*, teacher:teacher_id(full_name)')
        .eq('tenant_id', tenantId)
        .order('name')

    if (error) throw error
    return data
}
