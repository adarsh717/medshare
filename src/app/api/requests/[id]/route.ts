import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { getCurrentUser } from "@/lib/auth/session";
import { RequestStatus } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const request = await dataStore.getRequestById(params.id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const responses = await dataStore.getRequestResponses(params.id);

    return NextResponse.json({ request, responses });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const request = await dataStore.getRequestById(params.id);
    if (!request) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    // Only request owner or admin can update status
    const isOwner = request.userId === user.id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to modify this request." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const newStatus = body.status as RequestStatus;
    const reason = body.reason as string | undefined;

    const validStatuses: RequestStatus[] = [
      "submitted",
      "under_review",
      "additional_info_required",
      "matched",
      "resolved",
      "closed",
    ];

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const updated = await dataStore.updateRequestStatus(params.id, newStatus, user.id, reason);
    return NextResponse.json({ success: true, request: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to offer assistance." }, { status: 401 });
    }

    const request = await dataStore.getRequestById(params.id);
    if (!request) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    const body = await req.json();
    const message = body.message?.trim();
    if (!message || message.length < 5) {
      return NextResponse.json(
        { error: "Message must be at least 5 characters long." },
        { status: 400 }
      );
    }

    const responderType =
      user.role === "provider" ? "provider" : user.role === "donor" ? "donor" : "volunteer";

    const response = await dataStore.createRequestResponse({
      requestId: params.id,
      responderId: user.id,
      responderName: user.fullName,
      responderType,
      message,
      status: "offered",
    });

    return NextResponse.json({ success: true, response }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
