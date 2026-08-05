"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMyTickets, type ApiTicket } from "@/lib/api";
import {
  getTripById,
  formatDateLabel,
  seatPositionLabel,
  toLocalDateISO,
  type Trip,
} from "@/data/viajes";

const QrCodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10"
    aria-hidden
  >
    <path d="M4 4h6v6H4z" />
    <path d="M14 4h6v6h-6z" />
    <path d="M4 14h6v6H4z" />
    <path d="M10 14h2v2h-2z" />
    <path d="M14 10h2v2h-2z" />
    <path d="M18 14h2v2h-2z" />
    <path d="M18 18h2v2h-2z" />
  </svg>
);

interface ActiveTicket {
  trip: Trip;
  seatNumber: number | null;
}

const EmptyState = () => (
  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 md:p-8">
    <p className="font-mono-label text-xs uppercase text-muted-foreground">Tiquete activo</p>
    <p className="mt-4 text-sm text-muted-foreground">
      Todavía no tienes ningún tiquete activo.
    </p>
    <Link
      href="/#rutas-populares"
      className="mt-4 inline-flex items-center text-sm font-bold text-accent hover:underline"
    >
      Buscar un viaje →
    </Link>
  </div>
);

// El proximo viaje se calcula a partir del ticket con tripId cuya fecha de
// salida sea la mas cercana en el futuro. Requiere que el backend exponga
// tripId/seatNumber/departureDate en GET /dashboard/user/tickets (todavia
// no lo hace) -- si esos campos vienen undefined, no hay ningun candidato y
// se muestra el estado vacio, sin inventar nada.
const findUpcomingTicket = (tickets: ApiTicket[]): ApiTicket | null => {
  const now = Date.now();
  const upcoming = tickets.filter(
    (ticket): ticket is ApiTicket & { tripId: string; departureDate: string } =>
      Boolean(ticket.tripId && ticket.departureDate) &&
      new Date(ticket.departureDate as string).getTime() > now
  );
  if (upcoming.length === 0) return null;

  return upcoming.sort(
    (a, b) => new Date(a.departureDate!).getTime() - new Date(b.departureDate!).getTime()
  )[0];
};

const ActiveTicketCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState<ActiveTicket | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const tickets = await fetchMyTickets();
      const upcomingTicket = findUpcomingTicket(tickets);

      if (!upcomingTicket?.tripId) {
        if (!cancelled) {
          setActive(null);
          setIsLoading(false);
        }
        return;
      }

      const trip = await getTripById(upcomingTicket.tripId);
      if (!cancelled) {
        setActive(trip ? { trip, seatNumber: upcomingTicket.seatNumber ?? null } : null);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 md:p-8">
        <p className="font-mono-label text-xs uppercase text-muted-foreground">Tiquete activo</p>
        <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  if (!active) {
    return <EmptyState />;
  }

  const { trip, seatNumber } = active;

  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm sm:p-6 md:p-8">
      <div className="flex items-start justify-between">
        <p className="font-mono-label text-xs uppercase text-muted-foreground">Tiquete activo</p>
        <span className="rounded-full bg-secondary/15 px-4 py-1 text-xs font-bold text-secondary">
          CONFIRMADO
        </span>
      </div>

      <h2 className="mt-5 font-display text-xl text-card-foreground sm:text-2xl md:text-3xl">
        {trip.origin} → {trip.destination}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {trip.company}
        {seatNumber != null && ` · Puesto ${seatNumber} (${seatPositionLabel(seatNumber)})`}
      </p>

      <div className="relative mt-8 flex items-center" aria-hidden="true">
        <span className="absolute -left-6 h-4 w-4 rounded-full bg-background sm:-left-8 md:-left-10" />
        <span className="h-0.5 w-full border-t-2 border-dashed border-border" />
        <span className="absolute -right-6 h-4 w-4 rounded-full bg-background sm:-right-8 md:-right-10" />
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-4 sm:gap-8">
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
              Salida
            </p>
            <p className="mt-2 font-display text-lg text-card-foreground">{trip.departureTime}</p>
          </div>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
              Llegada
            </p>
            <p className="mt-2 font-display text-lg text-card-foreground">{trip.arrivalTime}</p>
          </div>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
              Fecha
            </p>
            <p className="mt-2 font-display text-lg text-card-foreground">
              {formatDateLabel(toLocalDateISO(new Date(trip.departureDateISO)))}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
            <QrCodeIcon />
          </div>
          <p className="font-mono-label text-[10px] text-muted-foreground">Código QR</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveTicketCard;
