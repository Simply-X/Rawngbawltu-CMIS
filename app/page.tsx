
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: tenants } = await supabase.from('tenants').select('*')

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Rawngbawltu CMIS</h1>

      <div className="space-y-4">
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Select Tenant</h2>
          <div className="space-y-2">
            {tenants?.map((t) => (
              <Link key={t.id} href={`/${t.id}/dashboard`} className="block p-4 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition font-medium">
                {t.name} <span className="text-xs opacity-50 ml-2">({t.denomination})</span>
              </Link>
            ))}
            {(!tenants || tenants.length === 0) && <p className="text-muted-foreground text-center">No tenants found.</p>}
          </div>
        </div>

        {/* Helper to create generic tenant for testing if empty */}
        <form action={async () => {
          'use server'
          const sb = await createClient()
          await sb.from('tenants').insert({ name: 'Central Church', denomination: 'BCM' })
        }}>
          <button type="submit" className="w-full py-3 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:bg-muted/50 transition">
            + Quick Create Test Tenant (BCM)
          </button>
        </form>
      </div>
    </div>
  )
}
