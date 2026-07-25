"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatCOP } from "@/data/home";
import type { SeatType } from "@/data/viajes";

const RESERVATION_SECONDS = 600;

export interface SelectedSeatInfo {
  seatKey: string;
  id: string;
  floor: number;
  seatType: SeatType;
  position: "Ventana" | "Pasillo";
}

interface SeatSelectionPanelProps {
  selectedSeats: SelectedSeatInfo[];
  pricePerSeat: number;
  requiredSeats: number;
  onRemoveSeat: (seatKey: string) => void;
  onExpire: () => void;
  onContinue: () => void;
}

const SeatSelectionPanel = ({
  selectedSeats,
  pricePerSeat,
  requiredSeats,
  onRemoveSeat,
  onExpire,
  onContinue,
}: SeatSelectionPanelProps) => {
  const [secondsLeft, setSecondsLeft] = useState(RESERVATION_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft !== 0) return;
    toast.error("Tu selección expiró", {
      description: "Volvé a elegir tus asientos.",
    });
    onExpire();
    setSecondsLeft(RESERVATION_SECONDS);
  }, [secondsLeft, onExpire]);

  const total = pricePerSeat * selectedSeats.length;
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <aside className="h-fit rounded-xl border border-border bg-card p-5">
      <p className="font-mono-label text-xs uppercase text-muted-foreground">Tu selección</p>

      {selectedSeats.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Elegí {requiredSeats} asiento{requiredSeats > 1 ? "s" : ""} en el mapa.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {selectedSeats.map((seat) => (
            <div key={seat.seatKey} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {seat.id}
                </span>
                <div>
                  <p className="text-sm font-bold text-card-foreground">
                    {seat.position} · {seat.seatType}
                  </p>
                  <p className="text-xs text-muted-foreground">Piso {seat.floor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono-label text-sm font-bold text-secondary">
                  {formatCOP(pricePerSeat)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveSeat(seat.seatKey)}
                  aria-label={`Quitar asiento ${seat.id}`}
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
        <span>
          {selectedSeats.length} asiento{selectedSeats.length === 1 ? "" : "s"}
        </span>
        <span>{formatCOP(total)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">Total</span>
        <span className="font-display text-xl text-foreground">{formatCOP(total)}</span>
      </div>

      <button
        type="button"
        disabled={selectedSeats.length !== requiredSeats}
        onClick={onContinue}
        className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary"
      >
        Continuar al pago
      </button>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Tu selección se reserva por {minutes}:{seconds} minutos.
      </p>
    </aside>
  );
};

export default SeatSelectionPanel;
