import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { getCurrentUser } from "@/lib/auth/session";
import { medicineAssistanceSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to submit medicine assistance inquiries." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = medicineAssistanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const request = await dataStore.createAssistanceRequest({
      userId: user.id,
      category: "medicine",
      title: `Affordable Medicine Assistance: ${data.medicineName} (${data.dosageOrStrength})`,
      description: `Inquiry for locating lawful, subsidized, or authorized pharmacy assistance for ${data.medicineName} (${data.dosageOrStrength}). Note: ${data.description}. (Valid prescription confirmed by applicant)`,
      city: data.city,
      state: data.state,
      locality: data.locality,
      priority: data.urgency,
      status: "submitted",
      preferredContactMethod: "in_app",
      consentGiven: true,
    });

    await dataStore.createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "SUBMIT_MEDICINE_INQUIRY",
      entityType: "assistance_request",
      entityId: request.id,
      details: {
        medicineName: data.medicineName,
        city: data.city,
        prescriptionAcknowledged: true,
      },
    });

    return NextResponse.json({ success: true, request }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
