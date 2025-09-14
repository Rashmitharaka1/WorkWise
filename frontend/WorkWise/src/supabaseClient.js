import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project details
const supabaseUrl = "https://ovgxfqjwtrzpktffnfhs.supabase.co";

// ⚠️ Use the service_role key here (NOT anon key)
// Go to: Supabase Dashboard → Project Settings → API → Service Role Key
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92Z3hmcWp3dHJ6cGt0ZmZuZmhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgzNDAxNCwiZXhwIjoyMDcwNDEwMDE0fQ.LrPMQt8-GR5gleON9VC8KJZayly_PrNf6qIRi6Azan0";

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
