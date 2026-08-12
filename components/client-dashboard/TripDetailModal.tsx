"use client";
import { QRCodeSVG } from "qrcode.react";
import { formatCOP } from "@/data/home";
import { formatDateLabel, formatTime, seatPositionLabel, toLocalDateISO } from "@/data/viajes";
import type { TripGroup } from "@/components/client-dashboard/TripHistoryCard";

interface TripDetailModalProps {
  trip: TripGroup | null;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const STATUS_LABEL: Record<TripGroup["status"], string> = {
  completado: "Completado",
  proximo: "Próximo",
  "sin-datos": "—",
};

const TripDetailModal = ({ trip, onClose }: TripDetailModalProps) => {
  if (!trip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-label text-xs uppercase text-muted-foreground">Detalle del viaje</p>
            <h2 className="mt-2 font-display text-xl text-card-foreground">
              {trip.origin} → {trip.destination}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{trip.company}</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Fecha de viaje</p>
            <p className="mt-1.5 text-sm font-semibold text-card-foreground">
              {trip.departureDate
                ? formatDateLabel(toLocalDateISO(new Date(trip.departureDate)))
                : "Sin datos"}
            </p>
          </div>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Hora</p>
            <p className="mt-1.5 text-sm font-semibold text-card-foreground">
              {trip.departureDate ? formatTime(new Date(trip.departureDate)) : "—"}
            </p>
          </div>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Estado</p>
            <p className="mt-1.5 text-sm font-semibold text-card-foreground">{STATUS_LABEL[trip.status]}</p>
          </div>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Pasajeros</p>
            <p className="mt-1.5 text-sm font-semibold text-card-foreground">{trip.ticketCount}</p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Asientos</p>
          <p className="mt-1.5 text-sm font-semibold text-card-foreground">
            {trip.seatNumbers.length > 0
              ? trip.seatNumbers
                  .map((seat) => `Puesto ${seat} (${seatPositionLabel(seat)})`)
                  .join(", ")
              : "Sin datos"}
          </p>
        </div>

        <div className="mt-5 flex flex-col items-center border-t border-border pt-5">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-white p-2">
            <QRCodeSVG value={trip.key} size={112} bgColor="#ffffff" fgColor="#000000" level="M" />
          </div>
          <p className="font-mono-label mt-2 text-[10px] text-muted-foreground">Código QR del viaje</p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
          <p className="text-sm text-muted-foreground">Total pagado</p>
          <p className="font-display text-xl text-card-foreground">{formatCOP(trip.totalPrice)}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full border border-border py-3 text-sm font-semibold text-card-foreground transition-colors hover:border-primary"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TripDetailModal;
