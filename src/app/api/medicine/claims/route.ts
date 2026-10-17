import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { getCurrentUser } from "@/lib/auth/session";
import { medicineClaimSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId") || undefined;

    const claims = await dataStore.getMedicineClaims(listingId, user.role === "admin" ? undefined : user.id);
    return NextResponse.json({ claims });
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
        { error: "Authentication required to claim medicines with prescription." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = medicineClaimSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const listing = await dataStore.getSurplusMedicineById(data.listingId);
    if (!listing) {
      return NextResponse.json({ error: "Medicine listing not found." }, { status: 404 });
    }

    if (listing.status !== "available") {
      return NextResponse.json(
        { error: "This medicine is no longer available or has already been claimed." },
        { status: 400 }
      );
    }

    const claim = await dataStore.createMedicineClaim({
      listingId: listing.id,
      listingTitle: `${listing.medicineName} (${listing.dosage})`,
      requesterId: user.id,
      requesterName: user.fullName,
      requesterPhone: data.requesterPhone,
      patientName: data.patientName,
      doctorName: data.doctorName,
      doctorRegNo: data.doctorRegNo,
      prescriptionUrl: data.prescriptionUrl,
      notes: data.notes,
    });

    return NextResponse.json({ success: true, claim }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
