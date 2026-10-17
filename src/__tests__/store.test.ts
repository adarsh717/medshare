import { describe, it, expect, beforeEach } from "vitest";
import { dataStore } from "@/lib/data/store";

describe("MedShare Data Access & Store Business Logic", () => {
  it("should retrieve initial verified healthcare resources", async () => {
    const { resources, total } = await dataStore.getResources();
    expect(total).toBeGreaterThanOrEqual(8);
    expect(resources.some((r) => r.name.includes("AIIMS"))).toBe(true);
    expect(resources.some((r) => r.category === "blood_bank")).toBe(true);
  });

  it("should match voluntary donors based on blood compatibility and location", async () => {
    // There is an O+ donor in New Delhi seeded in dataStore
    const matches = await dataStore.matchDonors("O+", "New Delhi");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((d) => d.city === "New Delhi")).toBe(true);
    expect(matches.every((d) => d.availabilityStatus === "available")).toBe(true);
    expect(matches.every((d) => d.consentToContact)).toBe(true);
  });

  it("should mask private notes when fetching voluntary donors publicly", async () => {
    const donors = await dataStore.getVoluntaryDonors();
    donors.forEach((d) => {
      // @ts-expect-error notes should not be exposed in public listing
      expect(d.notes).toBeUndefined();
    });
  });

  it("should create assistance requests and track status progression", async () => {
    const user = await dataStore.createUser({
      email: "test.patient@medshare.org",
      fullName: "Test Patient",
      role: "patient",
      city: "Bengaluru",
      state: "Karnataka",
    });

    const newReq = await dataStore.createAssistanceRequest({
      userId: user.id,
      category: "equipment",
      title: "Need Pediatric Wheelchair",
      description: "Requesting wheelchair assistance for 4 weeks following femur cast recovery.",
      city: "Bengaluru",
      state: "Karnataka",
      priority: "standard",
      status: "submitted",
      preferredContactMethod: "in_app",
      consentGiven: true,
    });

    expect(newReq.id).toBeDefined();
    expect(newReq.status).toBe("submitted");

    // Transition status to matched
    const updated = await dataStore.updateRequestStatus(
      newReq.id,
      "matched",
      "admin-01",
      "Matched with Rotary equipment bank"
    );
    expect(updated?.status).toBe("matched");

    // Notification generated for user
    const notifications = await dataStore.getUserNotifications(user.id);
    expect(notifications.some((n) => n.title.includes("MATCHED"))).toBe(true);
  });

  it("should handle notification read lifecycle", async () => {
    const user = await dataStore.createUser({
      email: "notify.user@medshare.org",
      fullName: "Notification User",
      role: "donor",
      city: "New Delhi",
      state: "Delhi",
    });

    const notif = await dataStore.createNotification({
      userId: user.id,
      title: "Urgent Need Alert",
      message: "A patient requires blood in your locality.",
      type: "match_found",
    });

    expect(notif.isRead).toBe(false);

    let list = await dataStore.getUserNotifications(user.id);
    expect(list.some((n) => n.id === notif.id && !n.isRead)).toBe(true);

    // Mark as read
    await dataStore.markNotificationRead(notif.id, user.id);

    list = await dataStore.getUserNotifications(user.id);
    const readItem = list.find((n) => n.id === notif.id);
    expect(readItem?.isRead).toBe(true);
  });

  it("should handle provider verification approval workflow with audit logging", async () => {
    const admin = await dataStore.getUserByEmail("admin@medshare.org");
    expect(admin).toBeDefined();

    const submissions = await dataStore.getVerificationSubmissions("pending");
    expect(submissions.length).toBeGreaterThan(0);

    const targetSub = submissions[0];

    const reviewed = await dataStore.reviewVerificationSubmission(
      targetSub.id,
      admin!.id,
      "approved",
      "Verified against Maharashtra Clinical Establishment Registry"
    );

    expect(reviewed?.status).toBe("approved");

    // Check audit log recorded
    const logs = await dataStore.getAuditLogs(10);
    expect(logs.some((l) => l.action === "REVIEW_PROVIDER_VERIFICATION")).toBe(true);
  });
});
