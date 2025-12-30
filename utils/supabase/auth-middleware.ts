
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect routes starting with /[tenantId]
    // Excluding public assets, api, and login itself
    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        request.nextUrl.pathname !== '/' &&
        request.nextUrl.pathname.match(/^\/[^/]+\/dashboard/) // rudimentary check, better:
    ) {
        // Actually, standard pattern: if trying to access protected route AND no user -> login
        // Matches /[uuid]/...
        const path = request.nextUrl.pathname
        const isAsset = path.includes('.') // naive asset check
        const isAuthRoute = path.startsWith('/login') || path.startsWith('/auth') || path === '/'

        if (!user && !isAuthRoute && !isAsset) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return response
}
