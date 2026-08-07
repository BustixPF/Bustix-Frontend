"use client";
import RequireRole from "@/components/auth/RequireRole";
import SuperAdminSidebar from "@/components/superadmin-dashboard/SuperAdminSidebar";
import SuperAdminTopBar from "@/components/superadmin-dashboard/SuperAdminTopBar";
import MetricsOverview from "@/components/superadmin-dashboard/MetricsOverview";
import CompanyRequestsCard from "@/components/superadmin-dashboard/CompanyRequestsCard";

function SuperAdminDashboardContent() {
  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
        <SuperAdminTopBar />
        <MetricsOverview />

        <div className="mt-6">
          <CompanyRequestsCard />
        </div>
      </main>
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  return (
    <RequireRole allowedRoles={["superAdmin"]}>
      <SuperAdminDashboardContent />
    </RequireRole>
  );
}
