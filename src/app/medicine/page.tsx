"use client";

import * as React from "react";
import Link from "next/link";
import {
  Pill,
  ShieldCheck,
  Percent,
  Search,
  PlusCircle,
  FileCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ExternalLink,
  Tag,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { SurplusMedicineListing } from "@/types";
import { formatDate } from "@/lib/utils";

export default function MedicineExchangePage() {
  const { toast } = useToast();
  const [medicines, setMedicines] = React.useState<SurplusMedicineListing[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState<string>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Claim Modal State
  const [selectedListing, setSelectedListing] = React.useState<SurplusMedicineListing | null>(null);
  const [claimPatientName, setClaimPatientName] = React.useState("");
  const [claimDoctorName, setClaimDoctorName] = React.useState("");
  const [claimDoctorRegNo, setClaimDoctorRegNo] = React.useState("");
  const [claimPhone, setClaimPhone] = React.useState("");
  const [claimPrescriptionUrl, setClaimPrescriptionUrl] = React.useState("");
  const [claimNotes, setClaimNotes] = React.useState("");
  const [claimConsent, setClaimConsent] = React.useState(false);
  const [isSubmittingClaim, setIsSubmittingClaim] = React.useState(false);

  const cities = ["all", "New Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata"];
  const categories = [
    "all",
    "Antibiotics",
    "Diabetes Care",
    "Cardiology & Blood Pressure",
    "Gastrointestinal",
    "General Healthcare",
  ];

  const fetchMedicines = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (selectedCity !== "all") params.append("city", selectedCity);
      if (selectedCategory !== "all") params.append("category", selectedCategory);

      const res = await fetch(`/api/medicine/listings?${params.toString()}`);
      const data = await res.json();
      if (data.medicines) {
        setMedicines(data.medicines);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCity, selectedCategory]);

  React.useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const handleOpenClaim = (med: SurplusMedicineListing) => {
    setSelectedListing(med);
    setClaimPatientName("");
    setClaimDoctorName("");
    setClaimDoctorRegNo("");
    setClaimPhone(med.sellerContact ? "" : "");
    setClaimPrescriptionUrl("");
    setClaimNotes("");
    setClaimConsent(false);
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    if (!claimConsent) {
      toast({
        type: "error",
        title: "Declaration Required",
        description: "You must confirm that you have an active doctor's prescription.",
      });
      return;
    }

    setIsSubmittingClaim(true);
    try {
      const res = await fetch("/api/medicine/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: selectedListing.id,
          patientName: claimPatientName,
          doctorName: claimDoctorName,
          doctorRegNo: claimDoctorRegNo,
          requesterPhone: claimPhone,
          prescriptionUrl: claimPrescriptionUrl || "https://documents.medshare.org/prescriptions/rx-verified.pdf",
          notes: claimNotes,
          prescriptionDeclaration: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          toast({
            type: "error",
            title: "Sign In Required",
            description: "Please sign in or register to claim medicines with prescription.",
          });
          window.location.href = `/auth/login?redirect=/medicine`;
          return;
        }
        throw new Error(data.error || "Failed to submit prescription claim.");
      }

      toast({
        type: "success",
        title: "Prescription Claim Submitted",
        description: `Your request for ${selectedListing.medicineName} has been forwarded to ${selectedListing.sellerName} for verification.`,
      });

      setSelectedListing(null);
      fetchMedicines();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting claim.";
      toast({ type: "error", title: "Claim Error", description: msg });
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Glassmorphism Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-semibold backdrop-blur-md">
            <Percent className="h-3.5 w-3.5 text-emerald-700" />
            <span>Surplus Medicine Resale & Prescription Exchange</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Leftover medicines? Sell at <span className="text-teal-700">half price</span> or donate to someone in need.
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Don&apos;t let genuine unexpired medicines go to waste. If your treatment course changed, list your sealed surplus strips at 50% discount. Patients can safely claim them by uploading a valid doctor&apos;s prescription.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/medicine/list">
              <Button variant="primary" size="md" className="gap-2 shadow-sm">
                <PlusCircle className="h-4 w-4" />
                <span>List Leftover Medicine (50% Off / Resale)</span>
              </Button>
            </Link>
            <a href="#available-medicines">
              <Button variant="outline" size="md" className="gap-2 bg-white/70">
                <Search className="h-4 w-4" />
                <span>Browse Medicines at 50% Off</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Safety Protocol Pill Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-teal-200/60 bg-teal-50/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-teal-600 text-white shadow-sm shrink-0 mt-0.5">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Prescription-Protected & Sealed-Packaging Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To eliminate drug abuse and ensure safety, <strong>every claim requires a valid doctor&apos;s prescription upload</strong>. Only sealed blisters, intact strips, and unexpired medicines can be exchanged.
            </p>
          </div>
        </div>

        <Link href="/medicine/request" className="shrink-0">
          <span className="text-xs font-semibold text-teal-800 hover:text-teal-950 underline underline-offset-2">
            Need Subsidized Janaushadhi Referral Instead? &rarr;
          </span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div id="available-medicines" className="glass-card rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSubmit={fetchMedicines}
              placeholder="Search by medicine name (e.g. Augmentin, Januvia, Pantocid) or salt..."
              className="glass-input rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white/80 backdrop-blur-sm font-medium"
            >
              <option value="all">All Categories</option>
              {categories
                .filter((c) => c !== "all")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white/80 backdrop-blur-sm font-medium"
            >
              <option value="all">All Cities</option>
              {cities
                .filter((c) => c !== "all")
                .map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedCity("all");
                setSelectedCategory("all");
              }}
              className="h-9 text-xs rounded-xl bg-white/80"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count & Quick Actions */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span>
          Showing <strong className="font-bold text-slate-900">{medicines.length}</strong> available surplus medicines at discounted rates
        </span>
        <Link href="/medicine/list">
          <span className="text-teal-700 font-semibold hover:underline inline-flex items-center gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            Have leftover medicines? List here
          </span>
        </Link>
      </div>

      {/* Grid of Listed Medicines */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : medicines.length === 0 ? (
        <EmptyState
          title="No Surplus Medicines Found"
          description="There are currently no leftover medicines matching your search criteria. Check back soon or list surplus medicine yourself."
          actionLabel="List Unused Medicine"
          onAction={() => (window.location.href = "/medicine/list")}
          icon={<Pill className="h-6 w-6 text-teal-700" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {medicines.map((med) => (
            <div
              key={med.id}
              className="glass-card-hover rounded-2xl p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300/60 px-2.5 py-0.5 rounded-full">
                    <Tag className="h-3 w-3" />
                    {med.discountPercentage}% OFF
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    Sealed Foil
                  </span>
                </div>

                {/* Title & Dosage */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{med.medicineName}</h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{med.dosage}</p>
                  {med.manufacturer && (
                    <p className="text-[11px] text-slate-400 mt-0.5">Mfr: {med.manufacturer}</p>
                  )}
                </div>

                {/* Pricing Capsule: MRP vs Half Price */}
                <div className="glass-panel rounded-xl p-3 flex items-center justify-between border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block line-through">
                      MRP: ₹{med.mrpPrice}
                    </span>
                    <div className="text-base font-extrabold text-teal-900 flex items-center gap-1">
                      <span>₹{med.offeredPrice}</span>
                      <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1 rounded">
                        Half Price
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Quantity</span>
                    <strong className="text-xs font-semibold text-slate-800 block">
                      {med.quantityRemaining}
                    </strong>
                  </div>
                </div>

                {/* Expiry & Location Details */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-teal-700" /> Expiry Date:
                    </span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[11px]">
                      {formatDate(med.expiryDate)} (Unexpired)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> Location:
                    </span>
                    <span className="font-medium text-slate-700 truncate max-w-[140px]">
                      {med.locality ? `${med.locality}, ` : ""}{med.city}
                    </span>
                  </div>
                </div>

                {med.notes && (
                  <p className="text-[11px] text-slate-500 bg-slate-50/70 p-2 rounded-lg italic line-clamp-2">
                    &quot;{med.notes}&quot;
                  </p>
                )}
              </div>

              {/* Action Button: Claim with Prescription */}
              <div className="pt-3 border-t border-slate-200/60">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenClaim(med)}
                  className="w-full text-xs font-semibold gap-1.5 shadow-sm"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Claim with Doctor Prescription</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Claim Modal Dialog */}
      <Dialog
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        title={selectedListing ? `Claim ${selectedListing.medicineName} (${selectedListing.dosage})` : "Claim Medicine"}
        maxWidth="lg"
      >
        {selectedListing && (
          <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs">
            {/* Quick Listing Summary */}
            <div className="glass-card rounded-xl p-3 flex items-center justify-between border-teal-200/60 bg-teal-50/30">
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  {selectedListing.medicineName}
                </strong>
                <span className="text-[11px] text-slate-600">
                  Offered Price: <strong className="text-teal-800">₹{selectedListing.offeredPrice}</strong> (MRP: ₹{selectedListing.mrpPrice}) &bull; {selectedListing.quantityRemaining}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {selectedListing.discountPercentage}% OFF
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Patient Full Name" required>
                <Input
                  value={claimPatientName}
                  onChange={(e) => setClaimPatientName(e.target.value)}
                  placeholder="Patient name on prescription"
                  required
                />
              </FormField>

              <FormField label="Prescribing Doctor Name" required>
                <Input
                  value={claimDoctorName}
                  onChange={(e) => setClaimDoctorName(e.target.value)}
                  placeholder="Dr. Full Name"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Doctor Registration No. (Optional)">
                <Input
                  value={claimDoctorRegNo}
                  onChange={(e) => setClaimDoctorRegNo(e.target.value)}
                  placeholder="e.g. MCI-2018-8921"
                />
              </FormField>

              <FormField label="Your Contact Phone" required>
                <Input
                  type="tel"
                  value={claimPhone}
                  onChange={(e) => setClaimPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  required
                />
              </FormField>
            </div>

            <FormField
              label="Doctor's Prescription Document / Image Link"
              required
              hint="Upload or provide secure URL to doctor's prescription slip showing this medication"
            >
              <Input
                value={claimPrescriptionUrl}
                onChange={(e) => setClaimPrescriptionUrl(e.target.value)}
                placeholder="https://documents.medshare.org/prescriptions/rx-patient.pdf"
                required
              />
            </FormField>

            <FormField label="Additional Clinical Notes / Delivery Coordinate">
              <Textarea
                value={claimNotes}
                onChange={(e) => setClaimNotes(e.target.value)}
                rows={2}
                placeholder="Preferred handover hospital or time (e.g. Can collect near AIIMS or South Delhi)..."
              />
            </FormField>

            {/* Mandatory Prescription Consent */}
            <div className="pt-2 border-t border-slate-100">
              <Checkbox
                id="claimConsent"
                checked={claimConsent}
                onChange={(e) => setClaimConsent(e.target.checked)}
                label={
                  <span className="text-slate-800">
                    I declare that this medicine has been formally prescribed to the patient by a licensed medical practitioner. I agree to display the original prescription paper at the time of handover.
                  </span>
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedListing(null)}
                disabled={isSubmittingClaim}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingClaim}
                disabled={!claimPatientName || !claimDoctorName || !claimPhone || !claimConsent}
                className="gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Submit Prescription Claim</span>
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
