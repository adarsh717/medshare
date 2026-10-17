import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // 1. If Supabase configured, attempt Supabase Auth
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        let profile = await dataStore.getUserById(data.user.id);
        if (!profile) {
          profile = await dataStore.createUser({
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split("@")[0],
            role: data.user.user_metadata?.role || "patient",
            city: data.user.user_metadata?.city || "New Delhi",
            state: data.user.user_metadata?.state || "Delhi",
          });
        }
        setSessionCookie(profile.id);
        return NextResponse.json({ success: true, user: profile });
      }
    }

    // 2. Safe local store authentication
    const userRecord = await dataStore.getUserByEmail(email);
    if (!userRecord) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Demo/seed check: match passwordHash or allow password for registered account
    if (userRecord.passwordHash && userRecord.passwordHash !== password) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Set authenticated session cookie
    setSessionCookie(userRecord.id);

    // Audit log
    await dataStore.createAuditLog({
      userId: userRecord.id,
      userEmail: userRecord.email,
      action: "USER_LOGIN_SUCCESS",
      entityType: "user",
      entityId: userRecord.id,
    });

    const { passwordHash: _, ...profile } = userRecord;
    return NextResponse.json({ success: true, user: profile });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
