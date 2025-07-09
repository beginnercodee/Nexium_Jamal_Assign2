import { createClient } from "@supabase/supabase-js";

// Use named export like createSupabaseAdminClient to avoid name conflict
export const createSupabaseAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceRoleKey);
};
