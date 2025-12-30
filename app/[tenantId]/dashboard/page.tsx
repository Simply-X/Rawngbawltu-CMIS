
import { createClient } from '@/utils/supabase/server'
import { getCommittees } from '@/actions/committee-actions'
import CommitteeFactory from '@/components/committee/CommitteeFactory'
import { DenominationType } from '@/constants/denominations'
import Link from 'next/link'

export default async function TenantDashboard({ params }: { params: Promise<{ tenantId: string }> }) {
    const { tenantId } = await params
    const supabase = await createClient()
    const { data: tenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single()

    if (!tenant) return <div className="p-8 text-center text-red-500 font-bold">Tenant not found</div>

    const committees = await getCommittees(tenantId)
    const denomination = tenant.denomination as DenominationType

    return (
        <div className="container mx-auto p-4 space-y-8">
            <header className="border-b pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {tenant.name}
                    </h1>
                    <p className="text-muted-foreground">{tenant.denomination} Mode Active</p>
                </div>
                <Link href={`/${tenantId}/admin`} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
                    Admin Console
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Committee Management</h2>
                    <CommitteeFactory tenantId={tenantId} denomination={denomination} />

                    <Link href={`/${tenantId}/ledger`} className="inline-block mt-4 text-primary hover:underline">
                        Go to Tithe Ledger &rarr;
                    </Link>
                    <div className="mt-2"></div>
                    <Link href={`/${tenantId}/sundayschool`} className="inline-block text-primary hover:underline">
                        Go to Sunday School &rarr;
                    </Link>
                    <div className="mt-2"></div>
                    <Link href={`/${tenantId}/prayer`} className="inline-block text-primary hover:underline">
                        Go to Prayer Wall &rarr;
                    </Link>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Active Committees</h2>
                    <div className="grid gap-4">
                        {committees?.length === 0 && <p className="text-sm text-muted-foreground">No committees yet.</p>}
                        {committees?.map((comm) => (
                            <div key={comm.id} className="p-4 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition">
                                <h3 className="font-bold text-lg">{comm.name}</h3>
                                <p className="text-sm text-muted-foreground">Budget: ₹{Number(comm.budget_total).toLocaleString()}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">Vault</span>
                                    <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">Ledger</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
