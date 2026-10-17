import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { getCurrentUser } from "@/lib/auth/session";
import { organPledgeSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = organPledgeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const user = await getCurrentUser();

    // Log the pledge in audit log
    await dataStore.createAuditLog({
      userId: user?.id,
      userEmail: data.email,
      action: "ORGAN_DONATION_PLEDGE_EXPRESSION",
      entityType: "organ_pledge",
      details: {
        pledgedOrgans: data.pledgedOrgans,
        city: data.city,
        state: data.state,
        disclaimerAcknowledged: true,
      },
    });

    if (user) {
      await dataStore.createNotification({
        userId: user.id,
        title: "Organ Donation Pledge Recorded",
        message: `Thank you for pledging awareness for ${data.pledgedOrgans.join(", ")}. Please also complete your official legal registration at NOTTO (notto.mohfw.gov.in).`,
        link: "/organ-donation",
        type: "system",
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Your voluntary expression of interest has been recorded. To legally register your donor pledge in the National Registry, please visit the Ministry of Health NOTTO portal (notto.mohfw.gov.in).",
      officialRegistryUrl: "https://notto.mohfw.gov.in",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
