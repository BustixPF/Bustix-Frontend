"use client";
import { useEffect, useState } from "react";
import { fetchRoutes, fetchTrips } from "@/lib/api";
import { formatTime } from "@/data/viajes";

interface Kpi {
  id: string;
  label: string;
  value: string;
  helper: string;
}

interface CompanyKpiRowProps {
  companyId: string;
}

const CompanyKpiRow = ({ companyId }: CompanyKpiRowProps) => {
  const [kpis, setKpis] = useState<Kpi[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchRoutes(), fetchTrips()]).then(([routes, trips]) => {
      if (cancelled) return;

      const companyRoutes = routes.filter((route) => route.companyId === companyId);
      const now = new Date();
      const nextTrip = trips
        .filter((trip) => trip.companyId === companyId && new Date(trip.departureDate) > now)
        .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())[0];

      setKpis([
        {
          id: "rutas-activas",
          label: "Rutas activas",
          value: String(companyRoutes.length),
          helper: `${companyRoutes.length === 1 ? "ruta operando" : "rutas operando"}`,
        },
        {
          id: "proxima-salida",
          label: "Próxima salida",
          value: nextTrip ? formatTime(new Date(nextTrip.departureDate)) : "—",
          helper: nextTrip ? `${nextTrip.origin} → ${nextTrip.destination}` : "Sin viajes próximos",
        },
      ]);
    });

    return () => {
      cancelled = true;
    };
  }, [companyId]);

  if (!kpis) return null;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
            {kpi.label}
          </p>
          <p className="mt-3 font-display text-2xl text-card-foreground sm:text-3xl">{kpi.value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{kpi.helper}</p>
        </div>
      ))}
    </div>
  );
};

export default CompanyKpiRow;
