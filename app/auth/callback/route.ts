import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Exchange code for session
        await supabase.auth.exchangeCodeForSession(code)

        // In a real Server Action / SSR app, we would use Cookie storage helper
        // For now with Client components, the session is stored in localStorage by default client-side
        // But since this is a Server Route, we can't set localStorage.
        // We redirect to a client page which will pick up the session or handle it.
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/dashboard', request.url))
}
