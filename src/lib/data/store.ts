// ====================================================================
// MedShare Data Access & Store Layer
// Resilient database service supporting both Supabase and safe in-memory persistence
// ====================================================================

import {
  UserProfile,
  DonorProfile,
  AssistanceRequest,
  BloodRequestDetail,
  HealthcareResource,
  ProviderProfile,
  ProviderVerificationSubmission,
  RequestResponse,
  InAppNotification,
  AuditLog,
  BloodGroup,
  RequestStatus,
  UserRole,
  SurplusMedicineListing,
  MedicineClaimRequest,
  MedicineListingStatus,
  ClaimVerificationStatus,
  OrganDonationPledge,
} from "@/types";
import { gorakhpurSurplusMedicines } from "./gorakhpurMedicines";
import {
  UserRecord,
  seedResources,
  seedUsers,
  seedDonorProfiles,
  seedRequestsData,
  seedProviderProfiles,
  seedOrganPledges,
  seedMedicineClaims,
} from "./seedData";

class MedShareDataStore {
  private users: Map<string, UserRecord> = new Map();
  private donorProfiles: Map<string, DonorProfile> = new Map();
  private assistanceRequests: Map<string, AssistanceRequest> = new Map();
  private bloodDetails: Map<string, BloodRequestDetail> = new Map();
  private healthcareResources: Map<string, HealthcareResource> = new Map();
  private providerProfiles: Map<string, ProviderProfile> = new Map();
  private verificationSubmissions: Map<string, ProviderVerificationSubmission> = new Map();
  private organPledges: Map<string, OrganDonationPledge> = new Map();
  private requestResponses: Map<string, RequestResponse> = new Map();
  private notifications: Map<string, InAppNotification> = new Map();
  private auditLogs: AuditLog[] = [];
  private surplusMedicines: Map<string, SurplusMedicineListing> = new Map();
  private medicineClaims: Map<string, MedicineClaimRequest> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Initial Verified Healthcare Resources (Directory)
    seedResources.forEach((r) => this.healthcareResources.set(r.id, r));

    // 2. Demo Users & Voluntary Donors across ALL Blood Groups (A+, A-, B+, B-, AB+, AB-, O+, O-)
    seedUsers.forEach((u) => this.users.set(u.id, u));
    seedDonorProfiles.forEach((d) => this.donorProfiles.set(d.id, d));

    // 3. Emergency Blood Requests & Medical Assistance Requests
    seedRequestsData.bloodDetails.forEach((bd) => this.bloodDetails.set(bd.id, bd));
    seedRequestsData.requests.forEach((req) => {
      const bld = seedRequestsData.bloodDetails.find((b) => b.requestId === req.id);
      if (bld) req.bloodDetails = bld;
      this.assistanceRequests.set(req.id, req);
    });

    // 4. Provider Profiles & Verification Submissions
    seedProviderProfiles.profiles.forEach((p) => this.providerProfiles.set(p.id, p));
    seedProviderProfiles.submissions.forEach((s) => this.verificationSubmissions.set(s.id, s));

    // 5. Organ Donation Pledges
    seedOrganPledges.forEach((plg) => this.organPledges.set(plg.id, plg));

    // 6. Verified Surplus Medicines (National & Curated Gorakhpur Inventory)
    const surplus1: SurplusMedicineListing = {
      id: "med-001",
      userId: "usr-patient-01",
      sellerName: "Arun Verma",
      sellerContact: "+91-9876543211",
      medicineName: "Augmentin 625 Duo",
      dosage: "Amoxicillin 500mg + Clavulanic Acid 125mg",
      manufacturer: "GlaxoSmithKline (GSK)",
      category: "Antibiotics",
      mrpPrice: 220,
      offeredPrice: 110, // 50% OFF!
      discountPercentage: 50,
      quantityRemaining: "1 Full Sealed Strip (10 Tablets)",
      expiryDate: "2027-05-30",
      batchNumber: "B2026-AUG",
      packagingCondition: "sealed_blister",
      city: "New Delhi",
      state: "Delhi",
      locality: "Hauz Khas",
      notes: "Doctor changed course after 3 days. Unopened brand new sealed aluminium blister strip stored in cool dry place.",
      status: "available",
      createdAt: "2026-10-16T10:00:00.000Z",
      updatedAt: "2026-10-16T10:00:00.000Z",
    };
    this.surplusMedicines.set(surplus1.id, surplus1);

    const surplus2: SurplusMedicineListing = {
      id: "med-002",
      userId: "usr-donor-01",
      sellerName: "Pooja Sharma",
      sellerContact: "+91-9876543212",
      medicineName: "Januvia 100mg",
      dosage: "Sitagliptin Phosphate 100mg",
      manufacturer: "MSD Pharmaceuticals",
      category: "Diabetes Care",
      mrpPrice: 380,
      offeredPrice: 190, // 50% OFF!
      discountPercentage: 50,
      quantityRemaining: "2 Full Sealed Strips (14 Tablets)",
      expiryDate: "2027-09-15",
      batchNumber: "JN-9941",
      packagingCondition: "sealed_blister",
      city: "New Delhi",
      state: "Delhi",
      locality: "South Extension",
      notes: "Prescribed dose changed by endocrinologist. 2 sealed blister packs remaining.",
      status: "available",
      createdAt: "2026-10-16T12:30:00.000Z",
      updatedAt: "2026-10-16T12:30:00.000Z",
    };
    this.surplusMedicines.set(surplus2.id, surplus2);

    const surplus3: SurplusMedicineListing = {
      id: "med-003",
      userId: "usr-patient-02",
      sellerName: "Rohan Desai",
      sellerContact: "+91-9876543214",
      medicineName: "Pantocid 40mg",
      dosage: "Pantoprazole Gastro-resistant 40mg",
      manufacturer: "Sun Pharma",
      category: "Gastrointestinal",
      mrpPrice: 160,
      offeredPrice: 80, // 50% OFF!
      discountPercentage: 50,
      quantityRemaining: "1 Strip (15 Tablets)",
      expiryDate: "2027-11-20",
      batchNumber: "PC-4021",
      packagingCondition: "sealed_blister",
      city: "Mumbai",
      state: "Maharashtra",
      locality: "Bandra West",
      notes: "Excess strip left after acid reflux recovery. Completely sealed.",
      status: "available",
      createdAt: "2026-10-15T15:00:00.000Z",
      updatedAt: "2026-10-15T15:00:00.000Z",
    };
    this.surplusMedicines.set(surplus3.id, surplus3);

    const surplus4: SurplusMedicineListing = {
      id: "med-004",
      userId: "usr-patient-03",
      sellerName: "Priya Nair",
      sellerContact: "+91-9876543215",
      medicineName: "Telma 40",
      dosage: "Telmisartan 40mg",
      manufacturer: "Glenmark Pharmaceuticals",
      category: "Cardiology & Blood Pressure",
      mrpPrice: 240,
      offeredPrice: 120, // 50% OFF!
      discountPercentage: 50,
      quantityRemaining: "2 Strips (30 Tablets)",
      expiryDate: "2027-08-10",
      batchNumber: "TL-819",
      packagingCondition: "sealed_blister",
      city: "Bengaluru",
      state: "Karnataka",
      locality: "Indiranagar",
      notes: "Cardiologist switched medication. Sealed boxes with hologram.",
      status: "available",
      createdAt: "2026-10-14T09:15:00.000Z",
      updatedAt: "2026-10-14T09:15:00.000Z",
    };
    this.surplusMedicines.set(surplus4.id, surplus4);

    gorakhpurSurplusMedicines.forEach((med) => {
      this.surplusMedicines.set(med.id, med);
    });

    // 7. Seed Diverse Medicine Claims
    seedMedicineClaims.forEach((clm) => this.medicineClaims.set(clm.id, clm));

    // 8. In-App Notifications
    this.createNotification({
      userId: "usr-patient-01",
      title: "Blood Request Submitted",
      message: "Your request for 2 units of O+ Platelets at AIIMS New Delhi has been published to voluntary donors.",
      link: "/blood/requests/req-b-001",
      type: "request_status",
    });

    this.createNotification({
      userId: "usr-donor-01",
      title: "Matching Blood Request Nearby",
      message: "A patient at AIIMS New Delhi is in urgent need of O+ platelets. Click to review request details.",
      link: "/blood/requests/req-b-001",
      type: "match_found",
    });

    // 9. System Audit Log
    this.auditLogs.push({
      id: "aud-001",
      userId: "usr-admin-01",
      userEmail: "admin@medshare.org",
      action: "SYSTEM_INITIALIZATION",
      entityType: "system",
      entityId: "core",
      details: { environment: "production-ready", timestamp: new Date().toISOString() },
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  }

  // --- USER & AUTH METHODS ---
  async getUserById(id: string): Promise<UserProfile | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const { passwordHash: _, ...profile } = user;
    return profile;
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    for (const u of Array.from(this.users.values())) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return u;
      }
    }
    return null;
  }

  async createUser(data: Omit<UserProfile, "id" | "createdAt" | "updatedAt"> & { passwordHash?: string }): Promise<UserProfile> {
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newRecord: UserRecord = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, newRecord);

    // Create welcome notification
    this.createNotification({
      userId: id,
      title: "Welcome to MedShare",
      message: "Your MedShare account has been created. Discover healthcare assistance or offer voluntary support.",
      link: "/dashboard",
      type: "system",
    });

    const { passwordHash: _, ...profile } = newRecord;
    return profile;
  }

  async updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated: UserRecord = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    const { passwordHash: _, ...profile } = updated;
    return profile;
  }

  // --- ASSISTANCE REQUESTS METHODS ---
  async getRequests(filters?: {
    category?: string;
    status?: string;
    city?: string;
    search?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ requests: AssistanceRequest[]; total: number }> {
    let list = Array.from(this.assistanceRequests.values());

    if (filters?.userId) {
      list = list.filter((r) => r.userId === filters.userId);
    }
    if (filters?.category && filters.category !== "all") {
      list = list.filter((r) => r.category === filters.category);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((r) => r.status === filters.status);
    }
    if (filters?.city && filters.city !== "all") {
      list = list.filter((r) => r.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q)
      );
    }

    // Sort descending by created date
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    const paginated = list.slice(offset, offset + limit);

    return { requests: paginated, total };
  }

  async getRequestById(id: string): Promise<AssistanceRequest | null> {
    const req = this.assistanceRequests.get(id);
    if (!req) return null;

    // Attach blood details if blood request
    if (req.category === "blood" && !req.bloodDetails) {
      for (const bd of Array.from(this.bloodDetails.values())) {
        if (bd.requestId === req.id) {
          req.bloodDetails = bd;
          break;
        }
      }
    }
    return req;
  }

  async createAssistanceRequest(
    data: Omit<AssistanceRequest, "id" | "createdAt" | "updatedAt">
  ): Promise<AssistanceRequest> {
    const id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const author = await this.getUserById(data.userId);

    const newReq: AssistanceRequest = {
      ...data,
      id,
      userName: author?.fullName,
      userEmail: author?.email,
      createdAt: now,
      updatedAt: now,
    };
    this.assistanceRequests.set(id, newReq);

    // Create notification for requester
    this.createNotification({
      userId: data.userId,
      title: "Assistance Request Created",
      message: `Your request "${data.title}" has been registered and is under review.`,
      link: `/dashboard/requests`,
      type: "request_status",
    });

    // Notify Administrator
    this.createNotification({
      userId: "usr-admin-01",
      title: `New Assistance Request: ${data.category.toUpperCase()}`,
      message: `${author?.fullName || "User"} requested ${data.category} assistance: "${data.title}" in ${data.city}. Requires admin review.`,
      link: "/dashboard/admin",
      type: "system",
    });

    // Record Audit Log
    this.createAuditLog({
      userId: data.userId,
      action: "CREATE_ASSISTANCE_REQUEST",
      entityType: "assistance_request",
      entityId: id,
      details: { title: data.title, category: data.category, city: data.city, priority: data.priority },
    });

    return newReq;
  }

  async createBloodRequest(data: {
    request: Omit<AssistanceRequest, "id" | "createdAt" | "updatedAt" | "category">;
    bloodDetails: Omit<BloodRequestDetail, "id" | "requestId" | "createdAt">;
  }): Promise<AssistanceRequest> {
    const reqId = `req-bld-${Date.now()}`;
    const bldId = `bld-${Date.now()}`;
    const now = new Date().toISOString();

    const author = await this.getUserById(data.request.userId);

    const bloodDetail: BloodRequestDetail = {
      ...data.bloodDetails,
      id: bldId,
      requestId: reqId,
      createdAt: now,
    };
    this.bloodDetails.set(bldId, bloodDetail);

    const newReq: AssistanceRequest = {
      ...data.request,
      id: reqId,
      category: "blood",
      userName: author?.fullName,
      userEmail: author?.email,
      bloodDetails: bloodDetail,
      createdAt: now,
      updatedAt: now,
    };
    this.assistanceRequests.set(reqId, newReq);

    // Notify matching voluntary donors (non-blocking notification generation)
    this.notifyMatchingDonors(newReq, bloodDetail);

    // Notify Administrator of emergency blood appeal
    this.createNotification({
      userId: "usr-admin-01",
      title: `Emergency Blood Request: ${data.bloodDetails.bloodGroup}`,
      message: `${author?.fullName || "Patient"} requested ${data.bloodDetails.unitsNeeded} unit(s) of ${data.bloodDetails.bloodGroup} at ${data.bloodDetails.hospitalName}, ${data.request.city}.`,
      link: "/dashboard/admin",
      type: "system",
    });

    // Record Audit Log
    this.createAuditLog({
      userId: data.request.userId,
      action: "CREATE_BLOOD_REQUEST",
      entityType: "blood_request",
      entityId: reqId,
      details: {
        bloodGroup: data.bloodDetails.bloodGroup,
        hospital: data.bloodDetails.hospitalName,
        city: data.request.city,
        unitsNeeded: data.bloodDetails.unitsNeeded,
        urgency: data.bloodDetails.urgencyLevel,
      },
    });

    return newReq;
  }

  private async notifyMatchingDonors(req: AssistanceRequest, details: BloodRequestDetail) {
    const matchingDonors = await this.matchDonors(details.bloodGroup, req.city);
    for (const donor of matchingDonors) {
      if (donor.userId !== req.userId && donor.consentToContact) {
        this.createNotification({
          userId: donor.userId,
          title: `Urgent Blood Need: ${details.bloodGroup} in ${req.city}`,
          message: `Patient at ${details.hospitalName} requires ${details.unitsNeeded} unit(s) of ${details.bloodGroup} ${details.bloodComponent.replace(/_/g, " ")}.`,
          link: `/blood/requests/${req.id}`,
          type: "match_found",
        });
      }
    }
  }

  async updateRequestStatus(
    id: string,
    status: RequestStatus,
    updatedByUserId: string,
    reason?: string
  ): Promise<AssistanceRequest | null> {
    const req = this.assistanceRequests.get(id);
    if (!req) return null;

    const previousStatus = req.status;
    req.status = status;
    req.updatedAt = new Date().toISOString();
    this.assistanceRequests.set(id, req);

    // Log the update
    this.createAuditLog({
      userId: updatedByUserId,
      action: "UPDATE_REQUEST_STATUS",
      entityType: "assistance_request",
      entityId: id,
      details: { previousStatus, newStatus: status, reason },
    });

    // Notify the request owner
    this.createNotification({
      userId: req.userId,
      title: `Request Status Updated: ${status.replace(/_/g, " ").toUpperCase()}`,
      message: `Your request "${req.title}" has been updated to "${status.replace(/_/g, " ")}".`,
      link: `/dashboard/requests`,
      type: "request_status",
    });

    return req;
  }

  // --- BLOOD REQUESTS & DONOR MATCHING ---
  async getBloodRequests(filters?: {
    bloodGroup?: string;
    urgency?: string;
    city?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ requests: AssistanceRequest[]; total: number }> {
    let list = Array.from(this.assistanceRequests.values()).filter((r) => r.category === "blood");

    // Populate bloodDetails
    list.forEach((r) => {
      if (!r.bloodDetails) {
        for (const bd of Array.from(this.bloodDetails.values())) {
          if (bd.requestId === r.id) {
            r.bloodDetails = bd;
            break;
          }
        }
      }
    });

    if (filters?.bloodGroup && filters.bloodGroup !== "all") {
      list = list.filter((r) => r.bloodDetails?.bloodGroup === filters.bloodGroup);
    }
    if (filters?.urgency && filters.urgency !== "all") {
      list = list.filter((r) => r.priority === filters.urgency || r.bloodDetails?.urgencyLevel === filters.urgency);
    }
    if (filters?.city && filters.city !== "all") {
      list = list.filter((r) => r.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.bloodDetails?.hospitalName.toLowerCase().includes(q) ||
          r.bloodDetails?.patientName.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    return { requests: list.slice(offset, offset + limit), total };
  }

  async matchDonors(bloodGroup: BloodGroup, city: string): Promise<DonorProfile[]> {
    // Compatible blood groups for red cell/whole blood assistance
    const compatibilityMap: Record<BloodGroup, BloodGroup[]> = {
      "O-": ["O-"],
      "O+": ["O+", "O-"],
      "A-": ["A-", "O-"],
      "A+": ["A+", "A-", "O+", "O-"],
      "B-": ["B-", "O-"],
      "B+": ["B+", "B-", "O+", "O-"],
      "AB-": ["AB-", "A-", "B-", "O-"],
      "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
    };

    const eligibleGroups = compatibilityMap[bloodGroup] || [bloodGroup];

    return Array.from(this.donorProfiles.values()).filter(
      (d) =>
        eligibleGroups.includes(d.bloodGroup) &&
        d.city.toLowerCase() === city.toLowerCase() &&
        d.availabilityStatus === "available" &&
        d.consentToContact
    );
  }

  async getDonorProfileByUserId(userId: string): Promise<DonorProfile | null> {
    for (const d of Array.from(this.donorProfiles.values())) {
      if (d.userId === userId) return d;
    }
    return null;
  }

  async upsertDonorProfile(
    userId: string,
    data: Omit<DonorProfile, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<DonorProfile> {
    let existing = await this.getDonorProfileByUserId(userId);
    const now = new Date().toISOString();
    const user = await this.getUserById(userId);

    if (existing) {
      existing = {
        ...existing,
        ...data,
        donorName: user?.fullName,
        updatedAt: now,
      };
      this.donorProfiles.set(existing.id, existing);
      return existing;
    } else {
      const id = `dnr-${Date.now()}`;
      const newProfile: DonorProfile = {
        ...data,
        id,
        userId,
        donorName: user?.fullName,
        createdAt: now,
        updatedAt: now,
      };
      this.donorProfiles.set(id, newProfile);
      return newProfile;
    }
  }

  async getVoluntaryDonors(filters?: {
    bloodGroup?: string;
    city?: string;
    availability?: string;
  }): Promise<Omit<DonorProfile, "notes">[]> {
    let list = Array.from(this.donorProfiles.values()).filter((d) => d.consentToContact);

    if (filters?.bloodGroup && filters.bloodGroup !== "all") {
      list = list.filter((d) => d.bloodGroup === filters.bloodGroup);
    }
    if (filters?.city && filters.city !== "all") {
      list = list.filter((d) => d.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters?.availability && filters.availability !== "all") {
      list = list.filter((d) => d.availabilityStatus === filters.availability);
    }

    // Mask private notes for privacy protection
    return list.map(({ notes: _, ...d }) => d);
  }

  // --- HEALTHCARE RESOURCES DIRECTORY ---
  async getResources(filters?: {
    category?: string;
    city?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ resources: HealthcareResource[]; total: number }> {
    let list = Array.from(this.healthcareResources.values());

    if (filters?.category && filters.category !== "all") {
      list = list.filter((r) => r.category === filters.category);
    }
    if (filters?.city && filters.city !== "all") {
      list = list.filter((r) => r.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.servicesOffered.some((s) => s.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    return { resources: list.slice(offset, offset + limit), total };
  }

  async getResourceById(id: string): Promise<HealthcareResource | null> {
    return this.healthcareResources.get(id) || null;
  }

  async createResource(
    resource: Omit<HealthcareResource, "id" | "createdAt" | "updatedAt">
  ): Promise<HealthcareResource> {
    const id = `res-${Date.now()}`;
    const now = new Date().toISOString();
    const newRes: HealthcareResource = {
      ...resource,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.healthcareResources.set(id, newRes);
    return newRes;
  }

  // --- PROVIDER PROFILES & VERIFICATION SUBMISSIONS ---
  async getProviderProfileByUserId(userId: string): Promise<ProviderProfile | null> {
    for (const p of Array.from(this.providerProfiles.values())) {
      if (p.userId === userId) return p;
    }
    return null;
  }

  async upsertProviderProfile(
    userId: string,
    data: Omit<ProviderProfile, "id" | "userId" | "createdAt" | "updatedAt" | "verificationStatus">
  ): Promise<ProviderProfile> {
    let existing = await this.getProviderProfileByUserId(userId);
    const now = new Date().toISOString();

    if (existing) {
      existing = {
        ...existing,
        ...data,
        updatedAt: now,
      };
      this.providerProfiles.set(existing.id, existing);
      return existing;
    } else {
      const id = `prv-${Date.now()}`;
      const newProfile: ProviderProfile = {
        ...data,
        id,
        userId,
        verificationStatus: "pending",
        createdAt: now,
        updatedAt: now,
      };
      this.providerProfiles.set(id, newProfile);
      return newProfile;
    }
  }

  async submitProviderVerification(
    providerId: string,
    orgName: string,
    docName: string,
    docType: string,
    docUrl: string,
    notes?: string
  ): Promise<ProviderVerificationSubmission> {
    const id = `sub-${Date.now()}`;
    const submission: ProviderVerificationSubmission = {
      id,
      providerId,
      organizationName: orgName,
      documentName: docName,
      documentType: docType,
      documentUrl: docUrl,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.verificationSubmissions.set(id, submission);
    return submission;
  }

  async getVerificationSubmissions(status?: string): Promise<ProviderVerificationSubmission[]> {
    let list = Array.from(this.verificationSubmissions.values());
    if (status && status !== "all") {
      list = list.filter((s) => s.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async reviewVerificationSubmission(
    submissionId: string,
    adminUserId: string,
    status: "approved" | "rejected",
    adminNotes?: string
  ): Promise<ProviderVerificationSubmission | null> {
    const sub = this.verificationSubmissions.get(submissionId);
    if (!sub) return null;

    sub.status = status;
    sub.reviewedBy = adminUserId;
    sub.reviewedAt = new Date().toISOString();
    sub.adminNotes = adminNotes;
    this.verificationSubmissions.set(submissionId, sub);

    // Update the corresponding provider profile
    const provider = this.providerProfiles.get(sub.providerId);
    if (provider) {
      provider.verificationStatus = status === "approved" ? "verified" : "rejected";
      if (status === "approved") {
        provider.verifiedAt = new Date().toISOString();
        provider.verifiedBy = adminUserId;
      }
      this.providerProfiles.set(provider.id, provider);

      // Notify the provider
      this.createNotification({
        userId: provider.userId,
        title: `Verification ${status === "approved" ? "Approved" : "Rejected"}`,
        message:
          status === "approved"
            ? `Your organization "${provider.organizationName}" has been verified as an authorized healthcare provider.`
            : `Your verification submission was reviewed. Note: ${adminNotes || "Requirements not met."}`,
        link: "/dashboard/provider",
        type: "verification_update",
      });
    }

    // Audit log
    this.createAuditLog({
      userId: adminUserId,
      action: "REVIEW_PROVIDER_VERIFICATION",
      entityType: "provider_verification",
      entityId: submissionId,
      details: { status, adminNotes, providerId: sub.providerId },
    });

    return sub;
  }

  // --- NOTIFICATIONS ---
  async getUserNotifications(userId: string): Promise<InAppNotification[]> {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(
    data: Omit<InAppNotification, "id" | "createdAt" | "isRead">
  ): Promise<InAppNotification> {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const notification: InAppNotification = {
      ...data,
      id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationRead(id: string, userId: string): Promise<boolean> {
    const notif = this.notifications.get(id);
    if (!notif || notif.userId !== userId) return false;
    notif.isRead = true;
    this.notifications.set(id, notif);
    return true;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    for (const notif of Array.from(this.notifications.values())) {
      if (notif.userId === userId) {
        notif.isRead = true;
        this.notifications.set(notif.id, notif);
      }
    }
  }

  // --- REQUEST RESPONSES ---
  async createRequestResponse(
    data: Omit<RequestResponse, "id" | "createdAt" | "updatedAt">
  ): Promise<RequestResponse> {
    const id = `rsp-${Date.now()}`;
    const now = new Date().toISOString();
    const resp: RequestResponse = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.requestResponses.set(id, resp);

    // Notify request owner
    const request = this.assistanceRequests.get(data.requestId);
    if (request && request.userId !== data.responderId) {
      this.createNotification({
        userId: request.userId,
        title: "New Response to Your Request",
        message: `${data.responderName} (${data.responderType}) responded to "${request.title}".`,
        link: `/blood/requests/${request.id}`,
        type: "request_status",
      });
    }

    return resp;
  }

  async getRequestResponses(requestId: string): Promise<RequestResponse[]> {
    return Array.from(this.requestResponses.values())
      .filter((r) => r.requestId === requestId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- AUDIT LOGS ---
  async createAuditLog(entry: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
    const log: AuditLog = {
      ...entry,
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  async getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    return this.auditLogs.slice(0, limit);
  }

  // --- SURPLUS MEDICINE EXCHANGE (50% OFF RESALE / DONATION WITH PRESCRIPTION) ---
  async getSurplusMedicines(filters?: {
    search?: string;
    category?: string;
    city?: string;
    status?: string;
    maxPrice?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ medicines: SurplusMedicineListing[]; total: number }> {
    let list = Array.from(this.surplusMedicines.values());

    if (filters?.status && filters.status !== "all") {
      list = list.filter((m) => m.status === filters.status);
    } else {
      list = list.filter((m) => m.status === "available");
    }

    if (filters?.category && filters.category !== "all") {
      list = list.filter((m) => m.category.toLowerCase().includes(filters.category!.toLowerCase()));
    }

    if (filters?.city && filters.city !== "all") {
      list = list.filter((m) => m.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }

    if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
      list = list.filter((m) => m.offeredPrice <= filters.maxPrice!);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.medicineName.toLowerCase().includes(q) ||
          m.dosage.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          (m.locality && m.locality.toLowerCase().includes(q)) ||
          (m.manufacturer && m.manufacturer.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    return { medicines: list.slice(offset, offset + limit), total };
  }

  async getSurplusMedicineById(id: string): Promise<SurplusMedicineListing | null> {
    return this.surplusMedicines.get(id) || null;
  }

  async createSurplusMedicine(
    data: Omit<SurplusMedicineListing, "id" | "createdAt" | "updatedAt" | "discountPercentage">
  ): Promise<SurplusMedicineListing> {
    const id = `med-list-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const discountPercentage =
      data.mrpPrice > 0
        ? Math.round(((data.mrpPrice - data.offeredPrice) / data.mrpPrice) * 100)
        : 0;

    const newListing: SurplusMedicineListing = {
      ...data,
      id,
      discountPercentage,
      createdAt: now,
      updatedAt: now,
    };

    this.surplusMedicines.set(id, newListing);

    this.createAuditLog({
      userId: data.userId,
      action: "CREATE_SURPLUS_MEDICINE_LISTING",
      entityType: "surplus_medicine",
      entityId: id,
      details: {
        medicineName: data.medicineName,
        mrpPrice: data.mrpPrice,
        offeredPrice: data.offeredPrice,
        discountPercentage,
        expiryDate: data.expiryDate,
      },
    });

    return newListing;
  }

  async updateSurplusMedicineStatus(
    id: string,
    status: MedicineListingStatus
  ): Promise<SurplusMedicineListing | null> {
    const item = this.surplusMedicines.get(id);
    if (!item) return null;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    this.surplusMedicines.set(id, item);
    return item;
  }

  async createMedicineClaim(
    data: Omit<MedicineClaimRequest, "id" | "createdAt" | "status">
  ): Promise<MedicineClaimRequest> {
    const id = `claim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const listing = this.surplusMedicines.get(data.listingId);

    const claim: MedicineClaimRequest = {
      ...data,
      id,
      sellerName: data.sellerName || listing?.sellerName,
      sellerContact: data.sellerContact || listing?.sellerContact,
      locality: data.locality || listing?.locality,
      city: data.city || listing?.city,
      mrpPrice: data.mrpPrice !== undefined ? data.mrpPrice : listing?.mrpPrice,
      offeredPrice: data.offeredPrice !== undefined ? data.offeredPrice : listing?.offeredPrice,
      status: "pending_verification",
      createdAt: now,
    };

    this.medicineClaims.set(id, claim);

    // 1. Notify Seller
    if (listing) {
      this.createNotification({
        userId: listing.userId,
        title: `Prescription Claim for ${listing.medicineName}`,
        message: `${data.requesterName} uploaded a prescription requesting "${listing.medicineName}". MedShare Admin will verify prescription authenticity before final exchange.`,
        link: `/dashboard/requests`,
        type: "request_status",
      });
    }

    // 2. Notify Administrator of pending prescription claim review
    this.createNotification({
      userId: "usr-admin-01",
      title: "Medicine Claim Awaiting Review",
      message: `${data.patientName || data.requesterName} submitted a prescription claim for "${claim.listingTitle}". Doctor: Dr. ${data.doctorName} (Reg: ${data.doctorRegNo || "N/A"}). Please review & approve.`,
      link: "/dashboard/admin",
      type: "system",
    });

    // 3. Record Audit Log
    this.createAuditLog({
      userId: data.requesterId,
      action: "SUBMIT_MEDICINE_PRESCRIPTION_CLAIM",
      entityType: "medicine_claim",
      entityId: id,
      details: {
        listingId: data.listingId,
        listingTitle: claim.listingTitle,
        patientName: data.patientName,
        doctorName: data.doctorName,
        doctorRegNo: data.doctorRegNo,
        prescriptionUrl: data.prescriptionUrl,
      },
    });

    return claim;
  }

  async getMedicineClaims(listingId?: string, requesterId?: string): Promise<MedicineClaimRequest[]> {
    let list = Array.from(this.medicineClaims.values());
    if (listingId) {
      list = list.filter((c) => c.listingId === listingId);
    }
    if (requesterId) {
      list = list.filter((c) => c.requesterId === requesterId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateMedicineClaimStatus(
    claimId: string,
    status: ClaimVerificationStatus,
    reviewedBy?: string,
    adminNotes?: string
  ): Promise<MedicineClaimRequest | null> {
    const claim = this.medicineClaims.get(claimId);
    if (!claim) return null;
    claim.status = status;
    claim.reviewedBy = reviewedBy;
    claim.reviewedAt = new Date().toISOString();
    if (adminNotes) {
      claim.adminNotes = adminNotes;
    }
    this.medicineClaims.set(claimId, claim);

    const listing = this.surplusMedicines.get(claim.listingId);

    if (status === "approved") {
      if (listing) {
        listing.status = "reserved";
        this.surplusMedicines.set(listing.id, listing);
      }

      // Notify Claimant that claim was approved and provide unmasked seller details
      this.createNotification({
        userId: claim.requesterId,
        title: `✅ Medicine Claim Approved: ${claim.listingTitle}`,
        message: `Your prescription for ${claim.listingTitle} has been verified and approved by Admin. Seller: ${claim.sellerName || listing?.sellerName} (${claim.sellerContact || listing?.sellerContact}), Location: ${claim.locality || listing?.locality}, ${claim.city || listing?.city}. You may now contact the seller to collect your medicine.`,
        link: `/dashboard/requests`,
        type: "request_status",
      });

      // Notify Seller that prescription has been officially cleared
      if (listing) {
        this.createNotification({
          userId: listing.userId,
          title: `Prescription Verified: ${claim.listingTitle}`,
          message: `Admin has verified the prescription uploaded by ${claim.requesterName} (${claim.requesterPhone}). You may safely coordinate medicine handover.`,
          link: `/dashboard/requests`,
          type: "request_status",
        });
      }

      // Record Audit Log
      this.createAuditLog({
        userId: reviewedBy,
        action: "APPROVE_MEDICINE_CLAIM",
        entityType: "medicine_claim",
        entityId: claimId,
        details: {
          listingId: claim.listingId,
          listingTitle: claim.listingTitle,
          patientName: claim.patientName,
          requesterId: claim.requesterId,
          adminNotes,
          reviewedBy,
        },
      });
    } else if (status === "rejected") {
      // Revert listing to available if it was reserved
      if (listing && listing.status === "reserved") {
        listing.status = "available";
        this.surplusMedicines.set(listing.id, listing);
      }

      // Notify Claimant of rejection with reason
      this.createNotification({
        userId: claim.requesterId,
        title: `❌ Medicine Claim Not Approved: ${claim.listingTitle}`,
        message: `Your prescription claim for ${claim.listingTitle} was not approved.${adminNotes ? ` Remarks: ${adminNotes}` : ""}`,
        link: `/dashboard/requests`,
        type: "request_status",
      });

      // Record Audit Log
      this.createAuditLog({
        userId: reviewedBy,
        action: "REJECT_MEDICINE_CLAIM",
        entityType: "medicine_claim",
        entityId: claimId,
        details: {
          listingId: claim.listingId,
          listingTitle: claim.listingTitle,
          patientName: claim.patientName,
          requesterId: claim.requesterId,
          adminNotes,
          reviewedBy,
        },
      });
    } else if (status === "completed") {
      if (listing) {
        listing.status = "claimed";
        this.surplusMedicines.set(listing.id, listing);
      }

      // Notify Claimant that claim is completed
      this.createNotification({
        userId: claim.requesterId,
        title: `🎉 Medicine Handover Completed: ${claim.listingTitle}`,
        message: `Your medicine claim for ${claim.listingTitle} has been marked completed. Thank you for utilizing MedShare verified surplus medicine exchange!`,
        link: `/dashboard/requests`,
        type: "request_status",
      });

      // Record Audit Log
      this.createAuditLog({
        userId: reviewedBy,
        action: "COMPLETE_MEDICINE_CLAIM",
        entityType: "medicine_claim",
        entityId: claimId,
        details: {
          listingId: claim.listingId,
          listingTitle: claim.listingTitle,
          patientName: claim.patientName,
          requesterId: claim.requesterId,
          adminNotes,
          reviewedBy,
        },
      });
    }

    return claim;
  }

  async getMedicineClaimById(claimId: string): Promise<MedicineClaimRequest | null> {
    return this.medicineClaims.get(claimId) || null;
  }

  // --- ORGAN DONATION PLEDGES ---
  async getOrganPledges(): Promise<OrganDonationPledge[]> {
    return Array.from(this.organPledges.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createOrganPledge(
    data: Omit<OrganDonationPledge, "id" | "createdAt">
  ): Promise<OrganDonationPledge> {
    const id = `plg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const pledge: OrganDonationPledge = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.organPledges.set(id, pledge);
    return pledge;
  }
}

// Global Singleton to ensure memory persistence across hot reloads in Next.js
const globalForData = global as unknown as { medShareStore?: MedShareDataStore };
export const dataStore = globalForData.medShareStore || new MedShareDataStore();
if (process.env.NODE_ENV !== "production") {
  globalForData.medShareStore = dataStore;
}
