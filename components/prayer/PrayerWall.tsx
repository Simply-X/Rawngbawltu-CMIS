
'use client'

import { useState } from 'react'
import { submitPrayerRequest } from '@/actions/prayer-actions'

export default function PrayerWall({ tenantId, memberId, requests }: { tenantId: string, memberId: string, requests: any[] }) {
    const [content, setContent] = useState('')
    const [anon, setAnon] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await submitPrayerRequest({
                tenant_id: tenantId,
                member_id: memberId,
                content,
                is_anonymous: anon
            })
            setContent('')
            alert('Request submitted.')
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="bg-card p-6 border rounded-lg shadow-sm">
                <h2 className="font-bold text-lg mb-4">Submit Prayer Request</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        className="w-full p-3 border rounded h-32"
                        placeholder="Share your burden..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                    />
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="anon" checked={anon} onChange={e => setAnon(e.target.checked)} />
                        <label htmlFor="anon" className="text-sm">Submit Anonymous</label>
                    </div>
                    <button disabled={loading} className="w-full bg-primary text-primary-foreground py-2 rounded font-bold">
                        {loading ? 'Submitting...' : 'Send Request'}
                    </button>
                </form>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4">Prayer Wall (Confidential)</h3>
                <div className="space-y-4">
                    {requests?.map(req => (
                        <div key={req.id} className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                            <p className="mb-2 whitespace-pre-wrap">{req.content}</p>
                            <p className="text-xs text-muted-foreground text-right">
                                - {req.is_anonymous ? 'Anonymous' : req.member?.full_name} | {new Date(req.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                    {requests?.length === 0 && <p className="text-muted-foreground text-center">No requests yet.</p>}
                </div>
            </div>
        </div>
    )
}
