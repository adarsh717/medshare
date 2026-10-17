"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { DonorProfile, AssistanceRequest } from "@/types";
import { formatDate } from "@/lib/utils";

export default function DonorDashboardPage() {
  const { toast } = useToast();
  const [donorProfile, setDonorProfile] = React.useState<DonorProfile | null>(null);
  const [matchedRequests, setMatchedRequests] = React.useState<AssistanceRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  const fetchDonorData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blood/donors");
      const data = await res.json();
      if (data.donors && data.donors.length > 0) {
        setDonorProfile(data.donors[0]);

        // Fetch matched blood requests
        const reqRes = await fetch(
          `/api/blood/requests?bloodGroup=${encodeURIComponent(
            data.donors[0].bloodGroup
          )}&city=${encodeURIComponent(data.donors[0].city)}`
        );
        const reqData = await reqRes.json();
        if (reqData.requests) {
          setMatchedRequests(reqData.requests);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDonorData();
  }, [fetchDonorData]);

  const handleStatusChange = async (newStatus: "available" | "busy" | "temporarily_unavailable") => {
    if (!donorProfile) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/blood/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: donorProfile.donorName || "Voluntary Donor",
          bloodGroup: donorProfile.bloodGroup,
          city: donorProfile.city,
          state: donorProfile.state,
          locality: donorProfile.locality,
          availabilityStatus: newStatus,
          preferredContactMethod: donorProfile.preferredContactMethod,
          eligibilityAcknowledged: true,
          consentToContact: true,
          notes: donorProfile.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");

      setDonorProfile(data.donorProfile);
      toast({
        type: "success",
        title: "Availability Updated",
        description: `Your status has been updated to ${newStatus.replace(/_/g, " ")}.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating status.";
      toast({ type: "error", title: "Error", description: msg });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!donorProfile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Voluntary Donor Profile"
          description="Register your blood group to receive emergency request alerts in your district."
        />
        <EmptyState
          title="No Voluntary Donor Profile Found"
          description="You have not yet registered as a voluntary blood donor. Registration is free, non-remunerated, and your contact numbers remain shielded."
          actionLabel="Register as Blood Donor"
          onAction={() => (window.location.href = "/blood/donate")}
          icon={<Heart className="h-6 w-6 text-red-600" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Voluntary Blood Donor Profile"
        description="Manage your availability status, notification preferences, and review matching urgent patient requests."
        badge={
          <StatusBadge
            status={donorProfile.bloodGroup}
            variant="blood"
            className="text-sm px-2.5 py-0.5"
          />
        }
      />

      {/* Availability Status Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Current Donation Availability</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle your availability. When set to &quot;busy&quot; or &quot;unavailable&quot;, you will not receive urgent notifications.
            </p>
          </div>
          <StatusBadge status={donorProfile.availabilityStatus} variant="status" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={donorProfile.availabilityStatus === "available" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("available")}
            disabled={isUpdatingStatus}
            className="text-xs"
          >
            Available to Donate
          </Button>

          <Button
            variant={donorProfile.availabilityStatus === "busy" ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("busy")}
            disabled={isUpdatingStatus}
            className="text-xs"
          >
            Temporarily Busy
          </Button>

          <Button
            variant={donorProfile.availabilityStatus === "temporarily_unavailable" ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleStatusChange("temporarily_unavailable")}
            disabled={isUpdatingStatus}
            className="text-xs"
          >
            Unavailable
          </Button>
        </div>

        {/* Profile Attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Registered City</span>
            <strong className="text-slate-900 font-semibold mt-0.5 block">
              {donorProfile.city}, {donorProfile.state}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 block">Contact Preference</span>
            <strong className="text-slate-900 font-semibold mt-0.5 block capitalize">
              {donorProfile.preferredContactMethod.replace(/_/g, " ")}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 block">Last Donation</span>
            <strong className="text-slate-900 font-semibold mt-0.5 block">
              {donorProfile.lastDonationDate
                ? formatDate(donorProfile.lastDonationDate)
                : "None recorded"}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 block">Contact Privacy</span>
            <span className="text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Shielded
            </span>
          </div>
        </div>
      </div>

      {/* Matched Urgent Blood Requests in Area */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Matching Blood Requisitions in {donorProfile.city}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Urgent patient requests compatible with blood group {donorProfile.bloodGroup}.
            </p>
          </div>
          <span className="bg-red-50 text-red-800 text-xs px-2.5 py-0.5 rounded font-semibold border border-red-200">
            {matchedRequests.length} Open Request(s)
          </span>
        </div>

        {matchedRequests.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No open blood requests requiring {donorProfile.bloodGroup} in your area currently.
          </p>
        ) : (
          <div className="space-y-3">
            {matchedRequests.map((req) => (
              <div
                key={req.id}
                className="border border-slate-200 rounded p-4 text-xs space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900">{req.title}</h3>
                    <p className="text-slate-500 mt-0.5">
                      {req.bloodDetails?.hospitalName} &bull; Required Date:{" "}
                      {formatDate(req.bloodDetails?.requiredDate || req.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={req.priority} variant="priority" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-600">
                    Units Needed: <strong>{req.bloodDetails?.unitsNeeded}</strong>
                  </span>
                  <Link href={`/blood/requests/${req.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Request & Respond
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
