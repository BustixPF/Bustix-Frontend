"use client";
import { useEffect, useState } from "react";
import { fetchMyTickets, type ApiTicket } from "@/lib/api";
import { formatCOP } from "@/data/home";

interface Kpi {
  id: string;
  label: string;
  value: string;
  helper: string;
}

const buildKpis = (tickets: ApiTicket[]): Kpi[] => {
  if (tickets.length === 0) {
    return [{ id: "sin-tiquetes", label: "Tiquetes comprados", value: "0", helper: "Aún no has comprado tiquetes" }];
  }

  const totalSpent = tickets.reduce((sum, ticket) => sum + Number(ticket.price), 0);

  const routeCounts = new Map<string, number>();
  for (const ticket of tickets) {
    const key = `${ticket.origin} → ${ticket.destination}`;
    routeCounts.set(key, (routeCounts.get(key) ?? 0) + 1);
  }
  const favoriteRoute = [...routeCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  return [
    { id: "tiquetes-comprados", label: "Tiquetes comprados", value: String(tickets.length), helper: "Total de tiquetes comprados" },
    { id: "total-gastado", label: "Total gastado", value: formatCOP(totalSpent), helper: "Suma de todas tus compras" },
    { id: "ruta-favorita", label: "Ruta favorita", value: favoriteRoute[0], helper: `${favoriteRoute[1]} viaje${favoriteRoute[1] > 1 ? "s" : ""}` },
  ];
};

const KpiRow = () => {
  const [kpis, setKpis] = useState<Kpi[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyTickets().then((tickets) => {
      if (!cancelled) setKpis(buildKpis(tickets));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!kpis) return null;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

export default KpiRow;
