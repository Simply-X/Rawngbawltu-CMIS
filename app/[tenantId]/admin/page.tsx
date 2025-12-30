
import { getMembers } from '@/actions/member-actions'
import MemberManager from '@/components/admin/MemberManager'
import SuccessionManager from '@/components/admin/SuccessionManager'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function AdminPage({ params }: { params: Promise<{ tenantId: string }> }) {
    const { tenantId } = await params
    const members = await getMembers()

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Link href={`/${tenantId}/dashboard`} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-2">Admin Console</h1>
            <p className="text-muted-foreground mb-8">Manage Permissions, Succession, and Global Settings.</p>

            <div className="grid gap-8">
                <MemberManager members={members || []} />

                {/* For demo purposes, we need a way to simulate "Current User" since we don't have Auth yet. 
                    We will pick the first SuperAdmin found, or allow selection in a real auth scenario. 
                    For now, we will pass the first SuperAdmin's ID if available. 
                */}
                {members && members.some(m => m.role === 'SuperAdmin') && (
                    <SuccessionManager
                        currentAdminId={members.find(m => m.role === 'SuperAdmin')!.id}
                        members={members}
                    />
                )}
            </div>
        </div>
    )
}
