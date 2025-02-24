// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = 'https://gaeeapsnvhzocxaoskgj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZWVhcHNudmh6b2N4YW9za2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTA2MTIsImV4cCI6MjA1NTk2NjYxMn0.AukeJFvsDGdsZc5licVF0Lb8f5ci2EPLi6VTq5ClmcY'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Types for the application
export type Application = Database['public']['Tables']['applications']['Row'] & {
    options?: ApplicationOption[];
    // Added version property for Java application
    version?: string;
}

export type ApplicationOption = Database['public']['Tables']['application_options']['Row']

export type Optimization = Database['public']['Tables']['optimizations']['Row']

export type Tweak = Database['public']['Tables']['tweaks']['Row']