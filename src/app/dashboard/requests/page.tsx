"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { useToast } from "@/components/ui/toast";
import { AssistanceRequest, RequestStatus } from "@/types";
import { formatDate } from "@/lib/utils";

export default function MyRequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = React.useState<AssistanceRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

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

  const fetchMyRequests = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

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

  const filtered = requests.filter(
    (r) => selectedStatus === "all" || r.status === selectedStatus
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assistance Requests"
        description="Track the status of your submitted assistance requests and mark them resolved once supported."
        action={
          <div className="flex items-center gap-2">
            <Link href="/blood/request">
              <Button variant="primary" size="sm" className="gap-1.5 bg-red-700 hover:bg-red-800 border-red-800">
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

      {/* Filter Tabs */}
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

      {isLoading ? (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Requests in this Category"
          description="You currently have no assistance requests matching the selected status filter."
          actionLabel="Submit a New Request"
          onAction={() => (window.location.href = "/assistance/request")}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleStatusUpdate}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Yes, Update Status"
        variant={confirmDialog.targetStatus === "closed" ? "danger" : "primary"}
      />
    </div>
  );
}
