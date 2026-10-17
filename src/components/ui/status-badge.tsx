import * as React from "react";
import { cn } from "@/lib/utils";
import { RequestPriority, RequestStatus, ProviderVerificationStatus, UserRole } from "@/types";

interface StatusBadgeProps {
  status: RequestStatus | RequestPriority | ProviderVerificationStatus | UserRole | string;
  variant?: "status" | "priority" | "verification" | "role" | "blood";
  className?: string;
}

export function StatusBadge({ status, variant = "status", className }: StatusBadgeProps) {
  let label = status.replace(/_/g, " ");
  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (variant === "priority" || status === "urgent" || status === "critical") {
    switch (status) {
      case "critical":
        colorClasses = "bg-red-50 text-red-700 border-red-200 font-semibold";
        label = "Critical Urgency";
        break;
      case "urgent":
        colorClasses = "bg-amber-50 text-amber-700 border-amber-200 font-semibold";
        label = "Urgent";
        break;
      case "standard":
      default:
        colorClasses = "bg-slate-50 text-slate-700 border-slate-200";
        label = "Standard Priority";
        break;
    }
  } else if (variant === "verification") {
    switch (status) {
      case "verified":
        colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
        label = "Verified Provider";
        break;
      case "pending":
        colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
        label = "Verification Pending";
        break;
      case "rejected":
        colorClasses = "bg-red-50 text-red-700 border-red-200";
        label = "Verification Declined";
        break;
    }
  } else if (variant === "role") {
    switch (status) {
      case "admin":
        colorClasses = "bg-purple-50 text-purple-700 border-purple-200 font-medium";
        label = "Administrator";
        break;
      case "provider":
        colorClasses = "bg-sky-50 text-sky-700 border-sky-200 font-medium";
        label = "Healthcare Provider";
        break;
      case "donor":
        colorClasses = "bg-red-50 text-red-700 border-red-200 font-medium";
        label = "Voluntary Donor";
        break;
      case "volunteer":
        colorClasses = "bg-teal-50 text-teal-700 border-teal-200 font-medium";
        label = "Volunteer";
        break;
      default:
        colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
        label = "Patient / Caregiver";
        break;
    }
  } else if (variant === "blood") {
    colorClasses = "bg-red-50 text-red-800 border-red-200 font-semibold";
    label = status;
  } else {
    // Request status
    switch (status) {
      case "submitted":
        colorClasses = "bg-blue-50 text-blue-700 border-blue-200";
        label = "Submitted";
        break;
      case "under_review":
        colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
        label = "Under Review";
        break;
      case "additional_info_required":
        colorClasses = "bg-orange-50 text-orange-700 border-orange-200";
        label = "Info Required";
        break;
      case "matched":
        colorClasses = "bg-teal-50 text-teal-700 border-teal-200 font-medium";
        label = "Matched";
        break;
      case "resolved":
        colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium";
        label = "Resolved";
        break;
      case "closed":
        colorClasses = "bg-slate-100 text-slate-600 border-slate-200";
        label = "Closed";
        break;
      case "available":
        colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
        label = "Available to Donate";
        break;
      case "busy":
        colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
        label = "Temporarily Busy";
        break;
      case "temporarily_unavailable":
        colorClasses = "bg-slate-100 text-slate-600 border-slate-200";
        label = "Unavailable";
        break;
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs border tracking-tight capitalize",
        colorClasses,
        className
      )}
    >
      {label}
    </span>
  );
}
