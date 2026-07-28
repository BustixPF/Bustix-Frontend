"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CompanySidebar from "@/components/company-dashboard/CompanySidebar";
import CompanyTopBar from "@/components/company-dashboard/CompanyTopBar";
import CompanyKpiRow from "@/components/company-dashboard/CompanyKpiRow";
import UpcomingDeparturesBoard from "@/components/company-dashboard/UpcomingDeparturesBoard";
import RecentBookingsCard from "@/components/company-dashboard/RecentBookingsCard";
import QuickActionsCard from "@/components/company-dashboard/QuickActionsCard";
// import RequireAuth from "@/components/auth/RequiereAuth"; // bloqueo desactivado temporalmente
import LoadingScreen from "@/components/LoadingScreen";
import { fetchCompany, type Company } from "@/lib/api";
import { getInitials } from "@/lib/user";

export default function CompanyDashboardPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCompany(companyId).then((result) => {
      if (!cancelled) {
        setCompany(result);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [companyId]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : !company ? (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Empresa no encontrada.</p>
        </div>
      ) : (
        <div className="flex min-h-screen bg-background">
          <CompanySidebar company={{ name: company.name, initials: getInitials(company.name) }} />

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
            <CompanyTopBar company={{ name: company.name }} />
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
      )}
    </>
  );
}
