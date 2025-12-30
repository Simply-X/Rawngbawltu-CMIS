
'use client'

import { login, signup } from '@/app/auth/actions'
import { useState } from 'react'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)

        try {
            const result = isLogin ? await login(formData) : await signup(formData)
            if (result && 'error' in result) {
                setError(result.error || 'An unknown error occurred')
            } else if (result && 'message' in result) {
                alert(result.message)
            }
        } catch (err: any) {
            // Redirects throw errors in Next.js, so we need to catch usually, but server actions handle redirects differently.
            // If we get here, it might be a real error or just the redirect being intercepted if not handled right.
            // Actually server action redirects don't throw in the client handler in the same way if strictly used.
            // But if it does, we ignore 'NEXT_REDIRECT'
            if (!err.message.includes('NEXT_REDIRECT')) setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Rawngbawltu
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {isLogin ? 'Welcome back, servant leader.' : 'Start your digital ministry.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input name="fullName" required className="w-full p-2 border rounded-md" placeholder="Upa Lal..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Church/Tenant Name</label>
                                <input name="tenantName" required className="w-full p-2 border rounded-md" placeholder="BCM Electric Veng" />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input name="email" type="email" required className="w-full p-2 border rounded-md" placeholder="example@email.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input name="password" type="password" required className="w-full p-2 border rounded-md" placeholder="••••••••" />
                    </div>

                    <button disabled={loading} className="w-full bg-primary text-primary-foreground py-2 rounded-md font-bold hover:opacity-90 transition transform active:scale-95">
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary hover:underline font-medium"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    )
}
