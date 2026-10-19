"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { medicalAssistanceSchema } from "@/lib/validations";

type AssistanceFormData = z.infer<typeof medicalAssistanceSchema>;

export default function CreateAssistanceRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssistanceFormData>({
    resolver: zodResolver(medicalAssistanceSchema),
    defaultValues: {
      category: "equipment",
      priority: "standard",
      preferredContactMethod: "in_app",
      city: "New Delhi",
      state: "Delhi",
    },
  });

  const onSubmit = async (data: AssistanceFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/requests", {
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
            description: "Please sign in or register to submit a healthcare assistance request.",
          });
          router.push("/auth/login?redirect=/assistance/request");
          return;
        }
        throw new Error(json.error || "Failed to submit request.");
      }

      toast({
        type: "success",
        title: "Assistance Request Approved! 🎉",
        description: "Your request is approved! Dedicated Case Officer Helpline: +91-800-MEDSHARE / +91-9876543210. Logistics are active.",
      });

      router.push("/dashboard/requests");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting request.";
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
        <Link href="/assistance" className="hover:text-slate-900 inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Back to Assistance Directory
        </Link>
      </div>

      <PageHeader
        title="Request Medical or Equipment Assistance"
        description="Submit requirements for wheelchair loans, mobility devices, or guidance accessing hospital welfare funds."
        badge={
          <span className="bg-sky-50 text-sky-800 text-xs px-2.5 py-0.5 rounded border border-sky-200 font-semibold inline-flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-sky-600" />
            Medical & Mobility Support
          </span>
        }
      />

      {serverError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Assistance Category" required error={errors.category?.message}>
            <Select {...register("category")} error={!!errors.category}>
              <option value="equipment">Mobility & Medical Equipment Lending</option>
              <option value="financial">Medical Expense Guidance / Welfare Fund</option>
              <option value="general">General Healthcare Navigation</option>
            </Select>
          </FormField>

          <FormField label="Priority / Urgency" required error={errors.priority?.message}>
            <Select {...register("priority")} error={!!errors.priority}>
              <option value="standard">Standard Priority</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical Urgency</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Request Title" required error={errors.title?.message}>
          <Input
            {...register("title")}
            placeholder="e.g. Request for Foldable Wheelchair Lending for Post-Operative Recovery"
            error={!!errors.title}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="City" required error={errors.city?.message}>
            <Input {...register("city")} placeholder="e.g. New Delhi" error={!!errors.city} />
          </FormField>

          <FormField label="State" required error={errors.state?.message}>
            <Input {...register("state")} placeholder="e.g. Delhi" error={!!errors.state} />
          </FormField>

          <FormField label="Locality" error={errors.locality?.message}>
            <Input {...register("locality")} placeholder="e.g. Lajpat Nagar" />
          </FormField>
        </div>

        <FormField
          label="Detailed Description"
          hint="Provide clear details of clinical requirement, patient condition, and expected timeline"
          required
          error={errors.description?.message}
        >
          <Textarea
            {...register("description")}
            rows={4}
            placeholder="Patient is recovering from orthopedic surgery at Safdarjung Hospital and requires temporary wheelchair assistance for 6 weeks..."
            error={!!errors.description}
          />
        </FormField>

        <FormField label="Preferred Contact Method" required error={errors.preferredContactMethod?.message}>
          <Select {...register("preferredContactMethod")} error={!!errors.preferredContactMethod}>
            <option value="in_app">In-App Notification (Recommended)</option>
            <option value="email">Email</option>
            <option value="phone">Phone Call</option>
          </Select>
        </FormField>

        {/* Mandatory Consent */}
        <div className="pt-2 border-t border-slate-100">
          <Checkbox
            id="consentGiven"
            {...register("consentGiven")}
            error={errors.consentGiven?.message}
            label={
              <span>
                I confirm that the information provided is accurate and consent to sharing necessary details with verified volunteers and healthcare providers.
              </span>
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link href="/assistance">
            <Button variant="outline" size="sm" type="button" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            type="submit"
            isLoading={isSubmitting}
            className="bg-sky-600 hover:bg-sky-700 text-white border-sky-600 shadow-2xs font-semibold"
          >
            Submit Assistance Request
          </Button>
        </div>
      </form>
    </div>
  );
}
