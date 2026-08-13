"use client";
import useSWR from "swr";
import { fetchMyTickets, type ApiTicket } from "@/lib/api";
import { SWR_KEYS } from "@/lib/swrKeys";
import { formatCOP } from "@/data/home";

interface Kpi {
  id: string;
  label: string;
  value: string;
  helper: string;
}

const buildKpis = (tickets: ApiTicket[]): Kpi[] => {
  if (tickets.length === 0) {
    const helper = "Aún no has comprado tiquetes";
    return [
      { id: "tiquetes-comprados", label: "Tiquetes comprados", value: "0", helper },
      { id: "total-gastado", label: "Total gastado", value: "—", helper },
      { id: "ruta-favorita", label: "Ruta favorita", value: "—", helper },
    ];
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
  const { data: tickets } = useSWR(SWR_KEYS.myTickets, fetchMyTickets);

  if (!tickets) return null;
  const kpis = buildKpis(tickets);

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
