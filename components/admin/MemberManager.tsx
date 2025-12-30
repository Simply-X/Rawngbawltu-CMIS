
'use client'

import { useState } from 'react'
import { addMember, updateMemberRole, Role } from '@/actions/member-actions'
import { Plus, Shield, User } from 'lucide-react'

export default function MemberManager({ members }: { members: any[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState<Role>('Member')
    const [loading, setLoading] = useState(false)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await addMember({ full_name: name, phone, role })
            setIsOpen(false)
            setName('')
            setPhone('')
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (memberId: string, transformTo: Role) => {
        if (!confirm(`Are you sure you want to change this user to ${transformTo}?`)) return
        try {
            await updateMemberRole(memberId, transformTo)
        } catch (err: any) {
            alert(err.message)
        }
    }

    return (
        <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Members & Permissions</h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                    <Plus size={16} /> Add Member
                </button>
            </div>

            {isOpen && (
                <form onSubmit={handleAdd} className="mb-8 p-4 bg-muted rounded-md space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Full Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="p-2 rounded border"
                            required
                        />
                        <input
                            placeholder="Phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="p-2 rounded border"
                        />
                    </div>
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value as Role)}
                        className="w-full p-2 rounded border"
                    >
                        <option value="Member">Member</option>
                        <option value="CommitteeAdmin">Committee Admin</option>
                        <option value="SuperAdmin">Super Admin (Secretary/Asst)</option>
                    </select>
                    <button disabled={loading} className="w-full bg-black text-white p-2 rounded">
                        {loading ? 'Saving...' : 'Save New Member'}
                    </button>
                </form>
            )}

            <div className="space-y-2">
                {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${m.role === 'SuperAdmin' ? 'bg-red-100 text-red-600' : 'bg-slate-100'}`}>
                                {m.role === 'SuperAdmin' ? <Shield size={16} /> : <User size={16} />}
                            </div>
                            <div>
                                <p className="font-medium">{m.full_name}</p>
                                <p className="text-xs text-muted-foreground">{m.role} • {m.phone || 'No Phone'}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {m.role !== 'SuperAdmin' && (
                                <button
                                    onClick={() => handleRoleChange(m.id, 'SuperAdmin')}
                                    className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                                >
                                    Promote to Admin
                                </button>
                            )}
                            {m.role === 'SuperAdmin' && (
                                <button
                                    onClick={() => handleRoleChange(m.id, 'Member')}
                                    className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200"
                                >
                                    Demote
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
