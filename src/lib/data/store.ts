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
} from "@/types";

// In-Memory Seed Storage for robust operation & test execution
interface UserRecord extends UserProfile {
  passwordHash?: string;
}

class MedShareDataStore {
  private users: Map<string, UserRecord> = new Map();
  private donorProfiles: Map<string, DonorProfile> = new Map();
  private assistanceRequests: Map<string, AssistanceRequest> = new Map();
  private bloodDetails: Map<string, BloodRequestDetail> = new Map();
  private healthcareResources: Map<string, HealthcareResource> = new Map();
  private providerProfiles: Map<string, ProviderProfile> = new Map();
  private verificationSubmissions: Map<string, ProviderVerificationSubmission> = new Map();
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
    const initialResources: HealthcareResource[] = [
      {
        id: "res-001",
        name: "All India Institute of Medical Sciences (AIIMS)",
        category: "hospital",
        address: "Sri Aurobindo Marg, Ansari Nagar East",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110029",
        phone: "+91-11-26588500",
        email: "info@aiims.edu",
        websiteUrl: "https://www.aiims.edu",
        operationalHours: "24x7 Emergency and Trauma Services",
        servicesOffered: ["Emergency Medicine", "Oncology", "Cardiology", "Nephrology", "Organ Transplant", "Blood Bank"],
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "res-002",
        name: "Indian Red Cross Society National Blood Bank",
        category: "blood_bank",
        address: "1, Red Cross Road",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        phone: "+91-11-23716441",
        email: "bloodbank@indianredcross.org",
        websiteUrl: "https://www.indianredcross.org",
        operationalHours: "24 Hours Voluntary Blood Banking & Component Separation",
        servicesOffered: ["Whole Blood", "Packed Red Cells", "Platelets", "Fresh Frozen Plasma", "Apheresis"],
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "res-003",
        name: "Tata Memorial Hospital & Cancer Center",
        category: "hospital",
        address: "Dr. E Borges Road, Parel",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400012",
        phone: "+91-22-24177000",
        email: "crs@tmc.gov.in",
        websiteUrl: "https://tmc.gov.in",
        operationalHours: "24 Hours Oncology Care & Day Care Chemotherapy",
        servicesOffered: ["Oncology Consultation", "Radiation Therapy", "Subsidized Medicine Cell", "Palliative Care", "Blood Bank"],
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "res-004",
        name: "Rotary Blood Bank",
        category: "blood_bank",
        address: "56-57, Institutional Area, Sector 32",
        city: "Gurugram",
        state: "Haryana",
        pincode: "122001",
        phone: "+91-124-4061234",
        email: "contact@rotarybloodbank.org",
        websiteUrl: "https://www.rotarybloodbank.org",
        operationalHours: "24x7 Voluntary Blood Donation & Component Delivery",
        servicesOffered: ["Platelet Concentrates", "Leukodepleted Blood", "Cryoprecipitate", "Emergency Delivery Coordination"],
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "res-005",
        name: "Postgraduate Institute of Medical Education and Research (PGIMER)",
        category: "transplant_center",
        address: "Sector 12",
        city: "Chandigarh",
        state: "Chandigarh",
        pincode: "160012",
        phone: "+91-172-2746018",
        email: "pgimer-chd@nic.in",
        websiteUrl: "https://pgimer.edu.in",
        operationalHours: "24x7 Tertiary Care, ROTTO North Hub",
        servicesOffered: ["Organ Retrieval Banking Organization (ORBO)", "Cornea Transplant", "Renal Transplant", "Liver Transplant"],
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "res-006",
        name: "Pradhan Mantri Bhartiya Janaushadhi Kendra (Central Dispensary)",
        category: "authorized_pharmacy",
        address: "Near Safdarjung Hospital Gate No. 2, Ring Road",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110029",
        phone: "+91-11-26707444",
        email: "contact@janaushadhi.gov.in",
        websiteUrl: "http://janaushadhi.gov.in",
        operationalHours: "08:00 AM - 10:00 PM Daily",
        servicesOffered: ["Subsidized Generic Medicines", "Chronic Care Assistance", "Surgical Consumables", "Insulin & Diabetes Care"],
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "res-007",
        name: "Victoria Hospital (Bangalore Medical College)",
        category: "hospital",
        address: "Fort Road, near City Market",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560002",
        phone: "+91-80-26701150",
        email: "deanbmc@gmail.com",
        websiteUrl: "https://bmcri.edu.in",
        operationalHours: "24x7 Government Tertiary Care & Emergency",
        servicesOffered: ["General Surgery", "Burn Center", "Blood Bank", "Charitable Medicine Counter", "Dialysis Unit"],
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "res-008",
        name: "Jeevan Stem Cell & Blood Bank",
        category: "blood_bank",
        address: "22, Ritherdon Road, Vepery",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600007",
        phone: "+91-44-25322525",
        email: "jeevan@jeevan.org",
        websiteUrl: "https://jeevan.org",
        operationalHours: "24 Hours Component Testing & Distribution",
        servicesOffered: ["Platelets", "Stem Cell Registry", "Whole Blood", "Rare Blood Group Registry"],
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    initialResources.forEach((r) => this.healthcareResources.set(r.id, r));

    // 2. Demo Users for immediate testing
    const demoAdmin: UserRecord = {
      id: "usr-admin-01",
      email: "admin@medshare.org",
      fullName: "Platform Administrator",
      phoneNumber: "+91-9876543210",
      role: "admin",
      city: "New Delhi",
      state: "Delhi",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      passwordHash: "AdminPass@2026",
    };
    this.users.set(demoAdmin.id, demoAdmin);

    const demoPatient: UserRecord = {
      id: "usr-patient-01",
      email: "patient@medshare.org",
      fullName: "Arun Verma",
      phoneNumber: "+91-9876543211",
      role: "patient",
      city: "New Delhi",
      state: "Delhi",
      createdAt: "2026-01-05T00:00:00.000Z",
      updatedAt: "2026-01-05T00:00:00.000Z",
      passwordHash: "PatientPass@2026",
    };
    this.users.set(demoPatient.id, demoPatient);

    const demoDonor: UserRecord = {
      id: "usr-donor-01",
      email: "donor@medshare.org",
      fullName: "Pooja Sharma",
      phoneNumber: "+91-9876543212",
      role: "donor",
      city: "New Delhi",
      state: "Delhi",
      createdAt: "2026-01-06T00:00:00.000Z",
      updatedAt: "2026-01-06T00:00:00.000Z",
      passwordHash: "DonorPass@2026",
    };
    this.users.set(demoDonor.id, demoDonor);

    const demoProvider: UserRecord = {
      id: "usr-provider-01",
      email: "provider@medshare.org",
      fullName: "Dr. Rajesh Kulkarni",
      phoneNumber: "+91-9876543213",
      role: "provider",
      city: "Mumbai",
      state: "Maharashtra",
      createdAt: "2026-01-07T00:00:00.000Z",
      updatedAt: "2026-01-07T00:00:00.000Z",
      passwordHash: "ProviderPass@2026",
    };
    this.users.set(demoProvider.id, demoProvider);

    // Seed Donor Profile for demo donor
    const donorProf: DonorProfile = {
      id: "dnr-001",
      userId: demoDonor.id,
      bloodGroup: "O+",
      city: "New Delhi",
      state: "Delhi",
      locality: "Hauz Khas",
      availabilityStatus: "available",
      preferredContactMethod: "in_app",
      consentToContact: true,
      lastDonationDate: "2026-07-15",
      notes: "Regular voluntary donor, comfortable reaching South Delhi hospitals within 45 minutes.",
      createdAt: "2026-01-06T00:00:00.000Z",
      updatedAt: "2026-01-06T00:00:00.000Z",
      donorName: demoDonor.fullName,
    };
    this.donorProfiles.set(donorProf.id, donorProf);

    // Additional sample donor for matching demonstration
    const donorProf2: DonorProfile = {
      id: "dnr-002",
      userId: "usr-donor-02",
      bloodGroup: "A+",
      city: "Mumbai",
      state: "Maharashtra",
      locality: "Andheri West",
      availabilityStatus: "available",
      preferredContactMethod: "in_app",
      consentToContact: true,
      lastDonationDate: "2026-06-10",
      notes: "Voluntary donor registered for emergency calls in Western suburbs.",
      createdAt: "2026-01-08T00:00:00.000Z",
      updatedAt: "2026-01-08T00:00:00.000Z",
      donorName: "Rohan Desai",
    };
    this.donorProfiles.set(donorProf2.id, donorProf2);

    // Seed Sample Blood Assistance Request
    const req1: AssistanceRequest = {
      id: "req-b-001",
      userId: demoPatient.id,
      category: "blood",
      title: "Urgent O+ Platelets Required for Dengue Treatment",
      description: "Patient admitted in ICU at AIIMS New Delhi requiring 2 units of single-donor platelets urgently.",
      city: "New Delhi",
      state: "Delhi",
      locality: "Ansari Nagar",
      priority: "critical",
      status: "submitted",
      preferredContactMethod: "in_app",
      consentGiven: true,
      createdAt: "2026-10-15T08:30:00.000Z",
      updatedAt: "2026-10-15T08:30:00.000Z",
      userName: demoPatient.fullName,
      userEmail: demoPatient.email,
    };
    this.assistanceRequests.set(req1.id, req1);

    const bloodDetail1: BloodRequestDetail = {
      id: "bld-001",
      requestId: req1.id,
      patientName: "Smt. Sunita Verma",
      hospitalName: "AIIMS New Delhi",
      hospitalAddress: "Sri Aurobindo Marg, Ansari Nagar",
      bloodGroup: "O+",
      bloodComponent: "platelets",
      unitsNeeded: 2,
      requiredDate: "2026-10-18",
      urgencyLevel: "critical",
      medicalNotes: "IPD Reg No: 2026/8941. Requisition verified by Attending Hematologist.",
      createdAt: "2026-10-15T08:30:00.000Z",
    };
    this.bloodDetails.set(bloodDetail1.id, bloodDetail1);
    req1.bloodDetails = bloodDetail1;

    // Seed Sample Medicine Assistance Request
    const req2: AssistanceRequest = {
      id: "req-m-001",
      userId: demoPatient.id,
      category: "medicine",
      title: "Assistance Locating Subsidized Oncology Medication",
      description: "Seeking authorized pharmacy referral for generic Imatinib 400mg prescribed by Tata Memorial Hospital.",
      city: "Mumbai",
      state: "Maharashtra",
      locality: "Parel",
      priority: "standard",
      status: "under_review",
      preferredContactMethod: "in_app",
      consentGiven: true,
      createdAt: "2026-10-14T11:00:00.000Z",
      updatedAt: "2026-10-14T11:00:00.000Z",
      userName: demoPatient.fullName,
      userEmail: demoPatient.email,
    };
    this.assistanceRequests.set(req2.id, req2);

    // Seed Sample Equipment Assistance Request
    const req3: AssistanceRequest = {
      id: "req-e-001",
      userId: demoPatient.id,
      category: "equipment",
      title: "Request for Wheelchair Support for Elderly Patient",
      description: "Looking for charitable lending or equipment assistance for a foldable manual wheelchair following hip replacement recovery.",
      city: "Bengaluru",
      state: "Karnataka",
      locality: "Jayanagar",
      priority: "standard",
      status: "matched",
      preferredContactMethod: "in_app",
      consentGiven: true,
      createdAt: "2026-10-12T14:20:00.000Z",
      updatedAt: "2026-10-13T10:00:00.000Z",
      userName: demoPatient.fullName,
      userEmail: demoPatient.email,
    };
    this.assistanceRequests.set(req3.id, req3);

    // Seed Provider Profile & Pending Verification
    const provProf: ProviderProfile = {
      id: "prv-001",
      userId: demoProvider.id,
      organizationName: "Kulkarni Community Healthcare Trust",
      organizationType: "clinic",
      licenseNumber: "MH-MC-2019-8921",
      city: "Mumbai",
      state: "Maharashtra",
      address: "42, SV Road, Bandra West",
      contactPhone: "+91-22-26401122",
      contactEmail: "admin@kulkarnihealth.org",
      websiteUrl: "https://kulkarnihealth.org",
      verificationStatus: "pending",
      createdAt: "2026-01-07T00:00:00.000Z",
      updatedAt: "2026-01-07T00:00:00.000Z",
    };
    this.providerProfiles.set(provProf.id, provProf);

    const sub1: ProviderVerificationSubmission = {
      id: "sub-001",
      providerId: provProf.id,
      organizationName: provProf.organizationName,
      documentName: "Maharashtra State Clinical Establishment Act Registration",
      documentType: "State Regulatory License",
      documentUrl: "https://documents.medshare.org/licenses/mh-mc-2019-8921.pdf",
      notes: "Annual renewal certificate attached along with medical superintendent credentials.",
      status: "pending",
      createdAt: "2026-10-14T09:00:00.000Z",
    };
    this.verificationSubmissions.set(sub1.id, sub1);

    // Seed In-App Notifications
    const notif1: InAppNotification = {
      id: "notif-001",
      userId: demoPatient.id,
      title: "Blood Request Submitted",
      message: "Your request for 2 units of O+ Platelets at AIIMS New Delhi has been published to voluntary donors.",
      link: `/blood/requests/${req1.id}`,
      type: "request_status",
      isRead: false,
      createdAt: "2026-10-15T08:31:00.000Z",
    };
    this.notifications.set(notif1.id, notif1);

    const notif2: InAppNotification = {
      id: "notif-002",
      userId: demoDonor.id,
      title: "Matching Blood Request Nearby",
      message: "A patient at AIIMS New Delhi is in urgent need of O+ platelets. Click to review request details.",
      link: `/blood/requests/${req1.id}`,
      type: "match_found",
      isRead: false,
      createdAt: "2026-10-15T08:35:00.000Z",
    };
    this.notifications.set(notif2.id, notif2);

    // Seed Initial Verified Surplus Medicines (50% Off / Resale / Donation with Sealed Packaging)
    const surplus1: SurplusMedicineListing = {
      id: "med-001",
      userId: demoPatient.id,
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
      userId: demoDonor.id,
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

    // Seed Audit Log
    this.auditLogs.push({
      id: "aud-001",
      userId: demoAdmin.id,
      userEmail: demoAdmin.email,
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

    const claim: MedicineClaimRequest = {
      ...data,
      id,
      status: "pending_verification",
      createdAt: now,
    };

    this.medicineClaims.set(id, claim);

    // Notify seller
    const listing = this.surplusMedicines.get(data.listingId);
    if (listing) {
      this.createNotification({
        userId: listing.userId,
        title: `Prescription Claim for ${listing.medicineName}`,
        message: `${data.requesterName} uploaded a prescription requesting "${listing.medicineName}". Please review the prescription to coordinate transfer.`,
        link: `/dashboard/requests`,
        type: "request_status",
      });
    }

    this.createAuditLog({
      userId: data.requesterId,
      action: "SUBMIT_MEDICINE_PRESCRIPTION_CLAIM",
      entityType: "medicine_claim",
      entityId: id,
      details: {
        listingId: data.listingId,
        patientName: data.patientName,
        doctorName: data.doctorName,
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
    reviewedBy?: string
  ): Promise<MedicineClaimRequest | null> {
    const claim = this.medicineClaims.get(claimId);
    if (!claim) return null;
    claim.status = status;
    claim.reviewedBy = reviewedBy;
    claim.reviewedAt = new Date().toISOString();
    this.medicineClaims.set(claimId, claim);

    if (status === "approved") {
      const listing = this.surplusMedicines.get(claim.listingId);
      if (listing) {
        listing.status = "reserved";
        this.surplusMedicines.set(listing.id, listing);
      }
    }

    return claim;
  }
}

// Global Singleton to ensure memory persistence across hot reloads in Next.js
const globalForData = global as unknown as { medShareStore?: MedShareDataStore };
export const dataStore = globalForData.medShareStore || new MedShareDataStore();
if (process.env.NODE_ENV !== "production") {
  globalForData.medShareStore = dataStore;
}
