import { cookies } from "next/headers";
import { dataStore } from "@/lib/data/store";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UserProfile, UserRole } from "@/types";

const SESSION_COOKIE_NAME = "medshare_session_id";

export async function getCurrentUser(): Promise<UserProfile | null> {
  // 1. Try Supabase Auth first if configured
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch profile
        const profile = await dataStore.getUserById(user.id);
        if (profile) return profile;

        // Auto-provision profile from auth user metadata if not yet in store
        const newProf = await dataStore.createUser({
          email: user.email || "",
          fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          role: (user.user_metadata?.role as UserRole) || "patient",
          city: user.user_metadata?.city || "New Delhi",
          state: user.user_metadata?.state || "Delhi",
        });
        return newProf;
      }
    } catch {
      // Fallback to local session cookie if Supabase call fails
    }
  }

  // 2. Local fallback session cookie
  const cookieStore = cookies();
  const sessionUserId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionUserId) return null;

  return dataStore.getUserById(sessionUserId);
}

export async function requireUser(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<UserProfile> {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export function setSessionCookie(userId: string) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
