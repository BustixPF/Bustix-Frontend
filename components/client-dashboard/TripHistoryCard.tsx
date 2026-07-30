"use client";
import { useEffect, useState } from "react";
import { fetchMyTickets, type ApiTicket } from "@/lib/api";
import { formatCOP } from "@/data/home";

const formatPurchaseDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

const TripHistoryCard = () => {
  const [tickets, setTickets] = useState<ApiTicket[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyTickets().then((data) => {
      if (!cancelled) setTickets(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-8">
      <h2 className="font-display text-lg text-card-foreground">Historial de viajes</h2>

      {tickets === null ? (
        <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
      ) : tickets.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no has comprado ningún tiquete.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
                <th className="px-3 pb-1 font-normal">Ruta</th>
                <th className="px-3 pb-1 font-normal">Empresa</th>
                <th className="px-3 pb-1 font-normal">Fecha de compra</th>
                <th className="px-3 pb-1 font-normal">Precio</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="bg-muted">
                  <td className="rounded-l-lg px-3 py-3 font-medium text-card-foreground">
                    {ticket.origin} → {ticket.destination}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{ticket.company?.name ?? "—"}</td>
                  <td className="px-3 py-3 text-muted-foreground">{formatPurchaseDate(ticket.purchaseDate)}</td>
                  <td className="rounded-r-lg px-3 py-3 font-medium text-card-foreground">
                    {formatCOP(Number(ticket.price))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TripHistoryCard;
