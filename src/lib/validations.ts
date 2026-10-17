import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phoneNumber: z.string().optional(),
  role: z.enum(["patient", "donor", "volunteer", "provider"], {
    errorMap: () => ({ message: "Please select a valid role." }),
  }),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  termsConsent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms of Service and Privacy Policy." }),
  }),
});

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const bloodComponents = [
  "whole_blood",
  "packed_red_cells",
  "platelets",
  "fresh_frozen_plasma",
  "cryoprecipitate",
] as const;

export const bloodRequestSchema = z.object({
  patientName: z.string().min(2, "Patient name is required."),
  hospitalName: z.string().min(3, "Hospital name is required."),
  hospitalAddress: z.string().optional(),
  bloodGroup: z.enum(bloodGroups, {
    errorMap: () => ({ message: "Please select a valid blood group." }),
  }),
  bloodComponent: z.enum(bloodComponents, {
    errorMap: () => ({ message: "Please select a blood component." }),
  }),
  unitsNeeded: z.coerce
    .number()
    .min(1, "Minimum 1 unit required.")
    .max(10, "For safety reasons, requests exceeding 10 units must be coordinated directly with blood banks."),
  requiredDate: z.string().min(1, "Required date is mandatory."),
  urgencyLevel: z.enum(["standard", "urgent", "critical"]),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  locality: z.string().optional(),
  contactName: z.string().min(2, "Contact person name is required."),
  contactPhone: z.string().min(10, "Valid 10-digit phone number is required."),
  medicalNotes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to publish this blood assistance request." }),
  }),
});

export const donorRegistrationSchema = z.object({
  fullName: z.string().min(2, "Name is required."),
  bloodGroup: z.enum(bloodGroups, {
    errorMap: () => ({ message: "Please select your blood group." }),
  }),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  locality: z.string().optional(),
  availabilityStatus: z.enum(["available", "busy", "temporarily_unavailable"]),
  preferredContactMethod: z.enum(["in_app", "email", "phone"]),
  lastDonationDate: z.string().optional(),
  eligibilityAcknowledged: z.literal(true, {
    errorMap: () => ({
      message: "You must acknowledge that medical eligibility is determined by blood bank personnel at donation time.",
    }),
  }),
  consentToContact: z.literal(true, {
    errorMap: () => ({ message: "Consent to receive voluntary blood request notifications is required." }),
  }),
  notes: z.string().max(300).optional(),
});

export const medicineAssistanceSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  medicineName: z.string().min(2, "Medicine or formulation name is required."),
  dosageOrStrength: z.string().min(1, "Strength or dosage form is required (e.g. 500mg tablets)."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  locality: z.string().optional(),
  urgency: z.enum(["standard", "urgent"]),
  description: z.string().min(20, "Please describe the assistance needed in detail."),
  hasValidPrescription: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm that a registered doctor has prescribed this medication. We do not distribute medicines directly.",
    }),
  }),
  antiRedistributionConsent: z.literal(true, {
    errorMap: () => ({
      message: "You must agree to lawful assistance navigation only. Peer-to-peer medicine sales or redistribution are prohibited.",
    }),
  }),
});

export const medicalAssistanceSchema = z.object({
  category: z.enum(["financial", "equipment", "general"]),
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(25, "Please provide sufficient details regarding the required assistance."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  locality: z.string().optional(),
  priority: z.enum(["standard", "urgent", "critical"]),
  preferredContactMethod: z.enum(["in_app", "email", "phone"]),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to submit this request." }),
  }),
});

export const organPledgeSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Valid email required."),
  phone: z.string().min(10, "Valid 10-digit phone number required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  pledgedOrgans: z.array(z.string()).min(1, "Please select at least one organ/tissue."),
  statutoryDeclaration: z.literal(true, {
    errorMap: () => ({
      message: "You must acknowledge that this is an awareness pledge and NOT an organ trading arrangement or official legal registry.",
    }),
  }),
});

export const providerVerificationSchema = z.object({
  organizationName: z.string().min(3, "Organization name is required."),
  organizationType: z.enum(["hospital", "blood_bank", "clinic", "charity_pharmacy", "diagnostic_center"]),
  licenseNumber: z.string().min(3, "Official registration/license number is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  address: z.string().min(5, "Full registered address is required."),
  contactPhone: z.string().min(8, "Official contact phone is required."),
  contactEmail: z.string().email("Official contact email is required."),
  websiteUrl: z.string().url("Must be a valid URL (https://...)").optional().or(z.literal("")),
  documentName: z.string().min(2, "Document title is required."),
  documentType: z.string().min(2, "Document type is required (e.g. Clinical Establishment Act License)."),
  documentUrl: z.string().min(5, "Document verification URL or reference ID is required."),
  notes: z.string().optional(),
});
