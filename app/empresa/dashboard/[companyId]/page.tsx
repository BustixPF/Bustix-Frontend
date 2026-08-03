"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CompanySidebar from "@/components/company-dashboard/CompanySidebar";
import CompanyTopBar from "@/components/company-dashboard/CompanyTopBar";
import CompanyKpiRow from "@/components/company-dashboard/CompanyKpiRow";
import UpcomingDeparturesBoard from "@/components/company-dashboard/UpcomingDeparturesBoard";
import CompanyRoutesCard from "@/components/company-dashboard/CompanyRoutesCard";
import RecentBookingsCard from "@/components/company-dashboard/RecentBookingsCard";
import QuickActionsCard from "@/components/company-dashboard/QuickActionsCard";
// import RequireAuth from "@/components/auth/RequiereAuth"; // bloqueo desactivado temporalmente
import LoadingScreen from "@/components/LoadingScreen";
import { fetchCompany, fetchCompanies, type Company } from "@/lib/api";
import { getInitials } from "@/lib/user";

export default function CompanyDashboardPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [effectiveCompanyId, setEffectiveCompanyId] = useState(companyId);
  const [isFallback, setIsFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tripsRefreshKey, setTripsRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      let result = await fetchCompany(companyId);
      let resolvedId = companyId;
      let usedFallback = false;

      if (!result) {
        // Todavía no hay vínculo real entre el usuario admin y una empresa
        // (el backend no lo soporta aún) — mostramos una empresa sembrada
        // como respaldo en vez de dejar el dashboard vacío.
        const seeded = await fetchCompanies();
        if (seeded.length > 0) {
          result = seeded[0];
          resolvedId = seeded[0].id;
          usedFallback = true;
        }
      }

      if (!cancelled) {
        setCompany(result);
        setEffectiveCompanyId(resolvedId);
        setIsFallback(usedFallback);
        setIsLoading(false);
      }
    })();

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
            {isFallback && (
              <div className="mb-4 rounded-lg border border-dashed border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
                Todavía no tienes una empresa propia vinculada a tu cuenta — te mostramos{" "}
                <span className="font-semibold text-card-foreground">{company.name}</span> como ejemplo.
              </div>
            )}
            <CompanyTopBar company={{ name: company.name }} />
            <CompanyKpiRow key={`kpi-${tripsRefreshKey}`} companyId={effectiveCompanyId} />

            <div className="mt-6">
              <UpcomingDeparturesBoard
                key={`departures-${tripsRefreshKey}`}
                companyId={effectiveCompanyId}
              />
            </div>

            <div className="mt-6">
              <CompanyRoutesCard companyId={effectiveCompanyId} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
              <RecentBookingsCard companyId={effectiveCompanyId} />
              <QuickActionsCard
                companyId={effectiveCompanyId}
                onTripCreated={() => setTripsRefreshKey((prev) => prev + 1)}
              />
            </div>
          </main>
        </div>
      )}
    </>
  );
}
