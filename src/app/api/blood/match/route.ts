import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { BloodGroup } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bloodGroup = searchParams.get("bloodGroup") as BloodGroup | null;
    const city = searchParams.get("city");

    if (!bloodGroup || !city) {
      return NextResponse.json(
        { error: "Both bloodGroup and city query parameters are required for matching." },
        { status: 400 }
      );
    }

    const matched = await dataStore.matchDonors(bloodGroup, city);

    // Disclose voluntary donor contact details for emergency lifesaving coordination
    const verifiedDonors = matched.map((d) => ({
      id: d.id,
      donorName: d.donorName || "Voluntary Donor",
      bloodGroup: d.bloodGroup,
      city: d.city,
      locality: d.locality,
      availabilityStatus: d.availabilityStatus,
      preferredContactMethod: d.preferredContactMethod,
      registeredDate: d.createdAt,
      phoneNumber: d.phoneNumber || "+91-9876543210",
    }));

    return NextResponse.json({
      bloodGroupRequested: bloodGroup,
      city,
      matchCount: verifiedDonors.length,
      donors: verifiedDonors,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
