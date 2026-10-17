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
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  ProviderVerificationSubmission,
  AssistanceRequest,
  AuditLog,
  RequestStatus,
} from "@/types";
import { formatDateTime } from "@/lib/utils";

interface AdminProps {
  stats: {
    totalRequests: number;
    totalBloodRequests: number;
    totalDonors: number;
    totalResources: number;
    pendingSubmissions: number;
  };
  initialSubmissions: ProviderVerificationSubmission[];
  initialRequests: AssistanceRequest[];
  initialLogs: AuditLog[];
}

export function AdminControlCenter({
  stats,
  initialSubmissions,
  initialRequests,
  initialLogs,
}: AdminProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<"submissions" | "moderation" | "logs">("submissions");
  const [submissions, setSubmissions] = React.useState(initialSubmissions);
  const [requests, setRequests] = React.useState(initialRequests);
  const [logs, setLogs] = React.useState(initialLogs);

  // Review Dialog State
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrator Moderation & Control Center"
        description="Verify healthcare provider licenses, moderate assistance requests, and audit security actions."
        badge={
          <span className="bg-purple-50 text-purple-800 text-xs px-2.5 py-0.5 rounded border border-purple-200 font-bold inline-flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            Restricted Admin Privilege
          </span>
        }
      />

      {/* Operational Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded p-3 text-xs space-y-0.5">
          <span className="text-slate-500 font-medium">Total Requests</span>
          <div className="text-xl font-bold text-slate-900">{stats.totalRequests}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3 text-xs space-y-0.5">
          <span className="text-slate-500 font-medium">Blood Needs</span>
          <div className="text-xl font-bold text-red-700">{stats.totalBloodRequests}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3 text-xs space-y-0.5">
          <span className="text-slate-500 font-medium">Registered Donors</span>
          <div className="text-xl font-bold text-slate-900">{stats.totalDonors}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3 text-xs space-y-0.5">
          <span className="text-slate-500 font-medium">Verified Centers</span>
          <div className="text-xl font-bold text-teal-700">{stats.totalResources}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3 text-xs space-y-0.5">
          <span className="text-slate-500 font-medium">Pending Approvals</span>
          <div className="text-xl font-bold text-amber-700">{stats.pendingSubmissions}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "submissions"
              ? "border-teal-700 text-teal-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Provider Verifications ({submissions.filter((s) => s.status === "pending").length} Pending)
        </button>

        <button
          onClick={() => setActiveTab("moderation")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "moderation"
              ? "border-teal-700 text-teal-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Request Moderation ({requests.length})
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "logs"
              ? "border-teal-700 text-teal-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Security Audit Trail ({logs.length})
        </button>
      </div>

      {/* TAB 1: Provider Verifications */}
      {activeTab === "submissions" && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Provider Clinical Establishment Submissions
          </h2>

          {submissions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No verification submissions queued.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="border border-slate-200 rounded-lg p-4 text-xs space-y-3 bg-slate-50/40"
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
                          className="text-xs bg-emerald-700 hover:bg-emerald-800 border-emerald-800"
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

      {/* TAB 2: Request Moderation */}
      {activeTab === "moderation" && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Assistance Request Moderation Queue
          </h2>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Title & Requisition</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Current Status</th>
                  <th className="py-2.5 px-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 max-w-xs truncate font-medium text-slate-900">
                      {r.title}
                    </td>
                    <td className="py-3 px-3 capitalize">{r.category}</td>
                    <td className="py-3 px-3">{r.city}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={r.status} variant="status" />
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleQuickStatusChange(r.id, e.target.value as RequestStatus)
                        }
                        className="h-7 px-2 border border-slate-300 rounded text-xs bg-white text-slate-800"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="matched">Matched</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Security Audit Trail */}
      {activeTab === "logs" && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">System Security Audit Log</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Immutable records of user registrations, logins, status modifications, and admin actions.
              </p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[160px]">
                      {log.userEmail || log.userId || "System"}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{log.entityType}</td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[120px]">
                      {log.entityId || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Dialog */}
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
    </div>
  );
}
