"use client";
import { useState } from "react";
import type { ManualTripStatus } from "@/lib/api";
import { TRIP_STATUS_LABEL } from "@/lib/tripStatus";

const OPTIONS: ManualTripStatus[] = ["RETRASADO", "CANCELADO", "REPROGRAMADO"];

interface TripStatusModalProps {
  tripRoute: string;
  isSubmitting: boolean;
  onConfirm: (status: ManualTripStatus, newDepartureDate?: string) => void;
  onClose: () => void;
}

const TripStatusModal = ({ tripRoute, isSubmitting, onConfirm, onClose }: TripStatusModalProps) => {
  const [status, setStatus] = useState<ManualTripStatus>("RETRASADO");
  const [newDepartureDate, setNewDepartureDate] = useState("");

  const needsNewDate = status === "REPROGRAMADO";
  const canConfirm = !needsNewDate || newDepartureDate.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-card-foreground">Cambiar estado del viaje</h3>
        <p className="mt-1 text-sm text-muted-foreground">{tripRoute}</p>

        <label className="mt-4 block">
          <span className="font-mono-label text-xs uppercase text-muted-foreground">
            Nuevo estado
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ManualTripStatus)}
            className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
          >
            {OPTIONS.map((option) => (
              <option key={option} value={option}>
                {TRIP_STATUS_LABEL[option]}
              </option>
            ))}
          </select>
        </label>

        {needsNewDate && (
          <label className="mt-4 block">
            <span className="font-mono-label text-xs uppercase text-muted-foreground">
              Nueva fecha y hora de salida
            </span>
            <input
              type="datetime-local"
              value={newDepartureDate}
              onChange={(e) => setNewDepartureDate(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
            />
          </label>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground transition-colors hover:border-primary disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() =>
              onConfirm(status, needsNewDate ? new Date(newDepartureDate).toISOString() : undefined)
            }
            disabled={isSubmitting || !canConfirm}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripStatusModal;
