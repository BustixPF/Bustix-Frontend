"use client";
import { useEffect, useState } from "react";
import { fetchAdminMetrics, type AdminMetrics } from "@/lib/api";
import { formatCOP } from "@/data/home";

const MetricsOverview = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const result = await fetchAdminMetrics();
      if (!cancelled) {
        setMetrics(result);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[104px] animate-pulse rounded-2xl border border-border bg-card" />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">No se pudieron cargar las métricas.</p>
      </div>
    );
  }

  const { overview, charts } = metrics;
  const maxMonthlyTotal = Math.max(1, ...charts.salesOverTime.map((point) => point.total));
  const maxRouteTickets = Math.max(1, ...charts.topRoutes.map((route) => route.ticketsSold));

  const cards = [
    { id: "ingresos", label: "Ingresos totales", value: formatCOP(overview.totalIncome) },
    { id: "transacciones", label: "Transacciones pagadas", value: String(overview.totalPaidTransactions) },
    { id: "tickets", label: "Tiquetes vendidos", value: String(overview.totalTicketsSold) },
    { id: "empresas", label: "Empresas activas", value: String(overview.activeCompanies) },
    { id: "usuarios", label: "Usuarios registrados", value: String(overview.totalUsers) },
  ];

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.id} className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">{card.label}</p>
            <p className="mt-3 font-display text-2xl text-card-foreground sm:text-3xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg text-card-foreground">Ventas por mes</h3>
          {charts.salesOverTime.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Todavía no hay ventas registradas.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {charts.salesOverTime.map((point) => (
                <div key={point.date}>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(point.date).toLocaleDateString("es-CO", { month: "short", year: "numeric" })}
                    </span>
                    <span>{formatCOP(point.total)}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(point.total / maxMonthlyTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg text-card-foreground">Top 5 rutas</h3>
          {charts.topRoutes.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Todavía no hay tiquetes vendidos.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {charts.topRoutes.map((route) => (
                <div key={route.route}>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="text-card-foreground">{route.route}</span>
                    <span>{route.ticketsSold} tiquetes</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(route.ticketsSold / maxRouteTickets) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MetricsOverview;
