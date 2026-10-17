import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { getCurrentUser } from "@/lib/auth/session";
import { donorRegistrationSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bloodGroup = searchParams.get("bloodGroup") || undefined;
    const city = searchParams.get("city") || undefined;
    const availability = searchParams.get("availability") || undefined;

    const donors = await dataStore.getVoluntaryDonors({
      bloodGroup,
      city,
      availability,
    });

    return NextResponse.json({ donors, total: donors.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to register as a voluntary blood donor." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = donorRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const donorProfile = await dataStore.upsertDonorProfile(user.id, {
      bloodGroup: data.bloodGroup,
      city: data.city,
      state: data.state,
      locality: data.locality,
      availabilityStatus: data.availabilityStatus,
      preferredContactMethod: data.preferredContactMethod,
      consentToContact: data.consentToContact,
      lastDonationDate: data.lastDonationDate,
      notes: data.notes,
    });

    // Also update user role to 'donor' if currently 'patient'
    if (user.role === "patient") {
      await dataStore.updateUserProfile(user.id, { role: "donor" });
    }

    await dataStore.createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "REGISTER_DONOR_PROFILE",
      entityType: "donor_profile",
      entityId: donorProfile.id,
      details: { bloodGroup: data.bloodGroup, city: data.city },
    });

    return NextResponse.json({ success: true, donorProfile }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
