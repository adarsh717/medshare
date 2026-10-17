import { describe, it, expect } from "vitest";
import {
  bloodRequestSchema,
  donorRegistrationSchema,
  medicineAssistanceSchema,
  organPledgeSchema,
  registerSchema,
} from "@/lib/validations";

describe("Validation Schemas & Compliance Rules", () => {
  describe("Registration Schema", () => {
    it("should accept valid registration input", () => {
      const valid = {
        fullName: "Dr. Ananya Sen",
        email: "ananya@example.com",
        password: "SecurePassword123",
        role: "volunteer" as const,
        city: "Kolkata",
        state: "West Bengal",
        termsConsent: true as const,
      };
      const res = registerSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("should reject password shorter than 8 characters", () => {
      const invalid = {
        fullName: "User",
        email: "user@example.com",
        password: "short",
        role: "patient" as const,
        city: "Delhi",
        state: "Delhi",
        termsConsent: true as const,
      };
      const res = registerSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("Blood Request Schema", () => {
    it("should accept valid blood request", () => {
      const valid = {
        patientName: "Ramesh Kumar",
        hospitalName: "Safdarjung Hospital",
        bloodGroup: "O+" as const,
        bloodComponent: "whole_blood" as const,
        unitsNeeded: 2,
        requiredDate: "2026-10-25",
        urgencyLevel: "urgent" as const,
        city: "New Delhi",
        state: "Delhi",
        contactName: "Suresh Kumar",
        contactPhone: "9876543210",
        consentGiven: true as const,
      };
      const res = bloodRequestSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("should reject units greater than 10 for safety regulations", () => {
      const invalid = {
        patientName: "Ramesh Kumar",
        hospitalName: "Safdarjung Hospital",
        bloodGroup: "O+" as const,
        bloodComponent: "whole_blood" as const,
        unitsNeeded: 15, // exceeds safe limit
        requiredDate: "2026-10-25",
        urgencyLevel: "urgent" as const,
        city: "New Delhi",
        state: "Delhi",
        contactName: "Suresh Kumar",
        contactPhone: "9876543210",
        consentGiven: true as const,
      };
      const res = bloodRequestSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("should reject request without consent", () => {
      const invalid = {
        patientName: "Ramesh Kumar",
        hospitalName: "Safdarjung Hospital",
        bloodGroup: "A+" as const,
        bloodComponent: "packed_red_cells" as const,
        unitsNeeded: 1,
        requiredDate: "2026-10-25",
        urgencyLevel: "standard" as const,
        city: "New Delhi",
        state: "Delhi",
        contactName: "Suresh Kumar",
        contactPhone: "9876543210",
        consentGiven: false,
      };
      const res = bloodRequestSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("Medicine Assistance Schema (Statutory Compliance)", () => {
    it("should require confirmation of valid doctor prescription", () => {
      const invalid = {
        title: "Need generic Sorafenib",
        medicineName: "Sorafenib",
        dosageOrStrength: "200mg",
        city: "Mumbai",
        state: "Maharashtra",
        urgency: "standard" as const,
        description: "Looking for generic oncology medicine assistance for 3 months.",
        hasValidPrescription: false, // Must be true!
        antiRedistributionConsent: true as const,
      };
      const res = medicineAssistanceSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("should require agreement to anti-redistribution law", () => {
      const invalid = {
        title: "Need generic Sorafenib",
        medicineName: "Sorafenib",
        dosageOrStrength: "200mg",
        city: "Mumbai",
        state: "Maharashtra",
        urgency: "standard" as const,
        description: "Looking for generic oncology medicine assistance for 3 months.",
        hasValidPrescription: true as const,
        antiRedistributionConsent: false, // Must agree!
      };
      const res = medicineAssistanceSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("Organ Awareness Pledge Schema", () => {
    it("should require statutory declaration that pledge is NOT an organ trade or legal procurement", () => {
      const invalid = {
        fullName: "Vikram Rathore",
        email: "vikram@example.com",
        phone: "9876543210",
        city: "Jaipur",
        state: "Rajasthan",
        pledgedOrgans: ["Kidneys"],
        statutoryDeclaration: false, // Must acknowledge!
      };
      const res = organPledgeSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("should accept valid pledge with declaration", () => {
      const valid = {
        fullName: "Vikram Rathore",
        email: "vikram@example.com",
        phone: "9876543210",
        city: "Jaipur",
        state: "Rajasthan",
        pledgedOrgans: ["Corneas (Eyes)", "Kidneys"],
        statutoryDeclaration: true as const,
      };
      const res = organPledgeSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });
  });
});
