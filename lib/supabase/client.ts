import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
    // On the server, this might fail during build if not careful, but for client usage:
    console.warn("Supabase URL or Key is missing. Check .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
