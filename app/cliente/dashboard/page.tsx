import Sidebar from "@/components/client-dashboard/Sidebar";
import DashboardTopBar from "@/components/client-dashboard/DashboardTopBar";
import KpiRow from "@/components/client-dashboard/KpiRow";
import ActiveTicketCard from "@/components/client-dashboard/ActiveTicketCard";
import TripHistoryCard from "@/components/client-dashboard/TripHistoryCard";
import SearchCtaCard from "@/components/client-dashboard/SearchCtaCard";
import ProfileCard from "@/components/client-dashboard/ProfileCard";
import NotificationsCard from "@/components/client-dashboard/NotificationsCard";
import RequireAuth from "@/components/auth/RequiereAuth";

export default function ClientDashboardPage() {
  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <DashboardTopBar />
          <KpiRow />

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-6">
              <ActiveTicketCard />
              <TripHistoryCard />
            </div>

            <div className="flex flex-col gap-6">
              <SearchCtaCard />
              <ProfileCard />
              <NotificationsCard />
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
