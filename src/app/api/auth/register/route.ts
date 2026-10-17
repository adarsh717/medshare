import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { setSessionCookie } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validations";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, fullName, phoneNumber, role, city, state } = parsed.data;

    // Disallow self-registration as admin
    if ((role as string) === "admin") {
      return NextResponse.json(
        { error: "Administrator accounts cannot be provisioned via public registration." },
        { status: 403 }
      );
    }

    // Check existing email
    const existing = await dataStore.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 409 }
      );
    }

    // 1. Supabase Auth signup if available
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            role,
            city,
            state,
          },
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (data.user) {
        const profile = await dataStore.createUser({
          email,
          fullName,
          phoneNumber,
          role,
          city,
          state,
          passwordHash: password,
        });

        setSessionCookie(profile.id);
        return NextResponse.json({ success: true, user: profile });
      }
    }

    // 2. Safe local store user creation
    const profile = await dataStore.createUser({
      email,
      fullName,
      phoneNumber,
      role,
      city,
      state,
      passwordHash: password,
    });

    setSessionCookie(profile.id);

    await dataStore.createAuditLog({
      userId: profile.id,
      userEmail: profile.email,
      action: "USER_REGISTRATION",
      entityType: "user",
      entityId: profile.id,
      details: { role, city, state },
    });

    return NextResponse.json({ success: true, user: profile }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
