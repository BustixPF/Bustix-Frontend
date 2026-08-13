"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CompanySidebar from "@/components/company-dashboard/CompanySidebar";
import CompanyTopBar from "@/components/company-dashboard/CompanyTopBar";
import CompanyKpiRow from "@/components/company-dashboard/CompanyKpiRow";
import QuickActionsCard from "@/components/company-dashboard/QuickActionsCard";
import UpcomingDeparturesBoard from "@/components/company-dashboard/UpcomingDeparturesBoard";
import RecentBookingsCard from "@/components/company-dashboard/RecentBookingsCard";
import CompanyRoutesCard from "@/components/company-dashboard/CompanyRoutesCard";
import RequireRole from "@/components/auth/RequireRole";
import LoadingScreen from "@/components/LoadingScreen";
import { fetchCompany, type Company } from "@/lib/api";
import { getInitials } from "@/lib/user";
import { useAuth } from "@/components/context/AuthContext";

function CompanyDashboardContent() {
  const { companyId } = useParams<{ companyId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.companyId && user.companyId !== companyId) {
      router.replace(`/empresa/dashboard/${user.companyId}`);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const result = await fetchCompany(companyId);
      if (!cancelled) {
        setCompany(result);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [companyId, user?.companyId, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Empresa no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar
        companyId={companyId}
        company={{
          name: company.name,
          initials: getInitials(company.name),
          status: company.status,
          rejectionReason: company.rejectionReason,
        }}
      />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
        <CompanyTopBar company={{ name: company.name }} />
        <CompanyKpiRow companyId={companyId} />

        <div id="horarios" className="mt-6 scroll-mt-6">
          <UpcomingDeparturesBoard companyId={companyId} />
        </div>

        <div id="rutas" className="mt-6 scroll-mt-6">
          <CompanyRoutesCard companyId={companyId} />
        </div>

        <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[1fr_380px]">
          <div id="reservas" className="min-w-0 scroll-mt-6">
            <RecentBookingsCard companyId={companyId} />
          </div>
          <QuickActionsCard companyId={companyId} />
        </div>
      </main>
    </div>
  );
}

export default function CompanyDashboardPage() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <CompanyDashboardContent />
    </RequireRole>
  );
}
