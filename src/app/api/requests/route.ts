import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { getCurrentUser } from "@/lib/auth/session";
import { medicalAssistanceSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const result = await dataStore.getRequests({
      category,
      status,
      city,
      search,
      userId,
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
      return NextResponse.json({ error: "Authentication required to submit assistance requests." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = medicalAssistanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newRequest = await dataStore.createAssistanceRequest({
      userId: user.id,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description,
      city: parsed.data.city,
      state: parsed.data.state,
      locality: parsed.data.locality,
      priority: parsed.data.priority,
      status: "submitted",
      preferredContactMethod: parsed.data.preferredContactMethod,
      consentGiven: parsed.data.consentGiven,
    });

    await dataStore.createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "CREATE_ASSISTANCE_REQUEST",
      entityType: "assistance_request",
      entityId: newRequest.id,
      details: { category: newRequest.category, title: newRequest.title },
    });

    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
