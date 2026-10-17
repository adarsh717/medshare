import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const result = await dataStore.getResources({
      category,
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
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can add healthcare directory resources." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const newResource = await dataStore.createResource({
      name: body.name,
      category: body.category,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      phone: body.phone,
      email: body.email,
      websiteUrl: body.websiteUrl,
      operationalHours: body.operationalHours || "24x7 Emergency Services",
      servicesOffered: body.servicesOffered || [],
      verified: true,
    });

    await dataStore.createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "CREATE_HEALTHCARE_RESOURCE",
      entityType: "healthcare_resource",
      entityId: newResource.id,
      details: { name: newResource.name, category: newResource.category },
    });

    return NextResponse.json({ success: true, resource: newResource }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
