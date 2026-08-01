"use client";
import { useEffect, useRef, useState } from "react";
import { DayPicker, type Matcher } from "react-day-picker";
import { formatDateLabel } from "@/data/viajes";

const toISO = (date: Date) => date.toISOString().slice(0, 10);
const toDate = (iso: string) => new Date(`${iso}T00:00:00`);

interface DepartureDatePickerProps {
  value: string;
  availableDates: string[];
  onChange: (iso: string) => void;
  triggerClassName?: string;
}

const DEFAULT_TRIGGER_CLASSNAME =
  "h-10.5 w-full truncate whitespace-nowrap rounded-lg border border-border bg-muted px-4 text-left text-sm text-[var(--bustix-text-on-dark)] outline-none focus:border-primary";

const DepartureDatePicker = ({
  value,
  availableDates,
  onChange,
  triggerClassName = DEFAULT_TRIGGER_CLASSNAME,
}: DepartureDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const availableDatesSet = new Set(availableDates);
  const availableDateObjects = availableDates.map(toDate);

  // `value` puede llegar vacío o desactualizado por un instante (el efecto
  // que lo autoselecciona en el form todavía no corrió) — usar una fecha
  // inválida acá tumba la librería, así que siempre caemos a una disponible.
  const safeValue = value && availableDatesSet.has(value) ? value : availableDates[0];

  const disabledMatcher: Matcher = (date) => !availableDatesSet.has(toISO(date));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={triggerClassName}
      >
        {formatDateLabel(safeValue)}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-2 rounded-xl border border-border bg-card p-3 shadow-xl">
          <DayPicker
            mode="single"
            selected={toDate(safeValue)}
            defaultMonth={toDate(safeValue)}
            disabled={disabledMatcher}
            modifiers={{ available: availableDateObjects }}
            onSelect={(date) => {
              if (!date) return;
              onChange(toISO(date));
              setIsOpen(false);
            }}
            classNames={{
              root: "text-card-foreground",
              months: "flex flex-col",
              month: "flex flex-col gap-2",
              month_caption: "flex items-center justify-center px-8 py-1",
              caption_label: "font-display text-sm text-card-foreground",
              nav: "flex items-center justify-between",
              button_previous:
                "absolute left-1 top-1 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-primary disabled:opacity-30",
              button_next:
                "absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-primary disabled:opacity-30",
              chevron: "h-4 w-4 fill-current",
              month_grid: "mt-1 border-collapse",
              weekdays: "flex",
              weekday: "font-mono-label w-9 text-[10px] uppercase text-muted-foreground",
              weeks: "flex flex-col gap-1",
              week: "flex",
              day: "p-0.5 text-center",
              day_button:
                "flex h-8 w-8 items-center justify-center rounded-full text-sm text-card-foreground transition-colors hover:border hover:border-primary",
              today: "font-bold text-primary",
              selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:border-0",
              disabled: "text-muted-foreground/40 [&>button]:cursor-not-allowed [&>button]:hover:border-0",
              outside: "text-muted-foreground/30",
            }}
            modifiersClassNames={{
              available: "[&>button]:border [&>button]:border-secondary [&>button]:font-bold",
            }}
          />
          <p className="mt-2 flex items-center gap-1.5 px-1 text-[10.5px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full border border-secondary" /> Días con viajes disponibles
          </p>
        </div>
      )}
    </div>
  );
};

export default DepartureDatePicker;
