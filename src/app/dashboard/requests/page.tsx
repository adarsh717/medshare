"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  PlusCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Pill,
  Clock,
  ShieldCheck,
  Phone,
  MapPin,
  Eye,
  AlertCircle,
  CheckCircle2,
  Percent,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { useToast } from "@/components/ui/toast";
import { AssistanceRequest, RequestStatus, MedicineClaimRequest } from "@/types";
import { formatDate } from "@/lib/utils";

export default function MyRequestsPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = React.useState<"claims" | "assistance">(
    searchParams.get("tab") === "assistance" ? "assistance" : "claims"
  );

  // Assistance requests state
  const [requests, setRequests] = React.useState<AssistanceRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Medicine claims state
  const [claims, setClaims] = React.useState<MedicineClaimRequest[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = React.useState(true);
  const [selectedClaimStatus, setSelectedClaimStatus] = React.useState<string>("all");
  const [previewPrescriptionUrl, setPreviewPrescriptionUrl] = React.useState<string | null>(null);

  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    requestId: string;
    targetStatus: RequestStatus;
    title: string;
    message: string;
  }>({
    open: false,
    requestId: "",
    targetStatus: "resolved",
    title: "",
    message: "",
  });

  const [claimCompleteDialog, setClaimCompleteDialog] = React.useState<{
    open: boolean;
    claimId: string;
    title: string;
    message: string;
  }>({
    open: false,
    claimId: "",
    title: "",
    message: "",
  });

  const fetchMyRequests = React.useCallback(async () => {
    setIsLoadingRequests(true);
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  const fetchMyClaims = React.useCallback(async () => {
    setIsLoadingClaims(true);
    try {
      const res = await fetch("/api/medicine/claims");
      const data = await res.json();
      if (data.claims) {
        setClaims(data.claims);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingClaims(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMyRequests();
    fetchMyClaims();
  }, [fetchMyRequests, fetchMyClaims]);

  const handleStatusUpdate = async () => {
    const { requestId, targetStatus } = confirmDialog;
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status.");
      }

      toast({
        type: "success",
        title: "Status Updated",
        description: `Request marked as ${targetStatus}.`,
      });

      setConfirmDialog((prev) => ({ ...prev, open: false }));
      fetchMyRequests();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating request.";
      toast({ type: "error", title: "Error", description: msg });
    }
  };

  const handleClaimComplete = async () => {
    const { claimId } = claimCompleteDialog;
    try {
      const res = await fetch(`/api/medicine/claims`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, status: "completed" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to mark claim as completed.");
      }

      toast({
        type: "success",
        title: "Claim Completed",
        description: "Medicine successfully marked as received.",
      });

      setClaimCompleteDialog((prev) => ({ ...prev, open: false }));
      fetchMyClaims();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating claim.";
      toast({ type: "error", title: "Error", description: msg });
    }
  };

  const filteredRequests = requests.filter(
    (r) => selectedStatus === "all" || r.status === selectedStatus
  );

  const filteredClaims = claims.filter(
    (c) => selectedClaimStatus === "all" || c.status === selectedClaimStatus
  );

  const pendingClaimsCount = claims.filter((c) => c.status === "pending_verification").length;
  const approvedClaimsCount = claims.filter((c) => c.status === "approved").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Requests & Medicine Claims"
        description="Track your doctor-prescription surplus medicine claims, urgent blood requests, and assistance tickets in real time."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/medicine">
              <Button variant="primary" size="sm" className="gap-1.5 shadow-sm">
                <Percent className="h-4 w-4" />
                <span>Browse 50% Off Medicines</span>
              </Button>
            </Link>
            <Link href="/blood/request">
              <Button variant="outline" size="sm" className="gap-1.5 text-red-700 hover:text-red-800 border-red-200">
                <PlusCircle className="h-4 w-4" />
                <span>New Blood Request</span>
              </Button>
            </Link>
            <Link href="/assistance/request">
              <Button variant="outline" size="sm" className="gap-1.5">
                <PlusCircle className="h-4 w-4" />
                <span>New Support Request</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Main Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("claims")}
          className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
            activeTab === "claims"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Pill className="h-4 w-4" />
          <span>My Medicine Claims (डॉक्टर पर्ची दावे)</span>
          {claims.length > 0 && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                pendingClaimsCount > 0
                  ? "bg-amber-100 text-amber-800"
                  : "bg-teal-100 text-teal-800"
              }`}
            >
              {claims.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("assistance")}
          className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
            activeTab === "assistance"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Blood & Assistance Requests (रक्त व सहायता)</span>
          {requests.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: MEDICINE CLAIMS TRACKING */}
      {activeTab === "claims" && (
        <div className="space-y-6">
          {/* Informational Verification Banner */}
          <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-white border border-teal-200/80 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-sm shrink-0 mt-0.5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Prescription-Protected Resale Verification Workflow
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To safeguard patient health and prevent illicit drug trading, every claim is held in{" "}
                  <strong className="text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    Pending Admin Verification
                  </strong>{" "}
                  until our medical admin team reviews the uploaded doctor&apos;s prescription.
                  Once verified, the seller&apos;s unmasked contact details and pickup address will unlock here.
                </p>
              </div>
            </div>

            {approvedClaimsCount > 0 && (
              <div className="shrink-0 bg-emerald-100/70 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                <span>{approvedClaimsCount} Claim(s) Ready for Pickup!</span>
              </div>
            )}
          </div>

          {/* Status Filter Tabs for Claims */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
            {[
              { id: "all", label: "All Claims" },
              { id: "pending_verification", label: "Pending Verification" },
              { id: "approved", label: "Approved (Ready for Pickup)" },
              { id: "completed", label: "Completed" },
              { id: "rejected", label: "Declined" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedClaimStatus(st.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors ${
                  selectedClaimStatus === st.id
                    ? "bg-teal-700 text-white font-semibold"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {isLoadingClaims ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredClaims.length === 0 ? (
            <EmptyState
              title="No Medicine Claims Found"
              description="You have not claimed any surplus medicines matching this filter. Browse sealed leftover medicines listed at 50% discount."
              actionLabel="Browse Available Medicines"
              onAction={() => (window.location.href = "/medicine")}
            />
          ) : (
            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm hover:border-slate-300 transition-colors"
                >
                  {/* Top Bar: Title, Status, Pricing */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          Prescription Claim
                        </span>
                        <StatusBadge status={claim.status} variant="status" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{claim.listingTitle}</h3>
                      <p className="text-xs text-slate-500">
                        Claim ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">{claim.id}</code> &bull; Submitted {formatDate(claim.createdAt)}
                      </p>
                    </div>

                    <div className="text-right sm:shrink-0 bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5">
                      <div className="text-xs text-slate-500 font-medium line-through">
                        MRP ₹{claim.mrpPrice || 200}
                      </div>
                      <div className="text-lg font-extrabold text-emerald-800">
                        ₹{claim.offeredPrice || 100}{" "}
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-emerald-600 text-white px-1.5 py-0.2 rounded ml-1">
                          50% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Patient & Doctor Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 rounded-lg p-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Patient Name:</span>
                      <strong className="text-slate-800">{claim.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Prescribing Doctor:</span>
                      <strong className="text-slate-800">
                        {claim.doctorName} {claim.doctorRegNo ? `(Reg: ${claim.doctorRegNo})` : ""}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Uploaded Prescription:</span>
                      <button
                        onClick={() => setPreviewPrescriptionUrl(claim.prescriptionUrl)}
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold hover:underline mt-0.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Prescription</span>
                      </button>
                    </div>
                  </div>

                  {claim.notes && (
                    <p className="text-xs text-slate-600 bg-white border border-slate-100 rounded p-2 italic">
                      &quot;{claim.notes}&quot;
                    </p>
                  )}

                  {/* REAL-TIME TRACKING STATUS PANEL */}
                  {claim.status === "pending_verification" && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-amber-700 shrink-0 mt-0.5 animate-pulse" />
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-amber-950">Awaiting Medical Admin Verification</h4>
                          <p className="text-amber-800">
                            Our compliance officers are verifying your doctor&apos;s registration and drug prescription.
                            As per statutory drug safety protocols, seller contact info is locked until approval.
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-100/90 border border-amber-300 px-2.5 py-1 rounded text-[11px]">
                        🔒 Seller Phone Shielded
                      </span>
                    </div>
                  )}

                  {claim.status === "approved" && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-emerald-950 text-sm">
                            ✅ Prescription Verified & Approved by Admin!
                          </h4>
                          <p className="text-emerald-900 leading-relaxed">
                            Your prescription has been approved by our medical officers. You are cleared to collect
                            the sealed medicine from the verified seller below.
                          </p>
                          {claim.adminNotes && (
                            <p className="text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded border border-emerald-200 font-medium">
                              <strong>Admin Review Note:</strong> {claim.adminNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* UNLOCKED SELLER CONTACT BOX */}
                      <div className="bg-white border border-emerald-200/90 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Verified Seller Pickup Details
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {claim.sellerName || "Verified Community Donor"}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-0.5">
                            <span className="flex items-center gap-1 font-medium text-slate-900">
                              <Phone className="h-3.5 w-3.5 text-emerald-700" />
                              {claim.sellerContact}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-500" />
                              {claim.locality ? `${claim.locality}, ` : ""}{claim.city || "Gorakhpur"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {claim.sellerContact && (
                            <a href={`tel:${claim.sellerContact}`}>
                              <Button variant="primary" size="sm" className="bg-emerald-700 hover:bg-emerald-800 border-emerald-800 gap-1.5 text-xs">
                                <Phone className="h-3.5 w-3.5" />
                                <span>Call Seller</span>
                              </Button>
                            </a>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setClaimCompleteDialog({
                                open: true,
                                claimId: claim.id,
                                title: "Confirm Medicine Received",
                                message: `Have you collected the ${claim.listingTitle} from ${claim.sellerName || "the seller"}? This will complete the exchange.`,
                              })
                            }
                            className="text-xs text-teal-800 hover:text-teal-900 border-teal-200"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            <span>Mark Received</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {claim.status === "completed" && (
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3 text-xs">
                      <CheckCircle className="h-5 w-5 text-sky-700 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sky-950">Medicine Handover Completed</h4>
                        <p className="text-sky-800">
                          You have collected this medicine from {claim.sellerName || "the seller"}. Thank you for
                          preventing medicine wastage!
                        </p>
                      </div>
                    </div>
                  )}

                  {claim.status === "rejected" && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-xs">
                      <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-red-950">Prescription Verification Declined</h4>
                        <p className="text-red-800">
                          <strong>Admin Remarks:</strong>{" "}
                          {claim.adminNotes || "The prescription was invalid, expired, or did not match the requested dosage."}
                        </p>
                        <p className="text-[11px] text-red-700">
                          The medicine listing has been returned to the public pool. Please ensure an active, clear doctor&apos;s prescription is provided when claiming.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BLOOD & ASSISTANCE REQUESTS */}
      {activeTab === "assistance" && (
        <div className="space-y-6">
          {/* Filter Tabs for Assistance Requests */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
            {["all", "submitted", "under_review", "matched", "resolved", "closed"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors ${
                  selectedStatus === st
                    ? "bg-teal-700 text-white font-semibold"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {isLoadingRequests ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              title="No Requests in this Category"
              description="You currently have no assistance requests matching the selected status filter."
              actionLabel="Submit a New Request"
              onAction={() => (window.location.href = "/assistance/request")}
            />
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-none hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-2 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          {req.category}
                        </span>
                        <StatusBadge status={req.priority} variant="priority" />
                        <StatusBadge status={req.status} variant="status" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{req.title}</h3>
                      <p className="text-xs text-slate-500">
                        Location: {req.city}, {req.state} &bull; Submitted {formatDate(req.createdAt)}
                      </p>
                    </div>

                    {/* Status Transition Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {req.status !== "resolved" && req.status !== "closed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              requestId: req.id,
                              targetStatus: "resolved",
                              title: "Mark Request as Resolved",
                              message:
                                "Have you received the required assistance or blood units? Marking resolved will indicate to volunteers that help is no longer urgently required.",
                            })
                          }
                          className="text-xs text-emerald-700 hover:text-emerald-800 border-emerald-200"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Mark Resolved
                        </Button>
                      )}

                      {req.status !== "closed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              requestId: req.id,
                              targetStatus: "closed",
                              title: "Close Assistance Request",
                              message:
                                "Are you sure you want to close this assistance request? It will be archived from public view.",
                            })
                          }
                          className="text-xs text-slate-500 hover:text-red-600"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Close
                        </Button>
                      )}

                      {req.category === "blood" && (
                        <Link href={`/blood/requests/${req.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Page
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prescription Inspection Dialog */}
      {previewPrescriptionUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">Doctor&apos;s Prescription Inspection</h3>
              </div>
              <button
                onClick={() => setPreviewPrescriptionUrl(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-center">
              <div className="p-8 bg-white border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-500">
                <ShieldCheck className="h-10 w-10 text-teal-600" />
                <span className="text-xs font-semibold text-slate-800">
                  Prescription Document On Record
                </span>
                <span className="text-[11px] text-slate-500 break-all px-2 font-mono">
                  {previewPrescriptionUrl}
                </span>
              </div>

              <div className="flex justify-center gap-3">
                <a
                  href={previewPrescriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open In New Tab</span>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewPrescriptionUrl(null)}
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Assistance Requests */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleStatusUpdate}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Yes, Update Status"
        variant={confirmDialog.targetStatus === "closed" ? "danger" : "primary"}
      />

      {/* Confirmation Dialog for Medicine Claims Completed */}
      <ConfirmDialog
        open={claimCompleteDialog.open}
        onClose={() => setClaimCompleteDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleClaimComplete}
        title={claimCompleteDialog.title}
        message={claimCompleteDialog.message}
        confirmLabel="Yes, Mark Received"
        variant="primary"
      />
    </div>
  );
}
