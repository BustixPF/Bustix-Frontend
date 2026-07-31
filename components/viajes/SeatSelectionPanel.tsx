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
        <p className="mt-4 text-sm text-muted-foreground">
          {maxSelectable
            ? `Selecciona ${maxSelectable} asientos en el mapa.`
            : "Elige un asiento en el mapa."}
        </p>
      ) : selectedSeats.length < (maxSelectable ?? 1) ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Seleccionaste {selectedSeats.length}/{maxSelectable} asientos.
        </p>
      ) : (
        <p className="mt-4 text-sm font-bold text-foreground">
          Seleccionaste todos los asientos requeridos.
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
        <span>Total ({selectedSeats.length}{maxSelectable ? ` / ${maxSelectable}` : ""}):</span>
        <span className="font-display text-xl text-foreground">{formatCOP(total)}</span>
      </div>

      <button
        type="button"
        disabled={selectedSeats.length === 0 || (maxSelectable ? selectedSeats.length !== maxSelectable : false)}
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