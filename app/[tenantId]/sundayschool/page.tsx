
import { getClasses } from '@/actions/sundayschool-actions'
import { getMembers } from '@/actions/member-actions'
import SSManager from '@/components/sundayschool/SSManager'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function SSPage({ params }: { params: Promise<{ tenantId: string }> }) {
    const { tenantId } = await params
    const classes = await getClasses(tenantId)
    const members = await getMembers() // In real app, filter by tenant

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <Link href={`/${tenantId}/dashboard`} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8">Sunday School Administration</h1>
            <SSManager tenantId={tenantId} classes={classes || []} teachers={members || []} />
        </div>
    )
}
