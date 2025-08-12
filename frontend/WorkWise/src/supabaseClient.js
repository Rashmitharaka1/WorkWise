import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project details
const supabaseUrl = "https://ovgxfqjwtrzpktffnfhs.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92Z3hmcWp3dHJ6cGt0ZmZuZmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzQwMTQsImV4cCI6MjA3MDQxMDAxNH0.OjgNzB5peP2gH6xYPgGlKoT6ntvb0Kq4i00maMmv8ZI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
