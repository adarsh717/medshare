"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pill, ShieldCheck, ArrowLeft, Percent, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { surplusMedicineListingSchema } from "@/lib/validations";

type ListingFormData = z.infer<typeof surplusMedicineListingSchema>;

export default function ListSurplusMedicinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(surplusMedicineListingSchema),
    defaultValues: {
      category: "General Healthcare",
      packagingCondition: "sealed_blister",
      city: "New Delhi",
      state: "Delhi",
      mrpPrice: 200,
      offeredPrice: 100, // Default 50% off!
    },
  });

  const mrpVal = watch("mrpPrice");
  const offeredVal = watch("offeredPrice");

  // Calculate discount percentage
  const discountPct =
    mrpVal && offeredVal !== undefined && mrpVal > 0
      ? Math.round(((mrpVal - offeredVal) / mrpVal) * 100)
      : 50;

  const setHalfPrice = () => {
    if (mrpVal && mrpVal > 0) {
      setValue("offeredPrice", Math.round(mrpVal / 2));
    }
  };

  const setFreeDonation = () => {
    setValue("offeredPrice", 0);
  };

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/medicine/listings", {
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
            description: "Please sign in or register to list leftover medicines.",
          });
          router.push("/auth/login?redirect=/medicine/list");
          return;
        }
        throw new Error(json.error || "Failed to list medicine.");
      }

      toast({
        type: "success",
        title: "Medicine Listed Successfully",
        description: `Your listing for ${data.medicineName} is now active at ${discountPct}% discount.`,
      });

      router.push("/medicine");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission error.";
      setServerError(msg);
      toast({
        type: "error",
        title: "Listing Error",
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/medicine" className="hover:text-slate-900 inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Back to Medicine Exchange
        </Link>
      </div>

      <PageHeader
        title="List Leftover / Surplus Medicine"
        description="Help someone afford their prescribed medication. List unexpired leftover medicines at half price (50% off) or offer them as a charitable donation."
        badge={
          <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold inline-flex items-center gap-1">
            <Percent className="h-3.5 w-3.5" />
            50% Affordable Resale
          </span>
        }
      />

      {serverError && (
        <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Safety Rules Banner */}
      <div className="glass-card rounded-xl p-4 text-xs text-slate-700 space-y-1.5 border-emerald-200/80 bg-emerald-50/40">
        <div className="flex items-center gap-2 font-bold text-emerald-950">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          <span>Quality & Safety Standard for Medicine Exchange</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          Only unexpired medicines in <strong>original, sealed blister strips or unopened bottles</strong> can be listed. Recipients are required to submit a matching doctor&apos;s prescription before handoff.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Medicine Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200/60 flex items-center gap-2">
            <Pill className="h-4 w-4 text-teal-700" />
            <span>1. Medicine & Dosage Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Medicine Brand / Name" required error={errors.medicineName?.message}>
              <Input
                {...register("medicineName")}
                placeholder="e.g. Augmentin 625 Duo or Januvia"
                error={!!errors.medicineName}
              />
            </FormField>

            <FormField label="Dosage / Formulation" required error={errors.dosage?.message}>
              <Input
                {...register("dosage")}
                placeholder="e.g. 500mg + 125mg Tablets"
                error={!!errors.dosage}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Manufacturer / Brand" error={errors.manufacturer?.message}>
              <Input
                {...register("manufacturer")}
                placeholder="e.g. GSK, Sun Pharma, Cipla"
              />
            </FormField>

            <FormField label="Medical Category" required error={errors.category?.message}>
              <Select {...register("category")} error={!!errors.category}>
                <option value="Antibiotics">Antibiotics & Infection</option>
                <option value="Diabetes Care">Diabetes Care</option>
                <option value="Cardiology & BP">Cardiology & Blood Pressure</option>
                <option value="Gastrointestinal">Gastrointestinal / Antacids</option>
                <option value="Pain & Orthopedic">Pain Relief & Orthopedic</option>
                <option value="Respiratory & Asthma">Respiratory & Asthma</option>
                <option value="Oncology Supportive">Oncology Supportive Care</option>
                <option value="General Healthcare">General Healthcare</option>
              </Select>
            </FormField>
          </div>
        </div>

        {/* Pricing & 50% Off Calculation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <h3 className="text-sm font-bold text-slate-900">
              2. Affordable Pricing & Quantity
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              {discountPct}% Discount Applied
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Original MRP (₹)" required error={errors.mrpPrice?.message}>
              <Input
                type="number"
                min={1}
                step={1}
                {...register("mrpPrice")}
                error={!!errors.mrpPrice}
              />
            </FormField>

            <FormField
              label="Offered Price (₹)"
              hint="Set 50% off or free"
              required
              error={errors.offeredPrice?.message}
            >
              <Input
                type="number"
                min={0}
                step={1}
                {...register("offeredPrice")}
                error={!!errors.offeredPrice}
              />
            </FormField>

            <FormField label="Quantity Available" required error={errors.quantityRemaining?.message}>
              <Input
                {...register("quantityRemaining")}
                placeholder="e.g. 1 Strip (10 Tabs)"
                error={!!errors.quantityRemaining}
              />
            </FormField>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500">Quick pricing:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={setHalfPrice}
              className="text-xs h-7 bg-white/80"
            >
              Set Exactly 50% Off (Half Price)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={setFreeDonation}
              className="text-xs h-7 text-emerald-800 border-emerald-300 bg-emerald-50/50"
            >
              Offer as Free Donation (₹0)
            </Button>
          </div>
        </div>

        {/* Batch, Expiry & Packaging Condition */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200/60">
            3. Expiry, Batch & Packaging Verification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              label="Expiry Date (Printed on pack)"
              required
              hint="Must be unexpired"
              error={errors.expiryDate?.message}
            >
              <Input
                type="date"
                {...register("expiryDate")}
                error={!!errors.expiryDate}
              />
            </FormField>

            <FormField label="Batch Number" required error={errors.batchNumber?.message}>
              <Input
                {...register("batchNumber")}
                placeholder="e.g. B2026-90"
                error={!!errors.batchNumber}
              />
            </FormField>

            <FormField label="Packaging Condition" required error={errors.packagingCondition?.message}>
              <Select {...register("packagingCondition")} error={!!errors.packagingCondition}>
                <option value="sealed_blister">Sealed Blister Strip (Intact foil)</option>
                <option value="unopened_bottle">Unopened Sealed Bottle</option>
                <option value="intact_box">Intact Outer Box with Hologram</option>
              </Select>
            </FormField>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200/60">
            4. Location & Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="City" required error={errors.city?.message}>
              <Input {...register("city")} placeholder="e.g. New Delhi" error={!!errors.city} />
            </FormField>

            <FormField label="State" required error={errors.state?.message}>
              <Input {...register("state")} placeholder="e.g. Delhi" error={!!errors.state} />
            </FormField>

            <FormField label="Locality / Area" error={errors.locality?.message}>
              <Input {...register("locality")} placeholder="e.g. Hauz Khas" />
            </FormField>
          </div>

          <FormField label="Contact Phone Number" required error={errors.sellerContact?.message}>
            <Input
              type="tel"
              {...register("sellerContact")}
              placeholder="10-digit mobile number"
              error={!!errors.sellerContact}
            />
          </FormField>

          <FormField
            label="Storage & Condition Notes"
            hint="Describe why medicine was leftover (e.g. doctor switched dose, recovery) and how it was stored"
            error={errors.notes?.message}
          >
            <Textarea
              {...register("notes")}
              rows={2}
              placeholder="Doctor changed dosage after 4 days. Completely sealed unopened strip stored in dark cool cabinet..."
            />
          </FormField>
        </div>

        {/* Mandatory Safety Declaration */}
        <div className="pt-2 border-t border-slate-200/60">
          <Checkbox
            id="safetyDeclaration"
            {...register("safetyDeclaration")}
            error={errors.safetyDeclaration?.message}
            label={
              <span className="text-slate-800">
                I declare that this medicine is genuine, <strong>unexpired</strong>, stored at recommended temperature, and in its <strong>original sealed packaging</strong>. I agree that the recipient must present a matching doctor&apos;s prescription.
              </span>
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 flex items-center justify-end gap-3">
          <Link href="/medicine">
            <Button variant="outline" size="sm" type="button" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
            List Medicine at Half Price
          </Button>
        </div>
      </form>
    </div>
  );
}
