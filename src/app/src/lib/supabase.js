import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qrazlmugtsycrjamxoqo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyYXpsbXVndHN5Y3JqYW14b3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MjI0ODcsImV4cCI6MjA2NDk5ODQ4N30.qiTfogt0f_tOHYDAOEdGC5zxErEpo1pJ2tArxot3ktg'

export const supabase = createClient(supabaseUrl, supabaseKey)