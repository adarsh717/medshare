// ====================================================================
// MedShare TypeScript Domain Definitions & Types
// ====================================================================

export type UserRole = "patient" | "donor" | "volunteer" | "provider" | "admin";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type BloodComponent =
  | "whole_blood"
  | "packed_red_cells"
  | "platelets"
  | "fresh_frozen_plasma"
  | "cryoprecipitate";

export type RequestCategory =
  | "blood"
  | "medicine"
  | "financial"
  | "equipment"
  | "general";

export type RequestPriority = "standard" | "urgent" | "critical";

export type RequestStatus =
  | "submitted"
  | "under_review"
  | "additional_info_required"
  | "matched"
  | "resolved"
  | "closed";

export type ProviderVerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "suspended";

export type ResourceCategory =
  | "hospital"
  | "blood_bank"
  | "authorized_pharmacy"
  | "community_clinic"
  | "transplant_center";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonorProfile {
  id: string;
  userId: string;
  bloodGroup: BloodGroup;
  city: string;
  state: string;
  locality?: string;
  availabilityStatus: "available" | "busy" | "temporarily_unavailable";
  preferredContactMethod: "in_app" | "email" | "phone";
  consentToContact: boolean;
  lastDonationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Anonymized display fields when browsing:
  donorName?: string;
}

export interface BloodRequestDetail {
  id: string;
  requestId: string;
  patientName: string;
  hospitalName: string;
  hospitalAddress?: string;
  bloodGroup: BloodGroup;
  bloodComponent: BloodComponent;
  unitsNeeded: number;
  requiredDate: string;
  urgencyLevel: RequestPriority;
  medicalNotes?: string;
  createdAt: string;
}

export interface AssistanceRequest {
  id: string;
  userId: string;
  category: RequestCategory;
  title: string;
  description: string;
  city: string;
  state: string;
  locality?: string;
  priority: RequestPriority;
  status: RequestStatus;
  preferredContactMethod: string;
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
  // Associated detail objects when joined
  bloodDetails?: BloodRequestDetail;
  userEmail?: string;
  userName?: string;
  responseCount?: number;
}

export interface HealthcareResource {
  id: string;
  name: string;
  category: ResourceCategory;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  phone: string;
  email?: string;
  websiteUrl?: string;
  operationalHours: string;
  servicesOffered: string[];
  verified: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  organizationName: string;
  organizationType: "hospital" | "blood_bank" | "clinic" | "charity_pharmacy" | "diagnostic_center";
  licenseNumber: string;
  city: string;
  state: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  websiteUrl?: string;
  verificationStatus: ProviderVerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderVerificationSubmission {
  id: string;
  providerId: string;
  organizationName: string;
  documentName: string;
  documentType: string;
  documentUrl: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface RequestResponse {
  id: string;
  requestId: string;
  responderId: string;
  responderName: string;
  responderType: "volunteer" | "provider" | "donor";
  message: string;
  status: "offered" | "accepted" | "declined" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string;
  type: "request_status" | "match_found" | "verification_update" | "system";
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface OrganDonationPledge {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pledgedOrgans: string[];
  declarationAcknowledged: boolean;
  createdAt: string;
}
