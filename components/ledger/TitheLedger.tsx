
'use client'

import { useState } from 'react'
import { createTransaction } from '@/actions/ledger-actions'
import { generateWhatsAppLink } from '@/utils/whatsapp'

interface Family {
    id: string
    head_name: string
}

interface Head {
    id: string
    name: string
}

export default function TitheLedger({ tenantId, families, heads }: { tenantId: string, families: Family[], heads: Head[] }) {
    const [selectedFamily, setSelectedFamily] = useState('')
    const [amount, setAmount] = useState('')
    const [selectedHead, setSelectedHead] = useState(heads[0]?.id || '')
    const [waToggle, setWaToggle] = useState(true)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createTransaction({
                tenant_id: tenantId,
                family_id: selectedFamily,
                head_id: selectedHead,
                amount: Number(amount),
                date: new Date().toISOString()
            })

            if (waToggle) {
                // Hardcoded phone for demo, in real app fetch from family/member
                // For prototype, we'll prompt or use a dummy.
                // Since Family -> Head Name, we use head_name in message.
                const fam = families.find(f => f.id === selectedFamily)
                const headName = heads.find(h => h.id === selectedHead)?.name
                const msg = `Received ₹${amount} for ${headName} from ${fam?.head_name}. God bless!`

                // Using a dummy phone mostly unless we have Member Data. 
                // Implementation Plan said "No-API Receipt", so opening wa.me link.
                // User clicks the link.
                const link = generateWhatsAppLink('919876543210', msg) // Placeholder phone
                if (link) window.open(link, '_blank')
            }

            setAmount('')
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-6">Tithe & Offering Ledger</h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium mb-1">Select Family</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedFamily}
                        onChange={e => setSelectedFamily(e.target.value)}
                        required
                    >
                        <option value="">-- Choose Family --</option>
                        {families?.map(f => (
                            <option key={f.id} value={f.id}>{f.head_name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Head</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedHead}
                            onChange={e => setSelectedHead(e.target.value)}
                        >
                            {heads?.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <input
                        type="checkbox"
                        id="wa"
                        checked={waToggle}
                        onChange={e => setWaToggle(e.target.checked)}
                    />
                    <label htmlFor="wa" className="text-sm font-medium cursor-pointer">
                        Generate WhatsApp Receipt
                    </label>
                </div>

                <button disabled={loading} className="w-full bg-primary text-primary-foreground py-2 rounded font-bold hover:opacity-90">
                    {loading ? 'Saving...' : 'Record Transaction'}
                </button>
            </form>
        </div>
    )
}
