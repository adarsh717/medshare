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
} from "@/types";
import { formatDateTime, formatDate } from "@/lib/utils";

interface AdminProps {
  stats: {
    totalRequests: number;
    totalBloodRequests: number;
    totalDonors: number;
    totalResources: number;
    pendingSubmissions: number;
    pendingClaims: number;
  };
  initialSubmissions: ProviderVerificationSubmission[];
  initialClaims: MedicineClaimRequest[];
  initialRequests: AssistanceRequest[];
  initialLogs: AuditLog[];
}

export function AdminControlCenter({
  stats,
  initialSubmissions,
  initialClaims,
  initialRequests,
  initialLogs,
}: AdminProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<"claims" | "moderation" | "submissions" | "logs">("claims");
  const [submissions, setSubmissions] = React.useState(initialSubmissions);
  const [claims, setClaims] = React.useState(initialClaims);
  const [requests, setRequests] = React.useState(initialRequests);
  const [logs, setLogs] = React.useState(initialLogs);

  // Filters & Search
  const [claimFilter, setClaimFilter] = React.useState<string>("all");
  const [claimSearch, setClaimSearch] = React.useState<string>("");
  const [requestFilter, setRequestFilter] = React.useState<string>("all");
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

      // Add a fresh log item to state
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          action: reviewDialog.action === "approved" ? "APPROVE_PROVIDER" : "REJECT_PROVIDER",
          entityType: "provider_verification",
          entityId: reviewDialog.submissionId,
          userId: "admin",
          createdAt: new Date().toISOString(),
          details: { status: reviewDialog.action, notes: reviewDialog.adminNotes },
        },
        ...prev,
      ]);

      toast({
        type: "success",
        title: `Provider ${reviewDialog.action === "approved" ? "Approved" : "Rejected"}`,
        description: `Verification status updated and logged.`,
      });

      setReviewDialog((prev) => ({ ...prev, open: false, adminNotes: "" }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Review error.";
      toast({ type: "error", title: "Error", description: msg });
    } finally {
      setIsReviewing(false);
    }
  };

  // Handle Medicine Claim Approval / Rejection
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

      // Record local log
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          action: claimReviewDialog.action === "approved" ? "APPROVE_MEDICINE_CLAIM" : "REJECT_MEDICINE_CLAIM",
          entityType: "medicine_claim",
          entityId: claimReviewDialog.claim!.id,
          userId: "admin",
          createdAt: new Date().toISOString(),
          details: {
            listingTitle: claimReviewDialog.claim!.listingTitle,
            patientName: claimReviewDialog.claim!.patientName,
            status: claimReviewDialog.action,
            notes: claimReviewDialog.adminNotes,
          },
        },
        ...prev,
      ]);

      toast({
        type: "success",
        title: `Prescription Claim ${claimReviewDialog.action === "approved" ? "Approved" : "Rejected"}`,
        description: claimReviewDialog.action === "approved"
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

  // Filtered Claims
  const filteredClaims = claims.filter((c) => {
    const matchesFilter = claimFilter === "all" || c.status === claimFilter;
    const q = claimSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.listingTitle.toLowerCase().includes(q) ||
      c.patientName.toLowerCase().includes(q) ||
      c.doctorName.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  // Filtered Requests
  const filteredRequests = requests.filter((r) => {
    if (requestFilter === "all") return true;
    return r.category === requestFilter || r.status === requestFilter;
  });

  // Filtered Logs
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

  const pendingClaimsCount = claims.filter((c) => c.status === "pending_verification").length;
  const pendingSubmissionsCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrator Moderation & Approval Control Center"
        description="Verify prescription medicine claims, review healthcare provider credentials, moderate emergency requests, and audit system operations."
        badge={
          <span className="bg-purple-50 text-purple-800 text-xs px-2.5 py-0.5 rounded border border-purple-200 font-bold inline-flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            Restricted Admin Privilege
          </span>
        }
      />

      {/* Operational Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-slate-500 font-medium">Pending Claims</span>
          <div className="text-2xl font-bold text-amber-600 flex items-center gap-1.5">
            <Pill className="h-5 w-5 text-amber-500" />
            <span>{pendingClaimsCount}</span>
          </div>
          <span className="text-[11px] text-slate-400">Prescriptions to verify</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-slate-500 font-medium">Provider Licenses</span>
          <div className="text-2xl font-bold text-purple-700 flex items-center gap-1.5">
            <Building2 className="h-5 w-5 text-purple-500" />
            <span>{pendingSubmissionsCount}</span>
          </div>
          <span className="text-[11px] text-slate-400">Awaiting clearance</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-slate-500 font-medium">Emergency Blood</span>
          <div className="text-2xl font-bold text-red-700 flex items-center gap-1.5">
            <Heart className="h-5 w-5 text-red-500" />
            <span>{stats.totalBloodRequests}</span>
          </div>
          <span className="text-[11px] text-slate-400">Total blood appeals</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-slate-500 font-medium">Voluntary Donors</span>
          <div className="text-2xl font-bold text-slate-900 flex items-center gap-1.5">
            <Users className="h-5 w-5 text-slate-500" />
            <span>{stats.totalDonors}</span>
          </div>
          <span className="text-[11px] text-slate-400">Registered donors</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 shadow-2xs">
          <span className="text-slate-500 font-medium">Total Requests</span>
          <div className="text-2xl font-bold text-teal-700 flex items-center gap-1.5">
            <Activity className="h-5 w-5 text-teal-500" />
            <span>{stats.totalRequests}</span>
          </div>
          <span className="text-[11px] text-slate-400">Across all services</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("claims")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "claims"
              ? "border-amber-600 text-amber-900 bg-amber-50/50 rounded-t"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Pill className="h-3.5 w-3.5" />
          <span>Medicine Claims ({claims.length})</span>
          {pendingClaimsCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingClaimsCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("moderation")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "moderation"
              ? "border-teal-700 text-teal-900 bg-teal-50/50 rounded-t"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Service Requests ({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("submissions")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "submissions"
              ? "border-purple-700 text-purple-900 bg-purple-50/50 rounded-t"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Provider Licenses ({submissions.length})</span>
          {pendingSubmissionsCount > 0 && (
            <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingSubmissionsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "logs"
              ? "border-slate-800 text-slate-900 bg-slate-100/60 rounded-t"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>Audit Trail & Logs ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: MEDICINE PRESCRIPTION CLAIMS APPROVAL */}
      {activeTab === "claims" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Surplus Medicine Claims & Prescription Approval Pipeline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory verification under Drugs & Cosmetics Act: Verify doctor name, council reg no, and authentic prescription document before releasing seller contact details.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              <select
                value={claimFilter}
                onChange={(e) => setClaimFilter(e.target.value)}
                className="h-8 px-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Claims</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={claimSearch}
                  onChange={(e) => setClaimSearch(e.target.value)}
                  placeholder="Search patient, doctor, drug..."
                  className="h-8 pl-8 pr-3 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 w-48 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>
            </div>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <Pill className="h-8 w-8 text-slate-300 mx-auto" />
              <p>No medicine prescription claims found matching filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClaims.map((claim) => (
                <div
                  key={claim.id}
                  className={`border rounded-xl p-4 text-xs space-y-3 transition-colors ${
                    claim.status === "pending_verification"
                      ? "border-amber-200 bg-amber-50/20"
                      : claim.status === "approved"
                      ? "border-emerald-200 bg-emerald-50/10"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{claim.listingTitle}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            claim.status === "pending_verification"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : claim.status === "approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {claim.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
                        <span>Patient: <strong className="text-slate-800">{claim.patientName}</strong></span>
                        <span>&bull;</span>
                        <span>Requester: {claim.requesterName} ({claim.requesterPhone})</span>
                        <span>&bull;</span>
                        <span>Date: {formatDateTime(claim.createdAt)}</span>
                        {claim.city && (
                          <>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {claim.locality ? `${claim.locality}, ` : ""}{claim.city}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Pricing Pill */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block">Payable to Seller</span>
                      <strong className="text-sm font-extrabold text-emerald-700 block">
                        {claim.offeredPrice === 0 ? "₹0 (Charity Free)" : `₹${claim.offeredPrice}`}
                      </strong>
                    </div>
                  </div>

                  {/* Doctor & Prescription Details Box */}
                  <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Prescribing Doctor</span>
                      <strong className="text-slate-800 font-semibold block">Dr. {claim.doctorName}</strong>
                      <span className="text-slate-500 text-[11px]">
                        Registration No: <code className="text-slate-700 bg-white px-1.5 py-0.2 rounded border border-slate-200">{claim.doctorRegNo || "Unspecified"}</code>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Uploaded Prescription Document</span>
                      <div className="pt-0.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPrescriptionPreview({ open: true, claim })}
                          className="text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1 bg-white border border-teal-200 px-2.5 py-1 rounded-md text-xs shadow-2xs hover:bg-teal-50"
                        >
                          <FileText className="h-3.5 w-3.5 text-teal-600" />
                          <span>Inspect Prescription</span>
                        </button>
                        {claim.prescriptionUrl && (
                          <a
                            href={claim.prescriptionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-600 p-1"
                            title="Open direct file link"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {claim.notes && (
                    <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                      <strong>Patient Note:</strong> &quot;{claim.notes}&quot;
                    </p>
                  )}

                  {claim.adminNotes && (
                    <p className="text-[11px] text-purple-900 bg-purple-50 p-2 rounded border border-purple-100">
                      <strong>Admin Review Remark:</strong> {claim.adminNotes} (Reviewed by: {claim.reviewedBy || "Admin"})
                    </p>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      Claim ID: <code className="bg-transparent p-0 border-none">{claim.id}</code>
                    </span>

                    <div className="flex items-center gap-2">
                      {claim.status === "pending_verification" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setClaimReviewDialog({
                                open: true,
                                claim,
                                action: "rejected",
                                adminNotes: "Prescription illegible or doctor registration could not be verified on state medical registry.",
                              })
                            }
                            className="text-xs text-red-700 border-red-200 hover:bg-red-50 h-8"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Reject Claim
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              setClaimReviewDialog({
                                open: true,
                                claim,
                                action: "approved",
                                adminNotes: "Prescription verified authentic. Doctor registration confirmed valid under Medical Council of India guidelines.",
                              })
                            }
                            className="text-xs bg-emerald-700 hover:bg-emerald-800 border-emerald-800 h-8 font-semibold shadow-2xs"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Approve Claim & Release Contact
                          </Button>
                        </>
                      )}

                      {claim.status === "approved" && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Approved & Released to Seller ({claim.sellerContact || "Masked"})
                        </span>
                      )}

                      {claim.status === "rejected" && (
                        <span className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                          <XCircle className="h-3.5 w-3.5" />
                          Claim Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REQUEST MODERATION & APPROVALS */}
      {activeTab === "moderation" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Service Assistance & Emergency Blood Requests Queue
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and transition incoming requests across blood, equipment loans, and subsidized medical aid.
              </p>
            </div>

            <select
              value={requestFilter}
              onChange={(e) => setRequestFilter(e.target.value)}
              className="h-8 px-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
            >
              <option value="all">All Requests</option>
              <option value="blood">Blood Assistance</option>
              <option value="medicine">Medicine Navigation</option>
              <option value="equipment">Equipment Loans</option>
              <option value="financial_aid">Financial Guidance</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Title & Particulars</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Current Status</th>
                  <th className="py-2.5 px-3">Transition Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 max-w-xs font-medium text-slate-900">
                      <div className="font-semibold text-slate-900 truncate">{r.title}</div>
                      <span className="text-[11px] text-slate-400 block truncate">
                        Requester: {r.userName || r.userId} &bull; {formatDate(r.createdAt)}
                      </span>
                    </td>
                    <td className="py-3 px-3 capitalize">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={r.priority} variant="priority" />
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700">{r.locality ? `${r.locality}, ` : ""}{r.city}</span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={r.status} variant="status" />
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleQuickStatusChange(r.id, e.target.value as RequestStatus)
                        }
                        className="h-8 px-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-1 focus:ring-teal-700"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="matched">Matched / In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed / Declined</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROVIDER LICENSES */}
      {activeTab === "submissions" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
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

      {/* TAB 4: SYSTEM AUDIT LOG */}
      {activeTab === "logs" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">System Security Audit Log & Operations Stream</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Immutable records of claim reviews, prescription verifications, user logins, and administrative decisions.
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
                <option value="surplus_medicine">Surplus Medicines</option>
                <option value="assistance_request">Assistance Requests</option>
                <option value="blood_request">Blood Requests</option>
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
                  <th className="py-2.5 px-3">Entity ID</th>
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
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        log.action.includes("APPROVE")
                          ? "bg-emerald-100 text-emerald-800"
                          : log.action.includes("REJECT")
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[140px]">
                      {log.userEmail || log.userId || "System"}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 capitalize">{log.entityType.replace(/_/g, " ")}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 truncate max-w-[100px]">
                      {log.entityId || "N/A"}
                    </td>
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
        title={claimReviewDialog.action === "approved" ? "Approve Medicine Claim & Release Seller Contact" : "Decline Medicine Prescription Claim"}
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
              : "Specify the statutory reason for declining this claim (e.g. illegible prescription, invalid registration, or mismatched dosage)."}
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
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg space-y-1">
              <h4 className="font-bold text-teal-900 text-sm">{prescriptionPreview.claim.listingTitle}</h4>
              <p className="text-teal-800">
                Patient: <strong>{prescriptionPreview.claim.patientName}</strong> &bull; Prescribing Doctor: <strong>Dr. {prescriptionPreview.claim.doctorName}</strong>
              </p>
              <p className="text-teal-700">
                Medical Council Reg No: <strong>{prescriptionPreview.claim.doctorRegNo || "Not specified"}</strong>
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-center space-y-3">
              <FileCheck className="h-10 w-10 text-teal-700 mx-auto" />
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 text-xs shadow-2xs"
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
