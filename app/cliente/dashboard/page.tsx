import Sidebar from "@/components/dashboard/Sidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import KpiRow from "@/components/dashboard/KpiRow";
import ActiveTicketCard from "@/components/dashboard/ActiveTicketCard";
import TripHistoryCard from "@/components/dashboard/TripHistoryCard";
import SearchCtaCard from "@/components/dashboard/SearchCtaCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import NotificationsCard from "@/components/dashboard/NotificationsCard";

export default function ClientDashboardPage() {
  return (
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
  );
}
