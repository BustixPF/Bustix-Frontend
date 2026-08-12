"use client";
import RequireRole from "@/components/auth/RequireRole";
import SuperAdminSidebar from "@/components/superadmin-dashboard/SuperAdminSidebar";
import SuperAdminTopBar from "@/components/superadmin-dashboard/SuperAdminTopBar";
import MetricsOverview from "@/components/superadmin-dashboard/MetricsOverview";
import CompanyRequestsCard from "@/components/superadmin-dashboard/CompanyRequestsCard";
import RouteRequestsCard from "@/components/superadmin-dashboard/RouteRequestsCard";
import ScheduleRequestsCard from "@/components/superadmin-dashboard/ScheduleRequestsCard";
import UsersManagementCard from "@/components/superadmin-dashboard/UsersManagementCard";
import AssignAdminCard from "@/components/superadmin-dashboard/AssignAdminCard";
import GlobalSalesCard from "@/components/superadmin-dashboard/GlobalSalesCard";
import RefundPaymentCard from "@/components/superadmin-dashboard/RefundPaymentCard";
import SystemHealthCard from "@/components/superadmin-dashboard/SystemHealthCard";
import AuditLogCard from "@/components/superadmin-dashboard/AuditLogCard";

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

        <div className="mt-6">
          <RouteRequestsCard />
        </div>

        <div className="mt-6">
          <ScheduleRequestsCard />
        </div>

        <div className="mt-6">
          <UsersManagementCard />
        </div>

        <div className="mt-6">
          <AssignAdminCard />
        </div>

        <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[1fr_380px]">
          <GlobalSalesCard />
          <RefundPaymentCard />
        </div>

        <div className="mt-6">
          <SystemHealthCard />
        </div>

        <div className="mt-6">
          <AuditLogCard />
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