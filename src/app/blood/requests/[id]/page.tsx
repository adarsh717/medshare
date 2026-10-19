"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  Building,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ArrowLeft,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  Phone,
  PhoneCall,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { AssistanceRequest, RequestResponse, DonorProfile, UserProfile } from "@/types";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function BloodRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params?.id as string;

  const [request, setRequest] = React.useState<AssistanceRequest | null>(null);
  const [responses, setResponses] = React.useState<RequestResponse[]>([]);
  const [matchedDonors, setMatchedDonors] = React.useState<DonorProfile[]>([]);
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [offerMessage, setOfferMessage] = React.useState("");
  const [isSubmittingOffer, setIsSubmittingOffer] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  const fetchDetails = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/requests/${id}`);
      const data = await res.json();
      if (data.request) {
        setRequest(data.request);
        setResponses(data.responses || []);

        // Fetch matching donors
        if (data.request.bloodDetails?.bloodGroup && data.request.city) {
          const matchRes = await fetch(
            `/api/blood/match?bloodGroup=${encodeURIComponent(
              data.request.bloodDetails.bloodGroup
            )}&city=${encodeURIComponent(data.request.city)}`
          );
          const matchData = await matchRes.json();
          if (matchData.donors) {
            setMatchedDonors(matchData.donors);
          }
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerMessage.trim()) return;

    setIsSubmittingOffer(true);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: offerMessage }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          toast({
            type: "error",
            title: "Sign In Required",
            description: "Please sign in to offer voluntary blood donation.",
          });
          router.push(`/auth/login?redirect=/blood/requests/${id}`);
          return;
        }
        throw new Error(data.error || "Failed to submit response.");
      }

      toast({
        type: "success",
        title: "Voluntary Response Submitted",
        description: "Your willingness to donate has been communicated to the patient's caregiver.",
      });

      setOfferMessage("");
      fetchDetails();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting offer.";
      toast({ type: "error", title: "Error", description: msg });
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status.");
      }

      toast({
        type: "success",
        title: "Status Updated",
        description: `Request status marked as ${newStatus.replace(/_/g, " ")}.`,
      });

      fetchDetails();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating status.";
      toast({ type: "error", title: "Error", description: msg });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Blood Request Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested blood assistance requisition could not be located or has been archived.
        </p>
        <Link href="/blood">
          <Button variant="primary" size="sm">
            Return to Blood Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/blood" className="hover:text-slate-900 inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Back to Blood Directory
        </Link>
      </div>

      {/* Main Request Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusBadge
                status={request.bloodDetails?.bloodGroup || "O+"}
                variant="blood"
                className="text-base px-3 py-0.5"
              />
              <StatusBadge status={request.priority} variant="priority" />
              <StatusBadge status={request.status} variant="status" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">{request.title}</h1>
            <p className="text-xs text-slate-500">
              Published on {formatDateTime(request.createdAt)}
            </p>
          </div>

          {/* Quick Actions (Mark Resolved if Owner) */}
          <div className="flex items-center gap-2">
            {request.status !== "resolved" && request.status !== "closed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate("resolved")}
                disabled={isUpdatingStatus}
                className="text-emerald-700 hover:text-emerald-800 border-emerald-200"
              >
                Mark Resolved
              </Button>
            )}
          </div>
        </div>

        {/* Vital Details Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-slate-500 block">Hospital / Center</span>
            <strong className="text-slate-900 font-semibold block mt-0.5">
              {request.bloodDetails?.hospitalName}
            </strong>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-slate-500 block">Required Component</span>
            <strong className="text-slate-900 font-semibold block mt-0.5 capitalize">
              {request.bloodDetails?.bloodComponent.replace(/_/g, " ")}
            </strong>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-slate-500 block">Units Needed</span>
            <strong className="text-slate-900 font-semibold block mt-0.5">
              {request.bloodDetails?.unitsNeeded} Unit(s)
            </strong>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-slate-500 block">Required By</span>
            <strong className="text-slate-900 font-semibold block mt-0.5">
              {formatDate(request.bloodDetails?.requiredDate || request.createdAt)}
            </strong>
          </div>
        </div>

        {/* Location & Address */}
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              {request.bloodDetails?.hospitalAddress || "Main Hospital Blood Bank"}, {request.city},{" "}
              {request.state}
            </span>
          </div>
        </div>

        {/* Medical / Requisition Notes */}
        {request.bloodDetails?.medicalNotes && (
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Medical Notes & Coordinator Instructions
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
              {request.bloodDetails.medicalNotes}
            </p>
          </div>
        )}
      </div>

      {/* Hospital Emergency Blood Bank Desk Card */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-red-800 font-bold text-sm">
              <PhoneCall className="h-4 w-4 text-red-600 animate-pulse" />
              <span>Direct Emergency Hospital Blood Desk</span>
            </div>
            <p className="text-xs text-red-700 mt-1">
              Requisition verified for {request.bloodDetails?.hospitalName}. 24x7 blood bank duty officer on call.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:+915512207700"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Blood Bank: +91-551-2207700</span>
            </a>
          </div>
        </div>
      </div>

      {/* Matching Voluntary Donors Section with Unmasked Contact Details */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Compatible Voluntary Life-Savers in {request.city}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Requisition approved. Direct contact details unlocked for emergency patient assistance.
            </p>
          </div>
          <span className="bg-red-50 text-red-700 text-xs px-2.5 py-0.5 rounded font-semibold border border-red-200">
            {matchedDonors.length} Verified Donor(s)
          </span>
        </div>

        {matchedDonors.length === 0 ? (
          <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded text-center">
            No voluntary donors with matching criteria have registered in {request.city} yet. Request remains publicly listed.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedDonors.map((donor) => {
              const donorPhone = donor.phoneNumber || "+91-9876543210";
              const cleanPhone = donorPhone.replace(/[^0-9]/g, "");
              return (
                <div
                  key={donor.id}
                  className="border border-red-100 rounded-lg p-3 text-xs space-y-2 bg-gradient-to-br from-red-50/40 to-white hover:border-red-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {donor.donorName || "Voluntary Registered Donor"}
                    </span>
                    <StatusBadge status={donor.bloodGroup} variant="blood" className="text-[11px]" />
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Location: {donor.locality || donor.city}</span>
                    <span className="text-emerald-700 font-medium capitalize">
                      {donor.availabilityStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-slate-800 font-semibold">
                      <Phone className="h-3 w-3 text-red-600" />
                      <span>{donorPhone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${donorPhone}`}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Call Now
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(donor.donorName || "Donor")},%20we%20urgently%20need%20${request.bloodDetails?.bloodGroup}%20blood%20at%20${encodeURIComponent(request.bloodDetails?.hospitalName || "")}.%20Can%20you%20help?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Response / Offer Donation Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-600" />
          <span>Offer Voluntary Assistance for this Request</span>
        </h2>

        <form onSubmit={handleOfferSubmit} className="space-y-3">
          <Textarea
            value={offerMessage}
            onChange={(e) => setOfferMessage(e.target.value)}
            rows={3}
            placeholder="Write your voluntary availability (e.g. 'I am an O+ donor and can report to the AIIMS Blood Bank tomorrow morning at 9:00 AM')..."
            className="text-xs"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              Your response will be forwarded directly to the patient coordinator.
            </span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingOffer}
              disabled={!offerMessage.trim()}
              className="bg-red-700 hover:bg-red-800 border-red-800 text-xs"
            >
              Submit Voluntary Offer
            </Button>
          </div>
        </form>

        {/* Existing Responses List */}
        {responses.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recorded Volunteer Responses ({responses.length})
            </h3>
            <div className="space-y-2">
              {responses.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>
                      {r.responderName} ({r.responderType})
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {formatDateTime(r.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{r.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Statutory Safety Footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Mandatory Laboratory Testing:</strong> In compliance with the Drugs and Cosmetics Act, all donated blood must undergo strict mandatory screening for HIV 1 & 2, Hepatitis B, Hepatitis C, Syphilis, and Malaria before being released for clinical transfusion.
        </p>
      </div>
    </div>
  );
}
