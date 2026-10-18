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

  // Fetch real data
  const { total: totalRequests } = await dataStore.getRequests({ limit: 1 });
  const { total: totalBloodRequests } = await dataStore.getBloodRequests({ limit: 1 });
  const donors = await dataStore.getVoluntaryDonors();
  const { total: totalResources } = await dataStore.getResources({ limit: 1 });
  const submissions = await dataStore.getVerificationSubmissions();
  const claims = await dataStore.getMedicineClaims();
  const auditLogs = await dataStore.getAuditLogs(100);
  const { requests: moderationRequests } = await dataStore.getRequests({ limit: 50 });

  const pendingClaims = claims.filter((c) => c.status === "pending_verification").length;
  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;

  return (
    <DashboardLayout currentUser={user} unreadCount={0}>
      <AdminControlCenter
        stats={{
          totalRequests,
          totalBloodRequests,
          totalDonors: donors.length,
          totalResources,
          pendingSubmissions,
          pendingClaims,
        }}
        initialSubmissions={submissions}
        initialClaims={claims}
        initialRequests={moderationRequests}
        initialLogs={auditLogs}
      />
    </DashboardLayout>
  );
}
