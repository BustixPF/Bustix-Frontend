interface SeatMapProps {
  totalSeats: number;
  availableSeatNumbers: Set<number>;
  selectedSeatNumber: number | null;
  onToggleSeat: (seatNumber: number) => void;
}

const SEATS_PER_ROW = 4;

const LEGEND = [
  { label: "Disponible", className: "border border-border bg-card" },
  { label: "Seleccionado", className: "border border-primary bg-primary" },
  { label: "Ocupado", className: "border border-muted-foreground bg-muted-foreground" },
] as const;

const SeatMap = ({ totalSeats, availableSeatNumbers, selectedSeatNumber, onToggleSeat }: SeatMapProps) => {
  const rowsCount = Math.ceil(totalSeats / SEATS_PER_ROW);
  const rows = Array.from({ length: rowsCount }, (_, rowIndex) => {
    const start = rowIndex * SEATS_PER_ROW + 1;
    return Array.from({ length: SEATS_PER_ROW }, (_, i) => start + i).filter((n) => n <= totalSeats);
  });

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
        <div className="mx-auto flex w-fit flex-col gap-3 sm:gap-4">
          {rows.map((rowSeats, rowIndex) => {
            const half = Math.ceil(rowSeats.length / 2);
            const leftSeats = rowSeats.slice(0, half);
            const rightSeats = rowSeats.slice(half);

            return (
              <div key={rowIndex} className="flex items-center gap-3 sm:gap-6">
                <span className="w-10 font-mono-label text-[10.5px] uppercase text-muted-foreground sm:w-14">
                  Fila {rowIndex + 1}
                </span>
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="flex gap-2">
                    {leftSeats.map((seatNumber) => (
                      <SeatButton
                        key={seatNumber}
                        seatNumber={seatNumber}
                        isAvailable={availableSeatNumbers.has(seatNumber)}
                        isSelected={selectedSeatNumber === seatNumber}
                        onToggle={() => onToggleSeat(seatNumber)}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {rightSeats.map((seatNumber) => (
                      <SeatButton
                        key={seatNumber}
                        seatNumber={seatNumber}
                        isAvailable={availableSeatNumbers.has(seatNumber)}
                        isSelected={selectedSeatNumber === seatNumber}
                        onToggle={() => onToggleSeat(seatNumber)}
                      />
                    ))}
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
  seatNumber: number;
  isAvailable: boolean;
  isSelected: boolean;
  onToggle: () => void;
}

const SeatButton = ({ seatNumber, isAvailable, isSelected, onToggle }: SeatButtonProps) => {
  const isOccupied = !isAvailable;

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={onToggle}
      aria-label={`Asiento ${seatNumber}${isOccupied ? " (ocupado)" : ""}`}
      aria-pressed={isSelected}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors sm:h-9 sm:w-9 ${
        isOccupied
          ? "cursor-not-allowed border border-muted-foreground bg-muted-foreground text-background"
          : isSelected
            ? "border border-primary bg-primary text-primary-foreground"
            : "border border-border bg-card text-card-foreground hover:border-primary"
      }`}
    >
      {seatNumber}
    </button>
  );
};

export default SeatMap;
