'use client'

import { useState } from 'react'
import { createCommittee } from '@/actions/committee-actions'
import { DenominationType, getLingo } from '@/constants/denominations'

export default function CommitteeFactory({ tenantId, denomination }: { tenantId: string, denomination: DenominationType }) {
    const [name, setName] = useState('')
    const lingo = getLingo(denomination)
    const [isPreset, setIsPreset] = useState(false)
    const [budget, setBudget] = useState('')
    const [loading, setLoading] = useState(false)

    // Auto-fill for known presets
    const handlePresetChange = (presetName: string) => {
        setName(presetName)
        setIsPreset(true)
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createCommittee({
                tenant_id: tenantId,
                name,
                budget_total: Number(budget)
            })
            setName('')
            setBudget('')
            alert('Committee created successfully!')
        } catch (err: any) {
            alert('Error: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Create New {lingo.committee}</h2>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handlePresetChange(lingo.youth)}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                >
                    {lingo.youth}
                </button>
                <button
                    onClick={() => handlePresetChange(lingo.women)}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                >
                    {lingo.women}
                </button>
                <button
                    onClick={() => handlePresetChange(lingo.men)}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                >
                    {lingo.men}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Committee Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background"
                        placeholder="e.g., Building Committee, TKP"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Allocated Budget</label>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background"
                        placeholder="0.00"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Committee'}
                </button>
            </form>
        </div>
    )
}
