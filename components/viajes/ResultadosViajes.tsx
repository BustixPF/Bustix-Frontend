"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTripsForRoute,
  getAvailableDatesForRoute,
  formatDateLabel,
  findKnownRoute,
  isDateAvailableForRoute,
  type Trip,
  type DateOption,
} from "@/data/viajes";
import { fetchRoutes, type ApiRoute } from "@/lib/api";
import { formatCOP } from "@/data/home";
import LoadingScreen from "@/components/LoadingScreen";
import DepartureDatePicker from "@/components/DepartureDatePicker";

type SortKey = "precio" | "salida" | "duracion";

const SORTERS: Record<SortKey, (a: Trip, b: Trip) => number> = {
  precio: (a, b) => a.price - b.price,
  salida: (a, b) => new Date(a.departureDateISO).getTime() - new Date(b.departureDateISO).getTime(),
  duracion: (a, b) => a.durationMinutes - b.durationMinutes,
};

const SORT_LABELS: Record<SortKey, string> = {
  precio: "Precio",
  salida: "Salida más temprano",
  duracion: "Duración",
};

const EmptyState = ({ title, message }: { title: string; message: string }) => (
  <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-8 text-center">
    <p className="text-sm font-bold text-card-foreground">{title}</p>
    <p className="mt-1 text-sm text-muted-foreground">{message}</p>
  </div>
);

interface ResultadosViajesProps {
  origin: string;
  destination: string;
  dateISO: string;
  passengers: number;
}

const ResultadosViajes = ({ origin, destination, dateISO, passengers }: ResultadosViajesProps) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(dateISO);
  const [passengerCount, setPassengerCount] = useState(passengers);
  const [sortKey, setSortKey] = useState<SortKey>("precio");
  const [originValue, setOriginValue] = useState(origin);
  const [destinationValue, setDestinationValue] = useState(destination);
  const [originInput, setOriginInput] = useState(origin);
  const [destinationInput, setDestinationInput] = useState(destination);

  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [knownRoute, setKnownRoute] = useState<ApiRoute | undefined>(undefined);
  const [dateAvailable, setDateAvailable] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  const scrollDates = (direction: "left" | "right") => {
    dateScrollRef.current?.scrollBy({ left: direction === "left" ? -180 : 180, behavior: "smooth" });
  };

  const handleSwapLocations = () => {
    setOriginInput(destinationInput);
    setDestinationInput(originInput);
    setOriginValue(destinationValue);
    setDestinationValue(originValue);
  };

  // Espera a que el usuario deje de escribir antes de volver a buscar —
  // si no, cada letra dispararía una búsqueda nueva contra el backend.
  useEffect(() => {
    const timer = setTimeout(() => {
      setOriginValue(originInput);
      setDestinationValue(destinationInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [originInput, destinationInput]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoadingTrips(true);

      const [route, available, tripList, dates, allRoutes] = await Promise.all([
        findKnownRoute(originValue, destinationValue),
        isDateAvailableForRoute(originValue, destinationValue, selectedDate),
        getTripsForRoute(originValue, destinationValue),
        getAvailableDatesForRoute(originValue, destinationValue),
        fetchRoutes(),
      ]);
      if (cancelled) return;
      setKnownRoute(route);
      setDateAvailable(available);
      setTrips(tripList);
      setDateOptions(dates);
      setCompaniesCount(new Set(allRoutes.map((r) => r.companyId)).size);
      setIsLoadingTrips(false);
      setHasLoadedOnce(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [originValue, destinationValue, selectedDate]);

  const availableTrips = useMemo(
    () => trips.filter((trip) => trip.seatsAvailable >= passengerCount),
    [trips, passengerCount]
  );

  const sortedTrips = useMemo(
    () => [...availableTrips].sort(SORTERS[sortKey]),
    [availableTrips, sortKey]
  );

  const handleReserve = (trip: Trip) => {
    const params = new URLSearchParams({
      origen: originValue,
      destino: destinationValue,
      fecha: selectedDate,
      pasajeros: String(passengerCount),
    });
    router.push(`/viajes/${trip.id}/asiento?${params.toString()}`);
  };

  if (isLoadingTrips && !hasLoadedOnce) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/#rutas-populares"
          className="text-sm font-semibold text-accent hover:underline"
        >
          ← Rutas populares
        </Link>

        {/* Resumen de búsqueda */}
        <div className="mt-4 flex flex-wrap items-center gap-6 rounded-xl border border-border bg-card p-5">
          <label className="block">
            <span className="mb-1 block font-mono-label text-[10.5px] uppercase text-muted-foreground">Origen</span>
            <input
              type="text"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              className="mt-2 w-32 rounded-lg border border-border bg-muted px-2.5 py-1.5 text-sm font-bold text-card-foreground outline-none focus:border-primary"
            />
          </label>
          <button
            type="button"
            onClick={handleSwapLocations}
            aria-label="Intercambiar origen y destino"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            ⇄
          </button>
          <label className="block">
            <span className="mb-1 block font-mono-label text-[10.5px] uppercase text-muted-foreground">Destino</span>
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              className="mt-2 w-32 rounded-lg border border-border bg-muted px-2.5 py-1.5 text-sm font-bold text-card-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono-label text-[10.5px] uppercase text-muted-foreground">Fecha de ida</span>
            {dateOptions.length > 0 ? (
              <div className="mt-2 w-36">
                <DepartureDatePicker
                  value={selectedDate}
                  availableDates={dateOptions.map((option) => option.iso)}
                  onChange={setSelectedDate}
                  triggerClassName="h-9 w-full truncate whitespace-nowrap rounded-lg border border-border bg-muted px-2.5 text-left text-sm font-bold text-card-foreground outline-none focus:border-primary"
                />
              </div>
            ) : (
              <p className="mt-2 text-sm font-bold text-card-foreground">{formatDateLabel(selectedDate)}</p>
            )}
          </label>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Pasajeros</p>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPassengerCount((count) => Math.max(1, count - 1))}
                aria-label="Reducir pasajeros"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                −
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-bold text-card-foreground">
                {passengerCount}
              </span>
              <button
                type="button"
                onClick={() => setPassengerCount((count) => Math.min(9, count + 1))}
                aria-label="Aumentar pasajeros"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                +
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:ml-auto sm:w-auto"
          >
            Nueva búsqueda
          </button>
        </div>

        {/* Encabezado de la ruta */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="flex items-center gap-3 font-display text-3xl text-foreground">
              {originValue} <span className="text-accent">→</span> {destinationValue}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Elige la empresa, el horario y la fecha que mejor te queden.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {companiesCount} empresas · {sortedTrips.length} viajes encontrados
          </p>
        </div>

        {/* Fechas (solo las que realmente tienen viajes para esta ruta) */}
        {dateOptions.length > 0 ? (
          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollDates("left")}
              aria-label="Ver fechas anteriores"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              ‹
            </button>

            <div
              ref={dateScrollRef}
              className="flex flex-1 gap-2 overflow-x-auto scroll-smooth px-1 py-1 scrollbar-none [-ms-overflow-style:none]"
            >
              {dateOptions.map((option) => {
                const isActive = option.iso === selectedDate;
                return (
                  <button
                    key={option.iso}
                    type="button"
                    onClick={() => setSelectedDate(option.iso)}
                    className={`flex w-20 shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-card-foreground hover:border-primary"
                    }`}
                  >
                    <span className="font-mono-label text-[10.5px] uppercase opacity-80">
                      {option.weekday}
                    </span>
                    <span className="font-display text-lg">{option.day}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollDates("right")}
              aria-label="Ver fechas siguientes"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              ›
            </button>
          </div>
        ) : (
          !isLoadingTrips &&
          knownRoute && (
            <p className="mt-6 text-sm text-muted-foreground">
              No encontramos otras fechas con viajes programados para esta ruta.
            </p>
          )
        )}

        {/* Orden */}
        <div className="mt-6 flex items-center gap-3">
          <span className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
            Ordenar por
          </span>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSortKey(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                sortKey === key
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {SORT_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Resultados */}
        {isLoadingTrips ? (
          <EmptyState title="Buscando viajes…" message="Un momento, estamos consultando los horarios disponibles." />
        ) : !knownRoute ? (
          <EmptyState
            title="Por el momento no tenemos esa ruta"
            message={`Aún no operamos viajes entre ${originValue} y ${destinationValue}. Prueba con otra ciudad de origen o destino.`}
          />
        ) : !dateAvailable ? (
          <EmptyState
            title="Esta ruta no viaja ese día"
            message={`No encontramos viajes de ${originValue} a ${destinationValue} para esa fecha. Elige otra fecha.`}
          />
        ) : sortedTrips.length === 0 ? (
          <EmptyState
            title={`Ningún viaje tiene ${passengerCount} puestos disponibles juntos`}
            message="Prueba con menos pasajeros o revisa otra fecha."
          />
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {sortedTrips.map((trip) => (
              <article
                key={trip.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-mono-label text-xs font-bold text-card-foreground">
                    {trip.company
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-card-foreground">{trip.company}</p>
                    <p className="text-xs text-muted-foreground">{trip.totalSeats} puestos</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="font-display text-lg text-card-foreground">{trip.departureTime}</p>
                    <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Salida</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <span className="text-xs">{trip.duration}</span>
                    <span className="h-px w-10 bg-border" />
                  </div>
                  <div>
                    <p className="font-display text-lg text-card-foreground">{trip.arrivalTime}</p>
                    <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Llegada</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <p className="text-xs text-card-foreground">
                    <span className="font-bold">{trip.seatsAvailable}</span> asientos disponibles
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-mono-label text-xl font-bold text-secondary">
                      {formatCOP(trip.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleReserve(trip)}
                      className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
  
export default ResultadosViajes;