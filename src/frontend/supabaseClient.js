import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zdhjexmsbgozpxroeaud.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaGpleG1zYmdvenB4cm9lYXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxODU3NTUsImV4cCI6MjA3Mzc2MTc1NX0.E_NmaPHl2jK_h8CTHqzfF5K8cTUMehs7Bf9nHdjLizM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);