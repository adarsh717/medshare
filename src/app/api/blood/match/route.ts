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

    // Anonymize matched donors: return safe public identifiers only
    const anonymized = matched.map((d) => ({
      id: d.id,
      donorName: d.donorName || "Voluntary Donor",
      bloodGroup: d.bloodGroup,
      city: d.city,
      locality: d.locality,
      availabilityStatus: d.availabilityStatus,
      preferredContactMethod: d.preferredContactMethod,
      registeredDate: d.createdAt,
    }));

    return NextResponse.json({
      bloodGroupRequested: bloodGroup,
      city,
      matchCount: anonymized.length,
      donors: anonymized,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
