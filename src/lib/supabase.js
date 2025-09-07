import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qtobyajzsiwkycwgjywn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0b2J5YWp6c2l3a3ljd2dqeXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMDI2NzAsImV4cCI6MjA3Mjc3ODY3MH0.IV35WXvmbg4aXvaLkMmDlDDLU98nzwD_jTMS5MTi028'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)