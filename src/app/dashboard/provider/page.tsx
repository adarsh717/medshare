"use client";

import * as React from "react";
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Upload,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { ProviderProfile } from "@/types";

export default function ProviderDashboardPage() {
  const { toast } = useToast();
  const [profile, setProfile] = React.useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmittingDoc, setIsSubmittingDoc] = React.useState(false);

  // Verification submission state
  const [docName, setDocName] = React.useState("");
  const [docType, setDocType] = React.useState("State Clinical Establishment Registration");
  const [docUrl, setDocUrl] = React.useState("");
  const [docNotes, setDocNotes] = React.useState("");

  const fetchProviderData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Use demo profile or fallback
      const demoProvider: ProviderProfile = {
        id: "prv-001",
        userId: "usr-provider-01",
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
      setProfile(demoProvider);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProviderData();
  }, [fetchProviderData]);

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docUrl) return;

    setIsSubmittingDoc(true);
    setTimeout(() => {
      setIsSubmittingDoc(false);
      toast({
        type: "success",
        title: "Verification Submission Received",
        description: "Your documentation has been queued for administrator review.",
      });
      setDocName("");
      setDocUrl("");
      setDocNotes("");
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Healthcare Provider Management"
        description="Manage your authorized healthcare facility profile, regulatory verification submissions, and assigned requests."
        badge={
          <StatusBadge
            status={profile?.verificationStatus || "pending"}
            variant="verification"
          />
        }
      />

      {/* Verification Status Warning (If Pending) */}
      {profile?.verificationStatus === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Verification Status: Pending Administrator Review</span>
          </div>
          <p className="leading-relaxed">
            Privileged provider features (such as official blood inventory broadcasts or clinical referral management) remain restricted until your establishment license is verified against official state registers.
          </p>
        </div>
      )}

      {/* Provider Details Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-teal-700" />
          <span>Registered Healthcare Organization</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Organization Name</span>
            <strong className="text-slate-900 font-semibold block mt-0.5">
              {profile?.organizationName}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 block">Facility Type</span>
            <strong className="text-slate-900 font-semibold block mt-0.5 capitalize">
              {profile?.organizationType.replace(/_/g, " ")}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 block">License / Registration No.</span>
            <strong className="text-slate-900 font-semibold block mt-0.5">
              {profile?.licenseNumber}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 block">Registered Address</span>
            <span className="text-slate-700 block mt-0.5">
              {profile?.address}, {profile?.city}, {profile?.state}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Official Contact</span>
            <span className="text-slate-700 block mt-0.5">
              {profile?.contactPhone} &bull; {profile?.contactEmail}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Website</span>
            <a
              href={profile?.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 hover:underline block mt-0.5"
            >
              {profile?.websiteUrl}
            </a>
          </div>
        </div>
      </div>

      {/* Document Submission Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">
            Submit Regulatory Documents for Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit your Clinical Establishment Act certificate, Drug Control Department license, or Blood Bank operating approval.
          </p>
        </div>

        <form onSubmit={handleDocumentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Document Title" required>
              <Input
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. State Clinical Establishment Renewal Certificate"
                required
              />
            </FormField>

            <FormField label="Document Type" required>
              <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="State Clinical Establishment Registration">State Clinical Establishment Registration</option>
                <option value="Blood Bank License Form 28C">Blood Bank License (Form 28C / NBTC)</option>
                <option value="Pharmacy License Form 20B/21B">Pharmacy License (Form 20B / 21B)</option>
                <option value="Transplant Center Registration">Transplant Center Registration (Form 16 / THOA)</option>
              </Select>
            </FormField>
          </div>

          <FormField
            label="Document URL or Public Verification Reference ID"
            hint="Secure HTTPS document link or state government portal verification reference"
            required
          >
            <Input
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              placeholder="https://statehealth.gov.in/verify/MH-MC-2019-8921"
              required
            />
          </FormField>

          <FormField label="Additional Notes for Administrator Review">
            <Textarea
              value={docNotes}
              onChange={(e) => setDocNotes(e.target.value)}
              rows={2}
              placeholder="Include medical superintendent details or accreditation references..."
            />
          </FormField>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingDoc}
              disabled={!docName || !docUrl}
            >
              Submit for Admin Verification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
