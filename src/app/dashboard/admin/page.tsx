import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { dataStore } from "@/lib/data/store";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminControlCenter } from "./AdminControlCenter";

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Strict server-side authorization check: Admin only
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch real data across all modules
  const { requests: allRequests, total: totalRequests } = await dataStore.getRequests({ limit: 150 });
  const { requests: bloodRequests, total: totalBloodRequests } = await dataStore.getBloodRequests({ limit: 150 });
  const donors = await dataStore.getVoluntaryDonors();
  const { resources, total: totalResources } = await dataStore.getResources({ limit: 150 });
  const submissions = await dataStore.getVerificationSubmissions();
  const claims = await dataStore.getMedicineClaims();
  const organPledges = await dataStore.getOrganPledges();
  const auditLogs = await dataStore.getAuditLogs(100);

  const approvedRequests = allRequests.filter(
    (r) => r.status === "approved" || r.status === "matched" || r.status === "resolved"
  ).length;
  const pendingRequests = allRequests.filter(
    (r) => r.status === "submitted" || r.status === "under_review"
  ).length;
  const resolvedRequests = allRequests.filter(
    (r) => r.status === "resolved" || r.status === "closed"
  ).length;

  const totalClaims = claims.length;
  const approvedClaims = claims.filter(
    (c) => c.status === "approved" || c.status === "completed"
  ).length;
  const pendingClaims = claims.filter(
    (c) => c.status === "pending_verification"
  ).length;

  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;

  return (
    <DashboardLayout currentUser={user} unreadCount={0}>
      <AdminControlCenter
        stats={{
          totalRequests,
          approvedRequests,
          pendingRequests,
          resolvedRequests,
          totalBloodRequests,
          totalClaims,
          approvedClaims,
          pendingClaims,
          totalDonors: donors.length,
          totalResources,
          totalOrganPledges: organPledges.length,
          pendingSubmissions,
        }}
        initialSubmissions={submissions}
        initialClaims={claims}
        initialRequests={allRequests}
        initialDonors={donors}
        initialResources={resources}
        initialOrganPledges={organPledges}
        initialLogs={auditLogs}
      />
    </DashboardLayout>
  );
}
