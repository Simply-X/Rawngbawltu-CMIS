
import { getPrayerRequests } from '@/actions/prayer-actions'
import { getMembers } from '@/actions/member-actions'
import PrayerWall from '@/components/prayer/PrayerWall'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function PrayerPage({ params }: { params: Promise<{ tenantId: string }> }) {
    const { tenantId } = await params
    const requests = await getPrayerRequests(tenantId)

    // Checking current user would happen here in read auth.
    // Mocking usage: picking a random member to simulate "Me"
    const members = await getMembers()
    const me = members?.[0]?.id || 'uuid-placeholder'

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Link href={`/${tenantId}/dashboard`} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8 text-center">Prayer Request Wall</h1>
            <PrayerWall tenantId={tenantId} memberId={me} requests={requests || []} />
        </div>
    )
}
