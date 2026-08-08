"use client";
import { useEffect, useState } from "react";
import { fetchMyTickets, type ApiTicket } from "@/lib/api";
import { formatCOP } from "@/data/home";
import TripDetailModal from "@/components/client-dashboard/TripDetailModal";

type TripStatus = "completado" | "proximo" | "sin-datos";

export interface TripGroup {
  key: string;
  origin: string;
  destination: string;
  company: string;
  departureDate: string | null;
  purchaseDate: string;
  status: TripStatus;
  seatNumbers: number[];
  totalPrice: number;
  ticketCount: number;
}

const STATUS_LABEL: Record<TripStatus, string> = {
  completado: "Completado",
  proximo: "Próximo",
  "sin-datos": "—",
};

const STATUS_CLASSES: Record<TripStatus, string> = {
  completado: "bg-muted text-muted-foreground",
  proximo: "bg-secondary/15 text-secondary",
  "sin-datos": "bg-muted text-muted-foreground",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

// El estado se calcula a partir de la fecha del Trip vinculado al ticket
// (tripId/departureDate), no de la fecha de compra — un tiquete comprado hoy
// para un viaje del mes que viene no está "completado" todavía. Si el
// ticket no tiene trip vinculado (compras viejas antes de ese fix de
// backend), se muestra "—" en vez de inventar un estado.
const getTripStatus = (departureDate: string | null): TripStatus => {
  if (!departureDate) return "sin-datos";
  return new Date(departureDate).getTime() <= Date.now() ? "completado" : "proximo";
};

// Una compra de N asientos para el mismo viaje crea N tickets separados en
// el backend (uno por asiento) — se agrupan acá por tripId para mostrar una
// sola fila por viaje comprado en vez de una fila por asiento. Los tickets
// sin tripId (compras viejas, antes del vínculo Ticket->Trip) no se pueden
// agrupar de forma confiable, así que cada uno queda como su propia fila.
const buildTripGroups = (tickets: ApiTicket[]): TripGroup[] => {
  const groups = new Map<string, ApiTicket[]>();
  for (const ticket of tickets) {
    const key = ticket.tripId ?? `ticket-${ticket.id}`;
    const group = groups.get(key) ?? [];
    group.push(ticket);
    groups.set(key, group);
  }

  return Array.from(groups.values())
    .map((group) => {
      const first = group[0];
      const seatNumbers = group
        .map((ticket) => ticket.seatNumber)
        .filter((seat): seat is number => seat != null)
        .sort((a, b) => a - b);

      return {
        key: first.tripId ?? `ticket-${first.id}`,
        origin: first.origin,
        destination: first.destination,
        company: first.company?.name ?? "—",
        departureDate: first.departureDate ?? null,
        purchaseDate: group.reduce(
          (earliest, ticket) => (ticket.purchaseDate < earliest ? ticket.purchaseDate : earliest),
          first.purchaseDate
        ),
        status: getTripStatus(first.departureDate ?? null),
        seatNumbers,
        totalPrice: group.reduce((sum, ticket) => sum + Number(ticket.price), 0),
        ticketCount: group.length,
      };
    })
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
};

const TripHistoryCard = () => {
  const [tickets, setTickets] = useState<ApiTicket[] | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<TripGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyTickets().then((data) => {
      if (!cancelled) setTickets(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const tripGroups = tickets ? buildTripGroups(tickets) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-8">
      <h2 className="font-display text-lg text-card-foreground">Historial de viajes</h2>

      {tripGroups === null ? (
        <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
      ) : tripGroups.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no has comprado ningún tiquete.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
                <th className="px-3 pb-1 font-normal">Ruta</th>
                <th className="px-3 pb-1 font-normal">Empresa</th>
                <th className="px-3 pb-1 font-normal">Fecha de viaje</th>
                <th className="px-3 pb-1 font-normal">Estado</th>
                <th className="px-3 pb-1 font-normal">Precio</th>
                <th className="px-3 pb-1 font-normal" />
              </tr>
            </thead>
            <tbody>
              {tripGroups.map((trip) => (
                <tr key={trip.key} className="bg-muted">
                  <td className="rounded-l-lg px-3 py-3 font-medium text-card-foreground">
                    {trip.origin} → {trip.destination}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{trip.company}</td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {trip.departureDate ? formatDate(trip.departureDate) : "—"}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASSES[trip.status]}`}
                    >
                      {STATUS_LABEL[trip.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-medium text-card-foreground">{formatCOP(trip.totalPrice)}</td>
                  <td className="rounded-r-lg px-3 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedTrip(trip)}
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      Ver info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
    </div>
  );
};

export default TripHistoryCard;
