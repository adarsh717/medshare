"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, AlertTriangle, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { bloodRequestSchema, bloodGroups, bloodComponents } from "@/lib/validations";

type BloodRequestFormData = z.infer<typeof bloodRequestSchema>;

export default function CreateBloodRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BloodRequestFormData>({
    resolver: zodResolver(bloodRequestSchema),
    defaultValues: {
      bloodGroup: "O+",
      bloodComponent: "whole_blood",
      unitsNeeded: 1,
      urgencyLevel: "standard",
      city: "New Delhi",
      state: "Delhi",
      requiredDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: BloodRequestFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/blood/requests", {
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
            description: "Please sign in or register to submit a blood assistance request.",
          });
          router.push("/auth/login?redirect=/blood/request");
          return;
        }
        throw new Error(json.error || "Failed to submit request.");
      }

      toast({
        type: "success",
        title: "Blood Request Published",
        description: "Your request has been published. Matching voluntary donors have been notified.",
      });

      router.push(`/blood/requests/${json.request.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/blood" className="hover:text-slate-900 inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Back to Blood Portal
        </Link>
      </div>

      <PageHeader
        title="Create Blood Assistance Request"
        description="Submit patient blood requirements to coordinate with voluntary donors and blood bank resources."
        badge={
          <span className="bg-red-50 text-red-800 text-xs px-2.5 py-0.5 rounded border border-red-200 font-semibold">
            Urgent Patient Care
          </span>
        }
      />

      {serverError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Safety Advisory Banner */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 text-xs text-slate-700 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span>Important Safety & Legal Requirement</span>
        </div>
        <p className="leading-relaxed">
          Blood must be drawn, tested, cross-matched, and transfused strictly within a licensed hospital or blood bank. Never offer money or financial compensation to blood donors — doing so violates Indian law (Drugs and Cosmetics Rules).
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        {/* Patient & Hospital Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            1. Patient & Medical Facility Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Patient Full Name" required error={errors.patientName?.message}>
              <Input
                {...register("patientName")}
                placeholder="e.g. Sunita Verma"
                error={!!errors.patientName}
              />
            </FormField>

            <FormField label="Hospital / Facility Name" required error={errors.hospitalName?.message}>
              <Input
                {...register("hospitalName")}
                placeholder="e.g. AIIMS New Delhi"
                error={!!errors.hospitalName}
              />
            </FormField>
          </div>

          <FormField
            label="Hospital Address / Department"
            hint="Include ward, ICU, or IPD bed number if applicable"
            error={errors.hospitalAddress?.message}
          >
            <Input
              {...register("hospitalAddress")}
              placeholder="e.g. Sri Aurobindo Marg, Ward 4B, Bed 12"
            />
          </FormField>
        </div>

        {/* Blood Requirements */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            2. Blood Specification & Urgency
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Required Blood Group" required error={errors.bloodGroup?.message}>
              <Select {...register("bloodGroup")} error={!!errors.bloodGroup}>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    Blood Group {bg}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Blood Component" required error={errors.bloodComponent?.message}>
              <Select {...register("bloodComponent")} error={!!errors.bloodComponent}>
                {bloodComponents.map((bc) => (
                  <option key={bc} value={bc}>
                    {bc.replace(/_/g, " ").toUpperCase()}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Units Needed (1 to 10)"
              required
              error={errors.unitsNeeded?.message}
            >
              <Input
                type="number"
                min={1}
                max={10}
                {...register("unitsNeeded")}
                error={!!errors.unitsNeeded}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Date Required" required error={errors.requiredDate?.message}>
              <Input
                type="date"
                {...register("requiredDate")}
                error={!!errors.requiredDate}
              />
            </FormField>

            <FormField label="Urgency Level" required error={errors.urgencyLevel?.message}>
              <Select {...register("urgencyLevel")} error={!!errors.urgencyLevel}>
                <option value="standard">Standard (Within 48 hours)</option>
                <option value="urgent">Urgent (Within 24 hours)</option>
                <option value="critical">Critical (Immediate / Emergency)</option>
              </Select>
            </FormField>
          </div>
        </div>

        {/* Location & Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            3. Location & Authorized Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="City" required error={errors.city?.message}>
              <Input {...register("city")} placeholder="e.g. New Delhi" error={!!errors.city} />
            </FormField>

            <FormField label="State" required error={errors.state?.message}>
              <Input {...register("state")} placeholder="e.g. Delhi" error={!!errors.state} />
            </FormField>

            <FormField label="Locality / Area" error={errors.locality?.message}>
              <Input {...register("locality")} placeholder="e.g. Ansari Nagar East" />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Contact Person Name" required error={errors.contactName?.message}>
              <Input
                {...register("contactName")}
                placeholder="Caregiver or Attending Relative"
                error={!!errors.contactName}
              />
            </FormField>

            <FormField label="Contact Phone Number" required error={errors.contactPhone?.message}>
              <Input
                type="tel"
                {...register("contactPhone")}
                placeholder="10-digit mobile number"
                error={!!errors.contactPhone}
              />
            </FormField>
          </div>

          <FormField
            label="Additional Clinical Notes"
            hint="Requisition details, donor criteria specified by attending physician"
            error={errors.medicalNotes?.message}
          >
            <Textarea
              {...register("medicalNotes")}
              rows={3}
              placeholder="e.g. Blood requisition form verified by Dr. Sharma. Platelet count below 20,000. Donor requested to report directly to Main Blood Bank counter."
            />
          </FormField>
        </div>

        {/* Consent and Compliance */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <Checkbox
            id="consentGiven"
            {...register("consentGiven")}
            error={errors.consentGiven?.message}
            label={
              <span>
                I confirm that this blood assistance request is genuine, issued by authorized healthcare personnel, and that I consent to sharing the necessary coordination details with voluntary donors.
              </span>
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link href="/blood">
            <Button variant="outline" size="sm" type="button" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
            Publish Blood Request
          </Button>
        </div>
      </form>
    </div>
  );
}
