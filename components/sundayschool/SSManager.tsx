
'use client'

import { useState } from 'react'
import { createClass, assignTeacher } from '@/actions/sundayschool-actions'

export default function SSManager({ tenantId, classes, teachers }: { tenantId: string, classes: any[], teachers: any[] }) {
    const [newClass, setNewClass] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createClass({ tenant_id: tenantId, name: newClass })
            setNewClass('')
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAssign = async (classId: string, teacherId: string) => {
        try {
            await assignTeacher(classId, teacherId)
        } catch (err: any) {
            alert(err.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-card border rounded-lg">
                <h2 className="font-bold text-lg mb-4">Manage Classes</h2>
                <form onSubmit={handleCreate} className="flex gap-2">
                    <input
                        value={newClass}
                        onChange={e => setNewClass(e.target.value)}
                        placeholder="New Class Name (e.g. Primary)"
                        className="flex-1 p-2 border rounded"
                        required
                    />
                    <button disabled={loading} className="bg-primary text-primary-foreground px-4 rounded font-medium">
                        {loading ? 'Adding...' : 'Add Class'}
                    </button>
                </form>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes?.map(c => (
                    <div key={c.id} className="p-4 bg-white border rounded shadow-sm">
                        <h3 className="font-bold text-xl mb-2">{c.name}</h3>
                        <div className="text-sm text-muted-foreground mb-4">
                            Teacher: {c.teacher?.full_name || 'Not assigned'}
                        </div>

                        <label className="text-xs font-semibold block mb-1">Assign Teacher:</label>
                        <select
                            className="w-full p-2 text-sm border rounded"
                            value={c.teacher_id || ''}
                            onChange={(e) => handleAssign(c.id, e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            {teachers?.map(t => (
                                <option key={t.id} value={t.id}>{t.full_name}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    )
}
