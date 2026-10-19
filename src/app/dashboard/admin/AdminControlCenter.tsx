"use client";

import * as React from "react";
import {
  ShieldAlert,
  Building2,
  FileCheck,
  CheckCircle,
  XCircle,
  ExternalLink,
  History,
  Activity,
  Heart,
  Users,
  Pill,
  Search,
  Filter,
  FileText,
  Clock,
  MapPin,
  AlertTriangle,
  Phone,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  Droplet,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  ProviderVerificationSubmission,
  AssistanceRequest,
  AuditLog,
  RequestStatus,
  MedicineClaimRequest,
  DonorProfile,
  HealthcareResource,
  OrganDonationPledge,
  BloodGroup,
} from "@/types";
import { formatDateTime, formatDate } from "@/lib/utils";

interface AdminProps {
  stats: {
    totalRequests: number;
    approvedRequests: number;
    pendingRequests: number;
    resolvedRequests: number;
    totalBloodRequests: number;
    totalClaims: number;
    approvedClaims: number;
    pendingClaims: number;
    totalDonors: number;
    totalResources: number;
    totalOrganPledges: number;
    pendingSubmissions: number;
  };
  initialSubmissions: ProviderVerificationSubmission[];
  initialClaims: MedicineClaimRequest[];
  initialRequests: AssistanceRequest[];
  initialDonors: Omit<DonorProfile, "notes">[];
  initialResources: HealthcareResource[];
  initialOrganPledges: OrganDonationPledge[];
  initialLogs: AuditLog[];
}

export function AdminControlCenter({
  stats,
  initialSubmissions,
  initialClaims,
  initialRequests,
  initialDonors,
  initialResources,
  initialOrganPledges,
  initialLogs,
}: AdminProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<
    "claims" | "blood" | "assistance" | "donors" | "resources" | "organ" | "submissions" | "logs"
  >("claims");

  const [submissions, setSubmissions] = React.useState(initialSubmissions);
  const [claims, setClaims] = React.useState(initialClaims);
  const [requests, setRequests] = React.useState(initialRequests);
  const [donors, setDonors] = React.useState(initialDonors);
  const [resources, setResources] = React.useState(initialResources);
  const [organPledges, setOrganPledges] = React.useState(initialOrganPledges);
  const [logs, setLogs] = React.useState(initialLogs);

  // Filters & Search
  const [claimFilter, setClaimFilter] = React.useState<string>("all");
  const [claimSearch, setClaimSearch] = React.useState<string>("");

  const [bloodSearch, setBloodSearch] = React.useState<string>("");
  const [bloodGroupFilter, setBloodGroupFilter] = React.useState<string>("all");

  const [assistanceSearch, setAssistanceSearch] = React.useState<string>("");
  const [assistanceCatFilter, setAssistanceCatFilter] = React.useState<string>("all");

  const [donorSearch, setDonorSearch] = React.useState<string>("");
  const [donorGroupFilter, setDonorGroupFilter] = React.useState<string>("all");

  const [resourceSearch, setResourceSearch] = React.useState<string>("");
  const [resourceCategoryFilter, setResourceCategoryFilter] = React.useState<string>("all");

  const [organSearch, setOrganSearch] = React.useState<string>("");
  const [logSearch, setLogSearch] = React.useState<string>("");
  const [logFilter, setLogFilter] = React.useState<string>("all");

  // Review Dialog State for Provider Submissions
  const [reviewDialog, setReviewDialog] = React.useState<{
    open: boolean;
    submissionId: string;
    action: "approved" | "rejected";
    adminNotes: string;
  }>({
    open: false,
    submissionId: "",
    action: "approved",
    adminNotes: "",
  });
  const [isReviewing, setIsReviewing] = React.useState(false);

  // Review Dialog State for Medicine Claims
  const [claimReviewDialog, setClaimReviewDialog] = React.useState<{
    open: boolean;
    claim: MedicineClaimRequest | null;
    action: "approved" | "rejected";
    adminNotes: string;
  }>({
    open: false,
    claim: null,
    action: "approved",
    adminNotes: "",
  });
  const [isReviewingClaim, setIsReviewingClaim] = React.useState(false);

  // Prescription Document Preview Modal
  const [prescriptionPreview, setPrescriptionPreview] = React.useState<{
    open: boolean;
    claim: MedicineClaimRequest | null;
  }>({
    open: false,
    claim: null,
  });

  // Handle Provider Submission Review
  const handleReviewSubmission = async () => {
    setIsReviewing(true);
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: reviewDialog.submissionId,
          status: reviewDialog.action,
          adminNotes: reviewDialog.adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process review.");

      setSubmissions((prev) =>
        prev.map((s) => (s.id === reviewDialog.submissionId ? data.submission : s))
      );

      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          action: `VERIFICATION_${reviewDialog.action.toUpperCase()}`,
          entityType: "provider_verification",
          entityId: reviewDialog.submissionId,
          userId: "admin",
          createdAt: new Date().toISOString(),
          details: { adminNotes: reviewDialog.adminNotes },
        },
        ...prev,
      ]);

      toast({
        type: "success",
        title: "Provider Review Recorded",
        description: `Provider verification has been marked as ${reviewDialog.action}.`,
      });

      setReviewDialog((prev) => ({ ...prev, open: false, adminNotes: "" }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error processing review.";
      toast({ type: "error", title: "Error", description: msg });
    } finally {
      setIsReviewing(false);
    }
  };

  // Handle Medicine Claim Review
  const handleReviewClaim = async () => {
    if (!claimReviewDialog.claim) return;
    setIsReviewingClaim(true);
    try {
      const res = await fetch("/api/medicine/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimId: claimReviewDialog.claim.id,
          status: claimReviewDialog.action,
          adminNotes: claimReviewDialog.adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update claim.");

      setClaims((prev) =>
        prev.map((c) => (c.id === claimReviewDialog.claim!.id ? data.claim : c))
      );

      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          action: `CLAIM_${claimReviewDialog.action.toUpperCase()}`,
          entityType: "medicine_claim",
          entityId: claimReviewDialog.claim!.id,
          userId: "admin",
          createdAt: new Date().toISOString(),
          details: {
            listingTitle: claimReviewDialog.claim!.listingTitle,
            adminNotes: claimReviewDialog.adminNotes,
          },
        },
        ...prev,
      ]);

      toast({
        type: "success",
        title: `Prescription Claim ${claimReviewDialog.action === "approved" ? "Approved" : "Rejected"}`,
        description:
          claimReviewDialog.action === "approved"
            ? "Prescription verified! Medicine reserved and unmasked seller contact released to patient."
            : "Claim marked as rejected. Claimant notified with remarks.",
      });

      setClaimReviewDialog((prev) => ({ ...prev, open: false, adminNotes: "", claim: null }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating claim.";
      toast({ type: "error", title: "Error", description: msg });
    } finally {
      setIsReviewingClaim(false);
    }
  };

  // Handle Service Request Status Transition
  const handleQuickStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );

      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          action: "UPDATE_REQUEST_STATUS",
          entityType: "assistance_request",
          entityId: requestId,
          userId: "admin",
          createdAt: new Date().toISOString(),
          details: { newStatus },
        },
        ...prev,
      ]);

      toast({
        type: "success",
        title: "Request Status Updated",
        description: `Request status transitioned to ${newStatus}.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating request.";
      toast({ type: "error", title: "Error", description: msg });
    }
  };

  // 1. Filtered Claims
  const filteredClaims = claims.filter((c) => {
    const matchesFilter = claimFilter === "all" || c.status === claimFilter;
    const q = claimSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.listingTitle.toLowerCase().includes(q) ||
      c.patientName.toLowerCase().includes(q) ||
      c.doctorName.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.sellerName && c.sellerName.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  // 2. Filtered Blood Requests
  const bloodRequests = requests.filter((r) => r.category === "blood");
  const filteredBlood = bloodRequests.filter((r) => {
    const matchesGroup =
      bloodGroupFilter === "all" || r.bloodDetails?.bloodGroup === bloodGroupFilter;
    const q = bloodSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      (r.bloodDetails?.hospitalName && r.bloodDetails.hospitalName.toLowerCase().includes(q)) ||
      (r.bloodDetails?.patientName && r.bloodDetails.patientName.toLowerCase().includes(q));
    return matchesGroup && matchesSearch;
  });

  // 3. Filtered Assistance Requests (Non-Blood)
  const assistanceRequests = requests.filter((r) => r.category !== "blood");
  const filteredAssistance = assistanceRequests.filter((r) => {
    const matchesCategory =
      assistanceCatFilter === "all" || r.category === assistanceCatFilter;
    const q = assistanceSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      (r.userName && r.userName.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // 4. Filtered Donors
  const filteredDonors = donors.filter((d) => {
    const matchesGroup = donorGroupFilter === "all" || d.bloodGroup === donorGroupFilter;
    const q = donorSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (d.donorName && d.donorName.toLowerCase().includes(q)) ||
      (d.locality && d.locality.toLowerCase().includes(q)) ||
      d.city.toLowerCase().includes(q) ||
      (d.phoneNumber && d.phoneNumber.includes(q));
    return matchesGroup && matchesSearch;
  });

  // 5. Filtered Resources
  const filteredResources = resources.filter((res) => {
    const matchesCat =
      resourceCategoryFilter === "all" || res.category === resourceCategoryFilter;
    const q = resourceSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      res.name.toLowerCase().includes(q) ||
      res.city.toLowerCase().includes(q) ||
      res.address.toLowerCase().includes(q) ||
      res.servicesOffered.some((s) => s.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  // 6. Filtered Organ Pledges
  const filteredOrgans = organPledges.filter((p) => {
    const q = organSearch.toLowerCase().trim();
    return (
      !q ||
      p.fullName.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.pledgedOrgans.some((o) => o.toLowerCase().includes(q))
    );
  });

  // 7. Filtered Logs
  const filteredLogs = logs.filter((l) => {
    const matchesEntity = logFilter === "all" || l.entityType === logFilter;
    const q = logSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      l.action.toLowerCase().includes(q) ||
      (l.userEmail && l.userEmail.toLowerCase().includes(q)) ||
      (l.entityId && l.entityId.toLowerCase().includes(q));
    return matchesEntity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Control Center & Universal Healthcare Moderation"
        description="Comprehensive dashboard displaying all requests, approval metrics, voluntary donors, surplus medicine claims, and verified healthcare infrastructure."
        badge={
          <span className="bg-slate-900 text-white text-xs px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            Super Administrator Portal
          </span>
        }
      />

      {/* Complete Metrics Overview Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Metric 1: Total Requests & Approvals */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-slate-500 font-medium">Total Requests</span>
          <div className="text-2xl font-bold text-slate-900 flex items-center gap-1.5">
            <Activity className="h-5 w-5 text-indigo-600" />
            <span>{stats.totalRequests}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            {stats.approvedRequests} Approved
          </span>
        </div>

        {/* Metric 2: Approved Requests */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-emerald-800 font-semibold">Approved Reqs</span>
          <div className="text-2xl font-bold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>{stats.approvedRequests}</span>
          </div>
          <span className="text-[11px] text-emerald-700">Immediate fulfillment</span>
        </div>

        {/* Metric 3: Pending Reqs */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-amber-800 font-semibold">Under Review</span>
          <div className="text-2xl font-bold text-amber-700 flex items-center gap-1.5">
            <Clock className="h-5 w-5 text-amber-600" />
            <span>{stats.pendingRequests}</span>
          </div>
          <span className="text-[11px] text-amber-700">Awaiting clearance</span>
        </div>

        {/* Metric 4: Medicine Claims (Emerald) */}
        <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-emerald-800 font-semibold">Medicine Claims</span>
          <div className="text-2xl font-bold text-emerald-800 flex items-center gap-1.5">
            <Pill className="h-5 w-5 text-emerald-600" />
            <span>{stats.totalClaims}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            {stats.approvedClaims} approved & unmasked
          </span>
        </div>

        {/* Metric 5: Emergency Blood (Red) */}
        <div className="bg-red-50/40 border border-red-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-red-800 font-semibold">Blood Appeals</span>
          <div className="text-2xl font-bold text-red-700 flex items-center gap-1.5">
            <Heart className="h-5 w-5 text-red-600 animate-pulse" />
            <span>{stats.totalBloodRequests}</span>
          </div>
          <span className="text-[11px] text-red-700">All blood groups</span>
        </div>

        {/* Metric 6: Voluntary Donors (Rose/Red) */}
        <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-rose-800 font-semibold">Life-Saver Donors</span>
          <div className="text-2xl font-bold text-rose-700 flex items-center gap-1.5">
            <Users className="h-5 w-5 text-rose-600" />
            <span>{stats.totalDonors}</span>
          </div>
          <span className="text-[11px] text-rose-700">Active voluntary donors</span>
        </div>

        {/* Metric 7: Directory & Pledges */}
        <div className="bg-purple-50/40 border border-purple-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-purple-800 font-semibold">Organ Pledges</span>
          <div className="text-2xl font-bold text-purple-700 flex items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>{stats.totalOrganPledges}</span>
          </div>
          <span className="text-[11px] text-purple-700">{stats.totalResources} Hospitals & Banks</span>
        </div>
      </div>

      {/* Section-Themed Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        {/* Tab 1: Medicine Claims - Emerald Theme */}
        <button
          onClick={() => setActiveTab("claims")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "claims"
              ? "border-emerald-600 text-emerald-900 bg-emerald-50/70 rounded-t shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Pill className="h-3.5 w-3.5 text-emerald-600" />
          <span>Medicine Claims ({claims.length})</span>
          {stats.pendingClaims > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {stats.pendingClaims}
            </span>
          )}
        </button>

        {/* Tab 2: Emergency Blood - Red Theme */}
        <button
          onClick={() => setActiveTab("blood")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "blood"
              ? "border-red-600 text-red-900 bg-red-50/70 rounded-t shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Heart className="h-3.5 w-3.5 text-red-600" />
          <span>Blood Requisitions ({bloodRequests.length})</span>
        </button>

        {/* Tab 3: Medical Assistance - Sky Blue Theme */}
        <button
          onClick={() => setActiveTab("assistance")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "assistance"
              ? "border-sky-600 text-sky-900 bg-sky-50/70 rounded-t shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="h-3.5 w-3.5 text-sky-600" />
          <span>Assistance & Equipment ({assistanceRequests.length})</span>
        </button>

        {/* Tab 4: Voluntary Donors - Rose Theme */}
        <button
          onClick={() => setActiveTab("donors")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "donors"
              ? "border-rose-600 text-rose-900 bg-rose-50/70 rounded-t shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="h-3.5 w-3.5 text-rose-600" />
          <span>Donors Directory ({donors.length})</span>
        </button>

        {/* Tab 5: Healthcare Directory - Cyan/Teal Theme */}
        <button
          onClick={() => setActiveTab("resources")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "resources"
              ? "border-teal-600 text-teal-900 bg-teal-50/70 rounded-t shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="h-3.5 w-3.5 text-teal-600" />
          <span>Healthcare Directory ({resources.length})</span>
        </button>

        {/* Tab 6: Organ Pledges - Deep Purple Theme */}
        <button
          onClick={() => setActiveTab("organ")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "organ"
              ? "border-purple-600 text-purple-900 bg-purple-50/70 rounded-t shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span>Organ Pledges ({organPledges.length})</span>
        </button>

        {/* Tab 7: Submissions - Indigo */}
        <button
          onClick={() => setActiveTab("submissions")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "submissions"
              ? "border-indigo-600 text-indigo-900 bg-indigo-50/70 rounded-t shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck className="h-3.5 w-3.5 text-indigo-600" />
          <span>Provider Licenses ({submissions.length})</span>
        </button>

        {/* Tab 8: Audit Logs - Slate */}
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "logs"
              ? "border-slate-800 text-slate-900 bg-slate-100/70 rounded-t shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <History className="h-3.5 w-3.5 text-slate-700" />
          <span>Audit Logs ({logs.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MEDICINE PRESCRIPTION CLAIMS (EMERALD THEME)           */}
      {/* ============================================================== */}
      {activeTab === "claims" && (
        <div className="bg-white border border-emerald-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-emerald-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <Pill className="h-4 w-4 text-emerald-600" />
                <span>Surplus Medicine Claims & Instant Prescription Approval Pipeline</span>
              </h2>
              <p className="text-xs text-emerald-800/80 mt-0.5">
                Claims auto-approved or verified by admin. Seller contact details unmasked for direct patient pickup.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={claimFilter}
                onChange={(e) => setClaimFilter(e.target.value)}
                className="h-8 px-2.5 text-xs border border-emerald-200 rounded-lg bg-emerald-50/50 text-emerald-900 font-medium"
              >
                <option value="all">All Claims ({claims.length})</option>
                <option value="approved">Approved & Unmasked ({claims.filter((c) => c.status === "approved").length})</option>
                <option value="completed">Completed ({claims.filter((c) => c.status === "completed").length})</option>
                <option value="pending_verification">Pending Verification ({claims.filter((c) => c.status === "pending_verification").length})</option>
              </select>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-emerald-600 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={claimSearch}
                  onChange={(e) => setClaimSearch(e.target.value)}
                  placeholder="Search drug, patient, doctor..."
                  className="h-8 pl-8 pr-3 text-xs border border-emerald-200 rounded-lg bg-emerald-50/30 text-slate-800 w-48 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <Pill className="h-8 w-8 text-slate-300 mx-auto" />
              <p>No medicine claims found matching filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClaims.map((claim) => (
                <div
                  key={claim.id}
                  className={`border rounded-xl p-4 text-xs space-y-3 transition-colors ${
                    claim.status === "approved"
                      ? "border-emerald-200 bg-emerald-50/20"
                      : claim.status === "completed"
                      ? "border-blue-200 bg-blue-50/20"
                      : "border-amber-200 bg-amber-50/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{claim.listingTitle}</span>
                        <StatusBadge status={claim.status} variant="status" />
                        <span className="text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                          Offered: ₹{claim.offeredPrice || 100}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 pt-1">
                        <div>
                          Patient: <strong className="text-slate-900">{claim.patientName}</strong>
                          <span className="block text-[11px] text-slate-500">Phone: {claim.requesterPhone}</span>
                        </div>
                        <div>
                          Doctor: <strong className="text-slate-900">{claim.doctorName}</strong>
                          <span className="block text-[11px] text-slate-500">Reg: {claim.doctorRegNo || "Verified"}</span>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                          <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                            Direct Seller Contact
                          </span>
                          <strong className="text-emerald-950 font-bold block">{claim.sellerName || "Medicine Donor"}</strong>
                          <div className="flex items-center gap-1.5 mt-1">
                            <a
                              href={`tel:${claim.sellerContact}`}
                              className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
                            >
                              <Phone className="h-3 w-3" />
                              <span>{claim.sellerContact}</span>
                            </a>
                            <span className="text-slate-400">&bull;</span>
                            <span className="text-slate-600">{claim.locality}, {claim.city}</span>
                          </div>
                        </div>
                      </div>

                      {claim.adminNotes && (
                        <p className="text-[11px] text-emerald-800 italic bg-white p-2 rounded border border-emerald-100">
                          <strong>Admin remark: </strong>{claim.adminNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => setPrescriptionPreview({ open: true, claim })}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-1"
                      >
                        <FileCheck className="h-3.5 w-3.5" />
                        <span>Prescription Rx</span>
                      </button>

                      {claim.status === "pending_verification" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setClaimReviewDialog({
                              open: true,
                              claim,
                              action: "approved",
                              adminNotes: "Prescription validated. Seller contact unlocked.",
                            });
                          }}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-3 font-semibold"
                        >
                          Approve Claim
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: EMERGENCY BLOOD REQUISITIONS (RED THEME)               */}
      {/* ============================================================== */}
      {activeTab === "blood" && (
        <div className="bg-white border border-red-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-red-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-red-950 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-600" />
                <span>Emergency Blood Requisitions ({filteredBlood.length})</span>
              </h2>
              <p className="text-xs text-red-800/80 mt-0.5">
                Critical hospital blood needs. Matched voluntary donors and blood bank hotlines unlocked.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
                className="h-8 px-2.5 text-xs border border-red-200 rounded-lg bg-red-50/50 text-red-900 font-medium"
              >
                <option value="all">All Blood Groups</option>
                <option value="O+">O+ Group</option>
                <option value="O-">O- Universal RBC</option>
                <option value="A+">A+ Group</option>
                <option value="A-">A- Group</option>
                <option value="B+">B+ Group</option>
                <option value="B-">B- Group</option>
                <option value="AB+">AB+ Group</option>
                <option value="AB-">AB- Group</option>
              </select>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-red-600 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={bloodSearch}
                  onChange={(e) => setBloodSearch(e.target.value)}
                  placeholder="Search hospital, city..."
                  className="h-8 pl-8 pr-3 text-xs border border-red-200 rounded-lg bg-red-50/30 text-slate-800 w-44 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredBlood.map((req) => (
              <div
                key={req.id}
                className="border border-red-100 rounded-xl p-4 text-xs space-y-2 bg-gradient-to-r from-red-50/30 via-white to-white hover:border-red-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-red-600 text-white font-extrabold text-sm shadow-2xs">
                      {req.bloodDetails?.bloodGroup || "O+"}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{req.title}</h3>
                      <span className="text-[11px] text-slate-500">
                        Hospital: <strong>{req.bloodDetails?.hospitalName}</strong> &bull; {req.city}, {req.state}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.priority} variant="priority" />
                    <StatusBadge status={req.status} variant="status" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-red-100/60 text-slate-600">
                  <div>
                    Patient: <strong className="text-slate-900">{req.bloodDetails?.patientName || req.userName}</strong>
                  </div>
                  <div>
                    Units: <strong className="text-slate-900">{req.bloodDetails?.unitsNeeded || 1} Unit(s)</strong>
                  </div>
                  <div>
                    Component: <strong className="text-slate-900 capitalize">{req.bloodDetails?.bloodComponent.replace(/_/g, " ")}</strong>
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <select
                      value={req.status}
                      onChange={(e) => handleQuickStatusChange(req.id, e.target.value as RequestStatus)}
                      className="h-7 px-2 border border-slate-200 rounded text-xs bg-white text-slate-800 font-medium"
                    >
                      <option value="approved">Approved</option>
                      <option value="matched">Matched</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: MEDICAL ASSISTANCE & EQUIPMENT (SKY BLUE THEME)        */}
      {/* ============================================================== */}
      {activeTab === "assistance" && (
        <div className="bg-white border border-sky-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sky-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-sky-950 flex items-center gap-2">
                <Activity className="h-4 w-4 text-sky-600" />
                <span>Medical Equipment & Welfare Assistance ({filteredAssistance.length})</span>
              </h2>
              <p className="text-xs text-sky-800/80 mt-0.5">
                Wheelchairs, oxygen concentrators, hospital beds, and charitable co-pay navigation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={assistanceCatFilter}
                onChange={(e) => setAssistanceCatFilter(e.target.value)}
                className="h-8 px-2.5 text-xs border border-sky-200 rounded-lg bg-sky-50/50 text-sky-900 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="equipment">Equipment Loans</option>
                <option value="financial">Financial Aid</option>
                <option value="medicine">Specialized Medicine</option>
                <option value="general">General Healthcare</option>
              </select>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-sky-600 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={assistanceSearch}
                  onChange={(e) => setAssistanceSearch(e.target.value)}
                  placeholder="Search equipment, patient..."
                  className="h-8 pl-8 pr-3 text-xs border border-sky-200 rounded-lg bg-sky-50/30 text-slate-800 w-44 focus:outline-none focus:ring-1 focus:ring-sky-600"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAssistance.map((req) => (
              <div
                key={req.id}
                className="border border-sky-100 rounded-xl p-4 text-xs space-y-2.5 bg-gradient-to-r from-sky-50/20 via-white to-white hover:border-sky-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-100 text-sky-800">
                        {req.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{req.title}</h3>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">{req.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.priority} variant="priority" />
                    <StatusBadge status={req.status} variant="status" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-sky-100/60 text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>Requester: <strong className="text-slate-800">{req.userName}</strong></span>
                    <span>Location: <strong className="text-slate-800">{req.locality ? `${req.locality}, ` : ""}{req.city}</strong></span>
                    <span className="text-sky-700 font-semibold">Support Helpline: +91-800-MEDSHARE</span>
                  </div>
                  <select
                    value={req.status}
                    onChange={(e) => handleQuickStatusChange(req.id, e.target.value as RequestStatus)}
                    className="h-7 px-2 border border-slate-200 rounded text-xs bg-white text-slate-800 font-medium"
                  >
                    <option value="approved">Approved</option>
                    <option value="matched">Matched</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: VOLUNTARY DONORS DIRECTORY (ROSE / RED THEME)          */}
      {/* ============================================================== */}
      {activeTab === "donors" && (
        <div className="bg-white border border-rose-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-rose-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                <Users className="h-4 w-4 text-rose-600" />
                <span>Voluntary Life-Saver Donors Directory ({filteredDonors.length} Verified)</span>
              </h2>
              <p className="text-xs text-rose-800/80 mt-0.5">
                Direct contact phone numbers available for authorized hospital emergency blood coordination.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={donorGroupFilter}
                onChange={(e) => setDonorGroupFilter(e.target.value)}
                className="h-8 px-2.5 text-xs border border-rose-200 rounded-lg bg-rose-50/50 text-rose-900 font-medium"
              >
                <option value="all">All Groups ({donors.length})</option>
                <option value="O+">O+ Donors</option>
                <option value="O-">O- Universal Donors</option>
                <option value="A+">A+ Donors</option>
                <option value="A-">A- Donors</option>
                <option value="B+">B+ Donors</option>
                <option value="B-">B- Donors</option>
                <option value="AB+">AB+ Donors</option>
                <option value="AB-">AB- Donors</option>
              </select>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-rose-600 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  placeholder="Search donor name, city..."
                  className="h-8 pl-8 pr-3 text-xs border border-rose-200 rounded-lg bg-rose-50/30 text-slate-800 w-44 focus:outline-none focus:ring-1 focus:ring-rose-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDonors.map((donor) => {
              const donorPhone = donor.phoneNumber || "+91-9876543210";
              const cleanPhone = donorPhone.replace(/[^0-9]/g, "");
              return (
                <div
                  key={donor.id}
                  className="border border-rose-100 rounded-xl p-3.5 text-xs space-y-2 bg-gradient-to-br from-rose-50/40 via-white to-white hover:border-rose-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{donor.donorName || "Voluntary Donor"}</span>
                    <span className="px-2 py-0.5 rounded font-extrabold text-xs bg-red-600 text-white">
                      {donor.bloodGroup}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>{donor.locality || donor.city}, {donor.city}</span>
                    <span className="text-emerald-700 font-semibold capitalize">
                      {donor.availabilityStatus.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-rose-100/70 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <Phone className="h-3.5 w-3.5 text-rose-600" />
                      <span>{donorPhone}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${donorPhone}`}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: HEALTHCARE DIRECTORY (CYAN / TEAL THEME)               */}
      {/* ============================================================== */}
      {activeTab === "resources" && (
        <div className="bg-white border border-teal-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-teal-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-teal-950 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-teal-600" />
                <span>Verified Healthcare Directory ({filteredResources.length} Facilities)</span>
              </h2>
              <p className="text-xs text-teal-800/80 mt-0.5">
                Apex Hospitals, Licensed Component Blood Banks, Jan Aushadhi Generic Hubs, and Transplant Centers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={resourceCategoryFilter}
                onChange={(e) => setResourceCategoryFilter(e.target.value)}
                className="h-8 px-2.5 text-xs border border-teal-200 rounded-lg bg-teal-50/50 text-teal-900 font-medium"
              >
                <option value="all">All Facilities ({resources.length})</option>
                <option value="hospital">Hospitals</option>
                <option value="blood_bank">Blood Banks</option>
                <option value="authorized_pharmacy">Janaushadhi Hubs</option>
                <option value="transplant_center">Transplant Centers</option>
              </select>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-teal-600 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  placeholder="Search hospital, city..."
                  className="h-8 pl-8 pr-3 text-xs border border-teal-200 rounded-lg bg-teal-50/30 text-slate-800 w-44 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="border border-teal-100 rounded-xl p-4 text-xs space-y-2.5 bg-gradient-to-br from-teal-50/20 to-white hover:border-teal-300 transition-colors shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{res.name}</h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">{res.address}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold capitalize bg-teal-100 text-teal-800">
                    {res.category.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.servicesOffered.map((srv, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                      {srv}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-teal-100/70 flex items-center justify-between text-slate-600">
                  <a href={`tel:${res.phone}`} className="font-bold text-teal-800 hover:underline flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{res.phone}</span>
                  </a>
                  <span className="text-[11px] text-slate-400">{res.operationalHours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: ORGAN DONATION PLEDGES (DEEP PURPLE THEME)             */}
      {/* ============================================================== */}
      {activeTab === "organ" && (
        <div className="bg-white border border-purple-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Statutory Organ Donation Awareness Pledges ({filteredOrgans.length})</span>
              </h2>
              <p className="text-xs text-purple-800/80 mt-0.5">
                Educational citizen pledges in strict compliance with the Transplantation of Human Organs Act (THOA) 1994.
              </p>
            </div>

            <div className="relative">
              <Search className="h-3.5 w-3.5 text-purple-600 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={organSearch}
                onChange={(e) => setOrganSearch(e.target.value)}
                placeholder="Search citizen or city..."
                className="h-8 pl-8 pr-3 text-xs border border-purple-200 rounded-lg bg-purple-50/30 text-slate-800 w-48 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredOrgans.map((pld) => (
              <div
                key={pld.id}
                className="border border-purple-100 rounded-xl p-3.5 text-xs space-y-2 bg-gradient-to-br from-purple-50/30 to-white shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{pld.fullName}</span>
                  <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-bold">
                    Pledged Citizen
                  </span>
                </div>

                <div className="text-slate-600 text-[11px]">
                  <span>Location: {pld.city}, {pld.state}</span> &bull; <span>{pld.phone}</span>
                </div>

                <div className="pt-1.5 border-t border-purple-100/60">
                  <span className="text-[10px] text-purple-900 font-semibold block mb-1">Pledged Organs & Tissues:</span>
                  <div className="flex flex-wrap gap-1">
                    {pld.pledgedOrgans.map((org, i) => (
                      <span key={i} className="bg-purple-100/70 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: PROVIDER ACCREDITATION (INDIGO THEME)                  */}
      {/* ============================================================== */}
      {activeTab === "submissions" && (
        <div className="bg-white border border-indigo-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Provider Clinical Establishment & Accreditation Submissions
          </h2>

          {submissions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No verification submissions queued.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="border border-slate-200 rounded-xl p-4 text-xs space-y-3 bg-slate-50/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <strong className="text-sm font-bold text-slate-900 block">
                        {sub.organizationName}
                      </strong>
                      <span className="text-slate-500">
                        {sub.documentName} &bull; {sub.documentType}
                      </span>
                    </div>
                    <StatusBadge status={sub.status} variant="verification" />
                  </div>

                  {sub.notes && (
                    <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 text-xs">
                      <strong className="text-slate-900 font-semibold">Provider note: </strong>
                      {sub.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 gap-2">
                    <a
                      href={sub.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <span>Inspect Official Registration Certificate</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    {sub.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setReviewDialog({
                              open: true,
                              submissionId: sub.id,
                              action: "rejected",
                              adminNotes: "Official registry license verification failed or incomplete.",
                            })
                          }
                          className="text-xs text-red-700 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Decline
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            setReviewDialog({
                              open: true,
                              submissionId: sub.id,
                              action: "approved",
                              adminNotes: "State health register records verified successfully.",
                            })
                          }
                          className="text-xs bg-emerald-700 hover:bg-emerald-800 border-emerald-800 font-semibold"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Approve Provider
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 8: AUDIT LOGS (SLATE THEME)                                */}
      {/* ============================================================== */}
      {activeTab === "logs" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">System Security Audit Log & Operations Stream</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Immutable records of claim reviews, auto-approvals, user registrations, and administrative decisions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="h-8 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
              >
                <option value="all">All Entities</option>
                <option value="medicine_claim">Medicine Claims</option>
                <option value="blood_request">Blood Requests</option>
                <option value="assistance_request">Assistance Requests</option>
                <option value="donor_profile">Donors</option>
                <option value="provider_verification">Provider Verifications</option>
                <option value="user">User Auth</option>
              </select>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Filter logs..."
                  className="h-8 pl-8 pr-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 w-44 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">User / Actor</th>
                  <th className="py-2.5 px-3">Entity Type</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-mono">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          log.action.includes("APPROVE")
                            ? "bg-emerald-100 text-emerald-800"
                            : log.action.includes("REJECT")
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[140px]">
                      {log.userEmail || log.userId || "System"}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 capitalize">{log.entityType.replace(/_/g, " ")}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provider Review Dialog */}
      <Dialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog((prev) => ({ ...prev, open: false }))}
        title={reviewDialog.action === "approved" ? "Approve Healthcare Provider" : "Decline Verification"}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            {reviewDialog.action === "approved"
              ? "Approving this provider will grant verified badge status and unlock provider coordination features."
              : "State the reason for declining this provider's verification documentation."}
          </p>

          <Textarea
            value={reviewDialog.adminNotes}
            onChange={(e) =>
              setReviewDialog((prev) => ({ ...prev, adminNotes: e.target.value }))
            }
            rows={3}
            placeholder="Official administrator review notes..."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewDialog((prev) => ({ ...prev, open: false }))}
            >
              Cancel
            </Button>
            <Button
              variant={reviewDialog.action === "approved" ? "primary" : "danger"}
              size="sm"
              onClick={handleReviewSubmission}
              isLoading={isReviewing}
            >
              Confirm {reviewDialog.action === "approved" ? "Approval" : "Rejection"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Medicine Claim Review Dialog */}
      <Dialog
        open={claimReviewDialog.open}
        onClose={() => setClaimReviewDialog((prev) => ({ ...prev, open: false, claim: null }))}
        title={
          claimReviewDialog.action === "approved"
            ? "Approve Medicine Claim & Release Seller Contact"
            : "Decline Medicine Prescription Claim"
        }
      >
        <div className="space-y-4 text-xs">
          {claimReviewDialog.claim && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-slate-700">
              <strong className="block text-slate-900 font-bold">{claimReviewDialog.claim.listingTitle}</strong>
              <div>Patient: <span className="font-semibold text-slate-900">{claimReviewDialog.claim.patientName}</span></div>
              <div>Doctor: <span className="font-semibold text-slate-900">Dr. {claimReviewDialog.claim.doctorName}</span> (Reg No: {claimReviewDialog.claim.doctorRegNo || "N/A"})</div>
            </div>
          )}

          <p className="text-slate-600 leading-relaxed">
            {claimReviewDialog.action === "approved"
              ? "Approving this claim certifies that the doctor prescription is authentic. The surplus medicine will be reserved, and seller contact details will be released to the patient."
              : "Specify the statutory reason for declining this claim."}
          </p>

          <Textarea
            value={claimReviewDialog.adminNotes}
            onChange={(e) =>
              setClaimReviewDialog((prev) => ({ ...prev, adminNotes: e.target.value }))
            }
            rows={3}
            placeholder="Review remarks (will be notified to claimant)..."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClaimReviewDialog((prev) => ({ ...prev, open: false, claim: null }))}
            >
              Cancel
            </Button>
            <Button
              variant={claimReviewDialog.action === "approved" ? "primary" : "danger"}
              size="sm"
              onClick={handleReviewClaim}
              isLoading={isReviewingClaim}
            >
              Confirm {claimReviewDialog.action === "approved" ? "Approval" : "Rejection"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Prescription Document Modal Preview */}
      <Dialog
        open={prescriptionPreview.open}
        onClose={() => setPrescriptionPreview({ open: false, claim: null })}
        title="Uploaded Doctor Prescription Verification"
      >
        {prescriptionPreview.claim && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
              <h4 className="font-bold text-emerald-900 text-sm">{prescriptionPreview.claim.listingTitle}</h4>
              <p className="text-emerald-800">
                Patient: <strong>{prescriptionPreview.claim.patientName}</strong> &bull; Prescribing Doctor: <strong>Dr. {prescriptionPreview.claim.doctorName}</strong>
              </p>
              <p className="text-emerald-700">
                Medical Council Reg No: <strong>{prescriptionPreview.claim.doctorRegNo || "Verified"}</strong>
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-center space-y-3">
              <FileCheck className="h-10 w-10 text-emerald-700 mx-auto" />
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">Prescription Document File</span>
                <span className="text-[11px] text-slate-500 block truncate max-w-sm mx-auto">
                  {prescriptionPreview.claim.prescriptionUrl}
                </span>
              </div>
              <div className="pt-2">
                <a
                  href={prescriptionPreview.claim.prescriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 text-xs shadow-2xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Full Prescription Image / PDF</span>
                </a>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPrescriptionPreview({ open: false, claim: null })}
              >
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
