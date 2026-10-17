"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pill, ShieldAlert, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { medicineAssistanceSchema } from "@/lib/validations";

type MedicineFormData = z.infer<typeof medicineAssistanceSchema>;

export default function MedicineRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineAssistanceSchema),
    defaultValues: {
      urgency: "standard",
      city: "New Delhi",
      state: "Delhi",
    },
  });

  const onSubmit = async (data: MedicineFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/medicine/inquiry", {
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
            description: "Please sign in or register to submit a medicine assistance inquiry.",
          });
          router.push("/auth/login?redirect=/medicine/request");
          return;
        }
        throw new Error(json.error || "Failed to submit medicine inquiry.");
      }

      toast({
        type: "success",
        title: "Assistance Inquiry Submitted",
        description: "Your inquiry has been registered. You can track progress in your dashboard.",
      });

      router.push("/dashboard/requests");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting inquiry.";
      setServerError(msg);
      toast({
        type: "error",
        title: "Submission Error",
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/medicine" className="hover:text-slate-900 inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Back to Medicine Portal
        </Link>
      </div>

      <PageHeader
        title="Request Medicine Navigation Support"
        description="Submit details to receive assistance finding affordable generic options or hospital subsidy programs."
        badge={
          <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded border border-emerald-200 font-semibold inline-flex items-center gap-1">
            <Pill className="h-3.5 w-3.5" />
            Lawful Guidance
          </span>
        }
      />

      {serverError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Statutory Disclaimer */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 text-xs text-slate-700 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span>Notice on Prescription Drug Safety</span>
        </div>
        <p className="leading-relaxed">
          MedShare is not a pharmacy and does not sell or distribute medicines. We will connect you exclusively with licensed Pradhan Mantri Bhartiya Janaushadhi Kendras, charitable hospital funds, and authorized dispensaries.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <FormField label="Inquiry Title" required error={errors.title?.message}>
          <Input
            {...register("title")}
            placeholder="e.g. Assistance finding generic Imatinib 400mg in Delhi NCR"
            error={!!errors.title}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Medicine / Formulation Name" required error={errors.medicineName?.message}>
            <Input
              {...register("medicineName")}
              placeholder="e.g. Imatinib or Sorafenib"
              error={!!errors.medicineName}
            />
          </FormField>

          <FormField label="Strength / Dosage Form" required error={errors.dosageOrStrength?.message}>
            <Input
              {...register("dosageOrStrength")}
              placeholder="e.g. 400mg Film-Coated Tablets"
              error={!!errors.dosageOrStrength}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="City" required error={errors.city?.message}>
            <Input {...register("city")} placeholder="e.g. New Delhi" error={!!errors.city} />
          </FormField>

          <FormField label="State" required error={errors.state?.message}>
            <Input {...register("state")} placeholder="e.g. Delhi" error={!!errors.state} />
          </FormField>

          <FormField label="Urgency" required error={errors.urgency?.message}>
            <Select {...register("urgency")} error={!!errors.urgency}>
              <option value="standard">Standard Priority</option>
              <option value="urgent">Urgent</option>
            </Select>
          </FormField>
        </div>

        <FormField
          label="Detailed Description of Assistance Needed"
          hint="Mention hospital name, duration of therapy, or current retail quote that is burdensome"
          required
          error={errors.description?.message}
        >
          <Textarea
            {...register("description")}
            rows={4}
            placeholder="Patient is undergoing treatment at AIIMS. Looking for referrals to subsidized oncology generic counters or state patient welfare programs..."
            error={!!errors.description}
          />
        </FormField>

        {/* Mandatory Declarations */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <Checkbox
            id="hasValidPrescription"
            {...register("hasValidPrescription")}
            error={errors.hasValidPrescription?.message}
            label={
              <span>
                I confirm that a registered medical practitioner has prescribed this medication. (A valid doctor’s prescription must be presented at the dispensing pharmacy).
              </span>
            }
          />

          <Checkbox
            id="antiRedistributionConsent"
            {...register("antiRedistributionConsent")}
            error={errors.antiRedistributionConsent?.message}
            label={
              <span>
                I agree to lawful navigation only and acknowledge that peer-to-peer medicine buying, selling, or redistribution is strictly prohibited by law.
              </span>
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link href="/medicine">
            <Button variant="outline" size="sm" type="button" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
            Submit Assistance Inquiry
          </Button>
        </div>
      </form>
    </div>
  );
}
