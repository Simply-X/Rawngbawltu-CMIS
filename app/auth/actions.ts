
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Find user tenant and role
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        // 1. Check if mapping exists
        const { data: member } = await supabase
            .from('members')
            .select('tenant_id, role')
            .eq('auth_user_id', user.id)
            .single()

        if (member) {
            revalidatePath('/', 'layout')
            redirect(`/${member.tenant_id}/dashboard`)
        } else {
            // Edge case: Auth User exists but no member record linked yet.
            // Redirect to a specific setup/linking page or home.
            // For now, redirect to Home with a message (handled via query param in a real app or just redirect)
            revalidatePath('/', 'layout')
            redirect('/')
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const tenantName = formData.get('tenantName') as string

    // 1. Sign up auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (authError) {
        return { error: authError.message }
    }

    // 2. Logic to create Tenant + Member is complex because "auth.signUp" might return a session immediately OR require email confirmation.
    // If email confirmation is on, we can't create records yet efficiently (unless we trust the claim).
    // Strategy: We will assume prototyping mode (no email confirm) or we should handle this via a post-confirmation trigger.
    // FOR PROTOTYPE: We will create the member record if we have a user.

    if (authData.user) {
        // Create Tenant (Optional? User might be joining existing. For now, assuming "Create New Tenant" flow on signup)
        // Actually, standard SaaS flow: Signup = New Tenant. Invite = Join Tenant (Login).

        // A. Create Tenant
        const { data: tenant, error: tenantError } = await supabase
            .from('tenants')
            .insert({ name: tenantName, denomination: 'Custom' }) // Defaulting
            .select()
            .single()

        if (tenantError) return { error: 'Tenant creation failed: ' + tenantError.message }

        // B. Create Member linked to Auth User
        const { error: memberError } = await supabase
            .from('members')
            .insert({
                tenant_id: tenant.id,
                full_name: fullName,
                role: 'SuperAdmin', // First user is Admin
                auth_user_id: authData.user.id
            })

        if (memberError) return { error: 'Member creation failed: ' + memberError.message }

        revalidatePath('/', 'layout')
        redirect(`/${tenant.id}/dashboard`)
    }

    // If email confirmation required
    return { message: 'Check email to continue sign in process' }
}
