import CompanySidebar from "@/components/company-dashboard/CompanySidebar";
import CompanyTopBar from "@/components/company-dashboard/CompanyTopBar";
import CompanyKpiRow from "@/components/company-dashboard/CompanyKpiRow";
import UpcomingDeparturesBoard from "@/components/company-dashboard/UpcomingDeparturesBoard";
import RecentBookingsCard from "@/components/company-dashboard/RecentBookingsCard";
import QuickActionsCard from "@/components/company-dashboard/QuickActionsCard";

export default function CompanyDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar />

      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <CompanyTopBar />
        <CompanyKpiRow />

        <div className="mt-6">
          <UpcomingDeparturesBoard />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
          <RecentBookingsCard />
          <QuickActionsCard />
        </div>
      </main>
    </div>
  );
}
