/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

// Retrieve variables from Vite env, with seamless fallbacks to the provided Supabase project credentials
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "https://mmfalbfdtxmugjyqefje.supabase.co";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZmFsYmZkdHhtdWdqeXFlZmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNzA1MjEsImV4cCI6MjA5Nzk0NjUyMX0.yk97DB8dRg0wZuvyW2SO_HoqmYsBN9uePSS8jpK7i4w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
