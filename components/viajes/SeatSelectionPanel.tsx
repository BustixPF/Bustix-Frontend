"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatCOP } from "@/data/home";

const SELECTION_SECONDS = 600;

export interface SelectedSeatInfo {
  seatNumber: number;
  position: "Ventana" | "Pasillo";
}

interface SeatSelectionPanelProps {
  selectedSeats: SelectedSeatInfo[];
  pricePerSeat: number;
  onRemoveSeat: (seatNumber: number) => void;
  onExpire: () => void;
  onContinue: () => void;
  maxSelectable?: number;
}

const SeatSelectionPanel = ({
  selectedSeats,
  pricePerSeat,
  onRemoveSeat,
  onExpire,
  onContinue,
  maxSelectable,
}: SeatSelectionPanelProps) => {
  const [secondsLeft, setSecondsLeft] = useState(SELECTION_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft !== 0) return;
    toast.error("Tu selección expiró", {
      description: "Volvé a elegir tu asiento.",
    });
    onExpire();
    setSecondsLeft(SELECTION_SECONDS);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const total = selectedSeats.length * pricePerSeat;

  return (
    <aside className="h-fit rounded-xl border border-border bg-card p-5">
      <p className="font-mono-label text-xs uppercase text-muted-foreground">Tu selección</p>
      {selectedSeats.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Elegí {maxSelectable ? `hasta ${maxSelectable} ` : "un " }asiento en el mapa.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {selectedSeats.map((s) => (
            <div key={s.seatNumber} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {s.seatNumber}
                </span>
                <p className="text-sm font-bold text-card-foreground">{s.position}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono-label text-sm font-bold text-secondary">
                  {formatCOP(pricePerSeat)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveSeat(s.seatNumber)}
                  aria-label={`Quitar asiento ${s.seatNumber}`}
                  className="text-destructive hover:opacity-80"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
        <span>Total ({selectedSeats.length}):</span>
        <span className="font-display text-xl text-foreground">{formatCOP(total)}</span>
      </div>

      <button
        type="button"
        disabled={selectedSeats.length === 0}
        onClick={onContinue}
        className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary"
      >
        Continuar al pago
      </button>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Tienes {minutes}:{seconds} minutos para completar la compra antes de que se te pida elegir de nuevo.
      </p>
    </aside>
  );
};

export default SeatSelectionPanel;