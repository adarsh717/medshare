import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { getCurrentUser } from "@/lib/auth/session";
import { bloodRequestSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bloodGroup = searchParams.get("bloodGroup") || undefined;
    const urgency = searchParams.get("urgency") || undefined;
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const result = await dataStore.getBloodRequests({
      bloodGroup,
      urgency,
      city,
      search,
      limit,
      offset,
    });

    return NextResponse.json(result);
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
        { error: "Authentication required to submit a blood assistance request." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = bloodRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const newRequest = await dataStore.createBloodRequest({
      request: {
        userId: user.id,
        title: `Urgent ${data.bloodGroup} ${data.bloodComponent.replace(/_/g, " ")} needed at ${data.hospitalName}`,
        description: `Patient ${data.patientName} admitted at ${data.hospitalName}, ${data.city}. Contact: ${data.contactName} (${data.contactPhone}). ${data.medicalNotes || ""}`,
        city: data.city,
        state: data.state,
        locality: data.locality,
        priority: data.urgencyLevel,
        status: "submitted",
        preferredContactMethod: "in_app",
        consentGiven: data.consentGiven,
      },
      bloodDetails: {
        patientName: data.patientName,
        hospitalName: data.hospitalName,
        hospitalAddress: data.hospitalAddress,
        bloodGroup: data.bloodGroup,
        bloodComponent: data.bloodComponent,
        unitsNeeded: data.unitsNeeded,
        requiredDate: data.requiredDate,
        urgencyLevel: data.urgencyLevel,
        medicalNotes: data.medicalNotes,
      },
    });

    await dataStore.createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "CREATE_BLOOD_REQUEST",
      entityType: "blood_request",
      entityId: newRequest.id,
      details: {
        bloodGroup: data.bloodGroup,
        unitsNeeded: data.unitsNeeded,
        hospital: data.hospitalName,
      },
    });

    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
