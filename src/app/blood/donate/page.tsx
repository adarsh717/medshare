"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, UserCheck, ShieldAlert, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { donorRegistrationSchema, bloodGroups } from "@/lib/validations";

type DonorFormData = z.infer<typeof donorRegistrationSchema>;

export default function RegisterDonorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorFormData>({
    resolver: zodResolver(donorRegistrationSchema),
    defaultValues: {
      bloodGroup: "O+",
      availabilityStatus: "available",
      preferredContactMethod: "in_app",
      city: "New Delhi",
      state: "Delhi",
    },
  });

  const onSubmit = async (data: DonorFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/blood/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast({
            type: "error",
            title: "Sign In Required",
            description: "Please sign in or create an account to register as a voluntary donor.",
          });
          router.push("/auth/login?redirect=/blood/donate");
          return;
        }
        throw new Error(json.error || "Failed to register donor profile.");
      }

      toast({
        type: "success",
        title: "Voluntary Donor Registered",
        description: "Thank you for registering. You will receive notifications when patients nearby require your blood type.",
      });

      router.push("/dashboard/donor");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setServerError(msg);
      toast({
        type: "error",
        title: "Registration Failed",
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/blood" className="hover:text-slate-900 inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Back to Blood Portal
        </Link>
      </div>

      <PageHeader
        title="Register as a Voluntary Blood Donor"
        description="Help save lives during medical emergencies. Your contact details remain private until you choose to respond."
        badge={
          <span className="bg-red-50 text-red-800 text-xs px-2.5 py-0.5 rounded border border-red-200 font-semibold inline-flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            Voluntary Service
          </span>
        }
      />

      {serverError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Medical Eligibility Advisory */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 text-xs text-slate-700 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span>Medical Eligibility Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          MedShare does not medically certify donors. Under National Blood Transfusion Council regulations, formal eligibility (hemoglobin &ge; 12.5 g/dl, weight &ge; 45 kg, age 18-65, medical history review) is assessed exclusively by licensed medical doctors at the time of donation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <FormField label="Full Name or Display Name" required error={errors.fullName?.message}>
          <Input {...register("fullName")} placeholder="e.g. Arun Sharma" error={!!errors.fullName} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Blood Group" required error={errors.bloodGroup?.message}>
            <Select {...register("bloodGroup")} error={!!errors.bloodGroup}>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  Blood Group {bg}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Current Availability" required error={errors.availabilityStatus?.message}>
            <Select {...register("availabilityStatus")} error={!!errors.availabilityStatus}>
              <option value="available">Available to Donate</option>
              <option value="busy">Temporarily Busy</option>
              <option value="temporarily_unavailable">Temporarily Unavailable</option>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="City" required error={errors.city?.message}>
            <Input {...register("city")} placeholder="e.g. New Delhi" error={!!errors.city} />
          </FormField>

          <FormField label="State" required error={errors.state?.message}>
            <Input {...register("state")} placeholder="e.g. Delhi" error={!!errors.state} />
          </FormField>

          <FormField label="Locality / Sector" error={errors.locality?.message}>
            <Input {...register("locality")} placeholder="e.g. South Extension" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Preferred Contact Method" required error={errors.preferredContactMethod?.message}>
            <Select {...register("preferredContactMethod")} error={!!errors.preferredContactMethod}>
              <option value="in_app">In-App Notification (Recommended)</option>
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
            </Select>
          </FormField>

          <FormField
            label="Last Blood Donation Date"
            hint="At least 90 days required between whole blood donations"
            error={errors.lastDonationDate?.message}
          >
            <Input type="date" {...register("lastDonationDate")} />
          </FormField>
        </div>

        <FormField
          label="Voluntary Availability Notes"
          hint="Specify preferred travel distance or hospital zones (e.g. 'Can visit AIIMS or Safdarjung within 1 hour')"
          error={errors.notes?.message}
        >
          <Textarea
            {...register("notes")}
            rows={2}
            placeholder="Available for emergency calls in South Delhi..."
          />
        </FormField>

        {/* Mandatory Declarations */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <Checkbox
            id="eligibilityAcknowledged"
            {...register("eligibilityAcknowledged")}
            error={errors.eligibilityAcknowledged?.message}
            label={
              <span>
                I understand that registering on MedShare does not certify my medical fitness to donate blood, and that blood bank medical officers will conduct mandatory screening before donation.
              </span>
            }
          />

          <Checkbox
            id="consentToContact"
            {...register("consentToContact")}
            error={errors.consentToContact?.message}
            label={
              <span>
                I give consent to be matched with verified blood assistance requests in my city, and confirm that my participation is completely voluntary and non-remunerated.
              </span>
            }
          />
        </div>

        {/* Submit Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link href="/blood">
            <Button variant="outline" size="sm" type="button" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
            Complete Donor Registration
          </Button>
        </div>
      </form>
    </div>
  );
}
