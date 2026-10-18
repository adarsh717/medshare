import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Heart,
  Clock,
  CheckCircle,
  Building2,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  Bell,
  Pill,
  Percent,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { dataStore } from "@/lib/data/store";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/utils";

export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  // Fetch real user data
  const { requests: myRequests } = await dataStore.getRequests({ userId: user.id, limit: 5 });
  const myClaims = await dataStore.getMedicineClaims(undefined, user.id);
  const notifications = await dataStore.getUserNotifications(user.id);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const donorProfile = await dataStore.getDonorProfileByUserId(user.id);
  const providerProfile = await dataStore.getProviderProfileByUserId(user.id);

  // Calculate real metrics
  const activeRequestsCount = myRequests.filter(
    (r) => r.status !== "resolved" && r.status !== "closed"
  ).length;
  const resolvedRequestsCount = myRequests.filter((r) => r.status === "resolved").length;
  const pendingClaimsCount = myClaims.filter((c) => c.status === "pending_verification").length;
  const approvedClaimsCount = myClaims.filter((c) => c.status === "approved").length;

  return (
    <DashboardLayout currentUser={user} unreadCount={unreadCount}>
      <div className="space-y-6">
        <PageHeader
          title={`Dashboard Overview`}
          description={`Welcome back, ${user.fullName}. Monitor your active healthcare requests, notifications, and voluntary commitments.`}
          badge={<StatusBadge status={user.role} variant="role" />}
        />

        {/* Real Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
            <span className="text-xs text-slate-500 font-medium">My Active Requests</span>
            <div className="text-2xl font-bold text-slate-900">{activeRequestsCount}</div>
            <span className="text-[11px] text-slate-400">Currently in progress</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Medicine Claims</span>
            <div className="text-2xl font-bold text-teal-800">{myClaims.length}</div>
            <Link
              href="/dashboard/requests?tab=claims"
              className="text-[11px] text-teal-700 hover:underline font-medium block"
            >
              {pendingClaimsCount > 0
                ? `${pendingClaimsCount} pending verification &rarr;`
                : approvedClaimsCount > 0
                ? `${approvedClaimsCount} approved & ready &rarr;`
                : "Track claims &rarr;"}
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Resolved Requests</span>
            <div className="text-2xl font-bold text-teal-700">{resolvedRequestsCount}</div>
            <span className="text-[11px] text-slate-400">Successfully assisted</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Unread Notifications</span>
            <div className="text-2xl font-bold text-slate-900">{unreadCount}</div>
            <Link
              href="/dashboard/notifications"
              className="text-[11px] text-teal-700 hover:underline font-medium"
            >
              View in Notification Center &rarr;
            </Link>
          </div>
        </div>

        {/* Provider Verification Banner (If Provider) */}
        {user.role === "provider" && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-teal-700" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">Healthcare Provider Portal</h3>
                <p className="text-xs text-slate-500">
                  Status:{" "}
                  <StatusBadge
                    status={providerProfile?.verificationStatus || "pending"}
                    variant="verification"
                  />
                </p>
              </div>
            </div>
            <Link href="/dashboard/provider">
              <Button variant="outline" size="sm">
                Manage Provider Record
              </Button>
            </Link>
          </div>
        )}

        {/* Voluntary Donor Capsule (If Donor) */}
        {donorProfile && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Voluntary Donor Status: Blood Group {donorProfile.bloodGroup}
                </h3>
                <p className="text-xs text-slate-500">
                  Availability:{" "}
                  <strong className="text-slate-800 capitalize font-semibold">
                    {donorProfile.availabilityStatus.replace(/_/g, " ")}
                  </strong>{" "}
                  in {donorProfile.city}
                </p>
              </div>
            </div>
            <Link href="/dashboard/donor">
              <Button variant="outline" size="sm">
                Update Donor Preferences
              </Button>
            </Link>
          </div>
        )}

        {/* Admin Quick Entry (If Admin) */}
        {user.role === "admin" && (
          <div className="bg-purple-50/60 border border-purple-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-purple-700" />
              <div>
                <h3 className="text-xs font-bold text-purple-950">Administrator Control Center</h3>
                <p className="text-xs text-purple-800">
                  Review pending provider verifications, moderate assistance requests, and audit system logs.
                </p>
              </div>
            </div>
            <Link href="/dashboard/admin">
              <Button variant="primary" size="sm" className="bg-purple-800 hover:bg-purple-900 border-purple-900">
                Open Admin Center
              </Button>
            </Link>
          </div>
        )}

        {/* Recent Submitted Requests */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">My Recent Assistance Requests</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Requests you have submitted for blood, medicine, equipment, or medical support.
              </p>
            </div>
            <Link href="/dashboard/requests">
              <Button variant="ghost" size="sm" className="text-xs text-teal-700">
                <span>View All</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-500">You have not submitted any assistance requests yet.</p>
              <div className="flex justify-center gap-2">
                <Link href="/blood/request">
                  <Button variant="primary" size="sm">
                    Create Blood Request
                  </Button>
                </Link>
                <Link href="/assistance/request">
                  <Button variant="outline" size="sm">
                    Request Support
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myRequests.map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                        {req.category}
                      </span>
                      <StatusBadge status={req.status} variant="status" />
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 truncate">{req.title}</h3>
                    <p className="text-[11px] text-slate-500">
                      {req.city} &bull; Created {formatDate(req.createdAt)}
                    </p>
                  </div>

                  <Link href={req.category === "blood" ? `/blood/requests/${req.id}` : `/dashboard/requests`}>
                    <Button variant="outline" size="sm" className="text-xs shrink-0">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Medicine Claims Section */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-teal-700" />
                <h2 className="text-sm font-bold text-slate-900">My Medicine Claims (50% Off Surplus)</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Surplus medicines claimed with uploaded doctor prescription.
              </p>
            </div>
            <Link href="/dashboard/requests?tab=claims">
              <Button variant="ghost" size="sm" className="text-xs text-teal-700">
                <span>View All & Track</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>

          {myClaims.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-500">
                You have not claimed any surplus medicines yet. Genuine sealed leftover medicines are listed at 50% discount.
              </p>
              <div className="flex justify-center gap-2">
                <Link href="/medicine">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <Percent className="h-3.5 w-3.5" />
                    <span>Browse 50% Off Medicines</span>
                  </Button>
                </Link>
                <Link href="/medicine/list">
                  <Button variant="outline" size="sm">
                    List Leftover Medicine
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myClaims.slice(0, 3).map((claim) => (
                <div key={claim.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                        Prescription Claim
                      </span>
                      <StatusBadge status={claim.status} variant="status" />
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 truncate">{claim.listingTitle}</h3>
                    <p className="text-[11px] text-slate-500">
                      Patient: {claim.patientName} &bull; Claimed on {formatDate(claim.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-emerald-800">₹{claim.offeredPrice}</span>
                      <span className="text-[10px] text-slate-400 block line-through">₹{claim.mrpPrice}</span>
                    </div>
                    <Link href="/dashboard/requests?tab=claims">
                      <Button variant="outline" size="sm" className="text-xs">
                        Track Status
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notifications Snippet */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Recent Notifications</h2>
            <Link
              href="/dashboard/notifications"
              className="text-xs text-teal-700 hover:underline font-semibold"
            >
              Notification Center
            </Link>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">No notifications yet.</p>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded border text-xs space-y-1 transition-colors ${
                    notif.isRead
                      ? "bg-white border-slate-200 text-slate-700"
                      : "bg-teal-50/40 border-teal-200 text-teal-950 font-medium"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900">{notif.title}</strong>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{notif.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
