"use client";
import { useEffect, useState } from "react";
import { fetchMyTickets, type ApiTicket } from "@/lib/api";

const MAX_NOTIFICATIONS = 3;

const formatPurchaseDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

const NotificationsCard = () => {
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

  // Sin backend de notificaciones reales, mostramos las compras confirmadas
  // más recientes en vez de inventar alertas que nunca cambian.
  const recentTickets = [...(tickets ?? [])]
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, MAX_NOTIFICATIONS);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <h3 className="font-display text-base text-card-foreground">Notificaciones</h3>

      {tickets === null ? (
        <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
      ) : recentTickets.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Aún no tienes notificaciones.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {recentTickets.map((ticket) => (
            <li key={ticket.id} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-semibold text-card-foreground">Pago confirmado</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {ticket.origin} → {ticket.destination} · {formatPurchaseDate(ticket.purchaseDate)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsCard;
