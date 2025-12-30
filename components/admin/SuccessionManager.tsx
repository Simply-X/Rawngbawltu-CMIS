
'use client'

import { useState } from 'react'
import { transferSuperAdmin } from '@/actions/succession-actions'
import { AlertTriangle } from 'lucide-react'

export default function SuccessionManager({ currentAdminId, members }: { currentAdminId: string, members: any[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedSuccessor, setSelectedSuccessor] = useState('')
    const [keepAccess, setKeepAccess] = useState(true)
    const [loading, setLoading] = useState(false)

    // Filter out self
    const candidates = members.filter(m => m.id !== currentAdminId)

    const handleTransfer = async () => {
        if (!selectedSuccessor) return alert('Please select a successor')
        if (!confirm('Are you sure? This will grant Super Admin rights.')) return

        setLoading(true)
        try {
            await transferSuperAdmin(currentAdminId, selectedSuccessor, keepAccess)
            alert('Succession Complete.')
            setIsOpen(false)
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="p-6 bg-red-50 border border-red-100 rounded-lg">
                <h3 className="font-bold text-red-900 mb-2">Succession Planning</h3>
                <p className="text-sm text-red-700 mb-4">Authorize a successor to take over Super Admin rights.</p>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded shadow-sm hover:bg-red-50 transition"
                >
                    Authorize Successor
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <div className="flex items-center gap-2 text-red-600 mb-4">
                            <AlertTriangle />
                            <h2 className="text-xl font-bold">Authorize Successor</h2>
                        </div>

                        <p className="mb-4 text-sm text-muted-foreground">
                            Choose a member to promote to Super Admin. You can choose to retain your own access (Dual Admin) or step down completely.
                        </p>

                        <div className="sapce-y-4">
                            <label className="block text-sm font-medium mb-1">Select Successor</label>
                            <select
                                className="w-full p-2 border rounded mb-4"
                                value={selectedSuccessor}
                                onChange={e => setSelectedSuccessor(e.target.value)}
                            >
                                <option value="">-- Select Member --</option>
                                {candidates.map(c => (
                                    <option key={c.id} value={c.id}>{c.full_name} ({c.role})</option>
                                ))}
                            </select>

                            <div className="flex items-center gap-2 mb-6">
                                <input
                                    type="checkbox"
                                    id="keep"
                                    checked={keepAccess}
                                    onChange={e => setKeepAccess(e.target.checked)}
                                />
                                <label htmlFor="keep" className="text-sm">Retain my Super Admin access (Dual Admin)</label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm">Cancel</button>
                                <button
                                    onClick={handleTransfer}
                                    disabled={loading || !selectedSuccessor}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                >
                                    {loading ? 'Transferring...' : 'Confirm Transfer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
