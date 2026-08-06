import Sidebar from "@/components/client-dashboard/Sidebar";
import DashboardTopBar from "@/components/client-dashboard/DashboardTopBar";
import KpiRow from "@/components/client-dashboard/KpiRow";
import ActiveTicketCard from "@/components/client-dashboard/ActiveTicketCard";
import TripHistoryCard from "@/components/client-dashboard/TripHistoryCard";
import SearchCtaCard from "@/components/client-dashboard/SearchCtaCard";
import ProfileCard from "@/components/client-dashboard/ProfileCard";
import NotificationsCard from "@/components/client-dashboard/NotificationsCard";
import RequireRole from "@/components/auth/RequireRole";

export default function ClientDashboardPage() {
  return (
    <RequireRole allowedRoles={["user", "superAdmin"]}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
          <DashboardTopBar />
          <KpiRow />

          <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[1fr_380px]">
            <div className="flex min-w-0 flex-col gap-6">
              <ActiveTicketCard />
              <TripHistoryCard />
            </div>

            <div className="flex min-w-0 flex-col gap-6">
              <SearchCtaCard />
              <ProfileCard />
              <NotificationsCard />
            </div>
          </div>
        </main>
      </div>
    </RequireRole>
  );
}
