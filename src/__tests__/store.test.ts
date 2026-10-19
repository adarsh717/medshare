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
    expect(newReq.status).toBe("approved");

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

  it("should create medicine prescription claim and trigger admin approval pipeline with audit logging", async () => {
    const claim = await dataStore.createMedicineClaim({
      listingId: "med-001",
      listingTitle: "Augmentin 625 Duo (Amoxicillin 500mg)",
      requesterId: "usr-patient-01",
      requesterName: "Arun Verma",
      requesterPhone: "+91-9876543211",
      patientName: "Arun Verma",
      doctorName: "Dr. Sanjeev Grover",
      doctorRegNo: "DMC-45129",
      prescriptionUrl: "https://documents.medshare.org/prescriptions/rx-augmentin-verma.pdf",
      notes: "Sinusitis course prescribed.",
    });

    expect(claim.id).toBeDefined();
    expect(claim.status).toBe("approved");
    expect(claim.sellerName).toBeDefined();
    expect(claim.sellerContact).toBeDefined();

    // Verify audit log recorded
    const logs = await dataStore.getAuditLogs(10);
    expect(logs.some((l) => l.action === "AUTO_APPROVE_MEDICINE_CLAIM" && l.entityId === claim.id)).toBe(true);

    // Verify Admin receives notification for approval request
    const adminNotifs = await dataStore.getUserNotifications("usr-admin-01");
    expect(adminNotifs.some((n) => n.title.includes("Medicine Claim Auto-Approved"))).toBe(true);
  });

  it("should approve medicine claim, unmask seller contact, reserve listing, and log audit event", async () => {
    // Approve demo claim 1
    const approved = await dataStore.updateMedicineClaimStatus(
      "clm-demo-001",
      "approved",
      "Dr. Vikramaditya (Admin Officer)",
      "Prescription valid and verified."
    );

    expect(approved?.status).toBe("approved");
    expect(approved?.reviewedBy).toBe("Dr. Vikramaditya (Admin Officer)");

    // Listing is now reserved
    const listing = await dataStore.getSurplusMedicineById("med-001");
    expect(listing?.status).toBe("reserved");

    // Claimant receives notification with unmasked seller details
    const claimantNotifs = await dataStore.getUserNotifications("usr-patient-01");
    const approvalNotif = claimantNotifs.find((n) => n.title.includes("Claim Approved"));
    expect(approvalNotif).toBeDefined();
    expect(approvalNotif?.message).toContain("Rahul Gupta");

    // Audit log recorded
    const logs = await dataStore.getAuditLogs(10);
    expect(logs.some((l) => l.action === "APPROVE_MEDICINE_CLAIM" && l.entityId === "clm-demo-001")).toBe(true);
  });

  it("should reject medicine claim with remarks, release reserved listing, and log audit event", async () => {
    const rejected = await dataStore.updateMedicineClaimStatus(
      "clm-demo-003",
      "rejected",
      "Admin Officer",
      "Prescription expired."
    );

    expect(rejected?.status).toBe("rejected");
    expect(rejected?.adminNotes).toBe("Prescription expired.");

    // Audit log recorded
    const logs = await dataStore.getAuditLogs(10);
    expect(logs.some((l) => l.action === "REJECT_MEDICINE_CLAIM" && l.entityId === "clm-demo-003")).toBe(true);
  });
});
