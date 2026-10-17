import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { getCurrentUser } from "@/lib/auth/session";
import { surplusMedicineListingSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const status = searchParams.get("status") || undefined;
    const maxPriceStr = searchParams.get("maxPrice");
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const result = await dataStore.getSurplusMedicines({
      search,
      category,
      city,
      status,
      maxPrice,
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
        { error: "Authentication required to list leftover medicines." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = surplusMedicineListingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify expiry date is at least 30 days in the future
    const exp = new Date(data.expiryDate);
    const minExpiry = new Date();
    minExpiry.setDate(minExpiry.getDate() + 30);
    if (exp < minExpiry) {
      return NextResponse.json(
        { error: "For safety reasons, medicines expiring within 30 days or already expired cannot be listed." },
        { status: 400 }
      );
    }

    const listing = await dataStore.createSurplusMedicine({
      userId: user.id,
      sellerName: user.fullName,
      sellerContact: data.sellerContact,
      medicineName: data.medicineName,
      dosage: data.dosage,
      manufacturer: data.manufacturer,
      category: data.category,
      mrpPrice: data.mrpPrice,
      offeredPrice: data.offeredPrice,
      quantityRemaining: data.quantityRemaining,
      expiryDate: data.expiryDate,
      batchNumber: data.batchNumber,
      packagingCondition: data.packagingCondition,
      city: data.city,
      state: data.state,
      locality: data.locality,
      notes: data.notes,
      status: "available",
    });

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
