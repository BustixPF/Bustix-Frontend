"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  getTripsForRoute,
  buildDateOptions,
  formatDateLabel,
  findKnownRoute,
  isDateAvailableForRoute,
  type Trip,
} from "@/data/viajes";
import { fetchRoutes, type ApiRoute } from "@/lib/api";
import { formatCOP } from "@/data/home";
import { useAuth } from "@/components/context/AuthContext";
import { savePendingPassengers, saveReservationRedirect } from "@/lib/reservation-redirect";

type SortKey = "precio" | "salida" | "duracion";

const SORTERS: Record<SortKey, (a: Trip, b: Trip) => number> = {
  precio: (a, b) => a.price - b.price,
  salida: (a, b) => a.departureTime.localeCompare(b.departureTime),
  duracion: (a, b) => a.duration.localeCompare(b.duration),
};

const SORT_LABELS: Record<SortKey, string> = {
  precio: "Precio",
  salida: "Llegada más temprano",
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
  const { user, isLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(dateISO);
  const [passengerCount, setPassengerCount] = useState(passengers);
  const [sortKey, setSortKey] = useState<SortKey>("precio");
  const [originValue, setOriginValue] = useState(origin);
  const [destinationValue, setDestinationValue] = useState(destination);

  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [knownRoute, setKnownRoute] = useState<ApiRoute | undefined>(undefined);
  const [dateAvailable, setDateAvailable] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [companiesCount, setCompaniesCount] = useState(0);

  const handleSwapLocations = () => {
    setOriginValue(destinationValue);
    setDestinationValue(originValue);
  };

  const dateOptions = useMemo(() => buildDateOptions(dateISO), [dateISO]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingTrips(true);

    Promise.all([
      findKnownRoute(originValue, destinationValue),
      isDateAvailableForRoute(originValue, destinationValue, selectedDate),
      getTripsForRoute(originValue, destinationValue),
      fetchRoutes(),
    ]).then(([route, available, tripList, allRoutes]) => {
      if (cancelled) return;
      setKnownRoute(route);
      setDateAvailable(available);
      setTrips(tripList);
      setCompaniesCount(new Set(allRoutes.map((r) => r.companyId)).size);
      setIsLoadingTrips(false);
    });

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
    const query = `origen=${encodeURIComponent(originValue)}&destino=${encodeURIComponent(destinationValue)}&fecha=${selectedDate}&pasajeros=${passengerCount}`;
    const target = `/viajes/${trip.id}/asiento?${query}`;

    if (!isLoading && !user) {
      saveReservationRedirect(target);
      savePendingPassengers(passengerCount);
      toast.info("Inicia sesión para continuar", {
        description: "Necesitas una cuenta para reservar tu asiento.",
      });
      router.push("/auth/login");
      return;
    }

    router.push(target);
  };

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
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Origen</p>
            <p className="text-sm font-bold text-card-foreground">{originValue}</p>
          </div>
          <button
            type="button"
            onClick={handleSwapLocations}
            aria-label="Intercambiar origen y destino"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            ⇄
          </button>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Destino</p>
            <p className="text-sm font-bold text-card-foreground">{destinationValue}</p>
          </div>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Fecha de ida</p>
            <p className="text-sm font-bold text-card-foreground">{formatDateLabel(selectedDate)}</p>
          </div>
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

        {/* Fechas */}
        <div className="mt-6 flex flex-wrap gap-2">
          {dateOptions.map((option) => {
            const isActive = option.iso === selectedDate;
            return (
              <button
                key={option.iso}
                type="button"
                onClick={() => setSelectedDate(option.iso)}
                className={`flex w-20 flex-col items-center rounded-xl border px-3 py-2.5 transition-colors ${
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