
import { getLedgerHeads, getFamilies } from '@/actions/ledger-actions'
import TitheLedger from '@/components/ledger/TitheLedger'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function LedgerPage({ params }: { params: Promise<{ tenantId: string }> }) {
    const { tenantId } = await params
    const heads = await getLedgerHeads(tenantId)
    const families = await getFamilies(tenantId) || []

    // Ensure we map Supabase return to expected shape
    const cleanFamilies = families.map((f: any) => ({ id: f.id, head_name: f.head_name }))

    // Mock heads if empty for demo
    const displayHeads = heads && heads.length > 0 ? heads : [
        { id: '1', name: 'Tithe' },
        { id: '2', name: 'Mission' },
        { id: '3', name: 'Building' }
    ]

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Link href={`/${tenantId}/dashboard`} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8">Financial Operations</h1>
            <TitheLedger tenantId={tenantId} families={cleanFamilies} heads={displayHeads as any} />
        </div>
    )
}
