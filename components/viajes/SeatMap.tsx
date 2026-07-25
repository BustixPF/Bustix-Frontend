import type { SeatFloor } from "@/data/viajes";

interface SeatMapProps {
  floor: SeatFloor;
  selectedSeats: string[];
  onToggleSeat: (seatKey: string) => void;
}

const LEGEND = [
  { label: "Disponible", className: "border border-border bg-card" },
  { label: "Seleccionado", className: "border border-primary bg-primary" },
  { label: "Ocupado", className: "border border-border bg-muted" },
] as const;

const SeatMap = ({ floor, selectedSeats, onToggleSeat }: SeatMapProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`h-4 w-4 rounded ${item.className}`} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-1 text-xs text-muted-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
          −
        </span>
        <span className="font-mono-label text-[10.5px] uppercase">Frente del bus</span>
      </div>

      <div className="mt-6 w-full overflow-x-auto">
        <div className="flex w-fit flex-col gap-3 sm:gap-4">
          {floor.rows.map((row) => {
            const half = Math.ceil(row.seats.length / 2);
            const leftSeats = row.seats.slice(0, half);
            const rightSeats = row.seats.slice(half);

            return (
              <div key={row.row} className="flex items-center gap-3 sm:gap-6">
                <span className="w-10 font-mono-label text-[10.5px] uppercase text-muted-foreground sm:w-14">
                  Fila {row.row}
                </span>
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="flex gap-2">
                    {leftSeats.map((seat) => {
                      const seatKey = `${floor.floor}-${seat.id}`;
                      return (
                        <SeatButton
                          key={seat.id}
                          seatId={seat.id}
                          status={seat.status}
                          isSelected={selectedSeats.includes(seatKey)}
                          onToggle={() => onToggleSeat(seatKey)}
                        />
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    {rightSeats.map((seat) => {
                      const seatKey = `${floor.floor}-${seat.id}`;
                      return (
                        <SeatButton
                          key={seat.id}
                          seatId={seat.id}
                          status={seat.status}
                          isSelected={selectedSeats.includes(seatKey)}
                          onToggle={() => onToggleSeat(seatKey)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface SeatButtonProps {
  seatId: string;
  status: "disponible" | "ocupado";
  isSelected: boolean;
  onToggle: () => void;
}

const SeatButton = ({ seatId, status, isSelected, onToggle }: SeatButtonProps) => {
  const isOccupied = status === "ocupado";

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={onToggle}
      aria-label={`Asiento ${seatId}${isOccupied ? " (ocupado)" : ""}`}
      aria-pressed={isSelected}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors sm:h-9 sm:w-9 ${
        isOccupied
          ? "cursor-not-allowed border border-border bg-muted text-muted-foreground"
          : isSelected
            ? "border border-primary bg-primary text-primary-foreground"
            : "border border-border bg-card text-card-foreground hover:border-primary"
      }`}
    >
      {seatId}
    </button>
  );
};

export default SeatMap;
