import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch {
    // Continue even if Supabase logout throws
  }

  clearSessionCookie();
  return NextResponse.json({ success: true });
}
