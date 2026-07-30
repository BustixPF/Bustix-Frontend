"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SeatMap from "@/components/viajes/SeatMap";
import SeatSelectionPanel, { type SelectedSeatInfo } from "@/components/viajes/SeatSelectionPanel";
import LoadingScreen from "@/components/LoadingScreen";
import { getTripById, formatDateLabel, seatPositionLabel, type Trip } from "@/data/viajes";
import { fetchAvailableSeats, type ApiSeat } from "@/lib/api";

const todayISO = () => new Date().toISOString().slice(0, 10);

const AsientoPageContent = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const origin = searchParams.get("origen") ?? "Medellín (Ant.)";
  const destination = searchParams.get("destino") ?? "Bogotá (D.C.)";
  const dateISO = searchParams.get("fecha") ?? todayISO();

  const [isLoading, setIsLoading] = useState(true);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [availableSeats, setAvailableSeats] = useState<ApiSeat[]>([]);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all([getTripById(tripId), fetchAvailableSeats(tripId)]).then(([tripData, seats]) => {
      if (cancelled) return;
      setTrip(tripData);
      setAvailableSeats(seats);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  const availableSeatNumbers = useMemo(
    () => new Set(availableSeats.map((seat) => seat.seatNumber)),
    [availableSeats]
  );

  const toggleSeat = (seatNumber: number) => {
    setSelectedSeatNumber((current) => (current === seatNumber ? null : seatNumber));
  };

  const selectedSeatInfo: SelectedSeatInfo | null =
    selectedSeatNumber === null
      ? null
      : { seatNumber: selectedSeatNumber, position: seatPositionLabel(selectedSeatNumber) };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-8 text-center">
        <div>
          <p className="text-sm font-bold text-foreground">Viaje no encontrado.</p>
          <Link href="/viajes" className="mt-2 inline-block text-sm text-accent hover:underline">
            ← Volver a los resultados
          </Link>
        </div>
      </div>
    );
  }

  const query = `origen=${encodeURIComponent(origin)}&destino=${encodeURIComponent(destination)}&fecha=${dateISO}`;

  const handleContinue = () => {
    if (selectedSeatNumber === null) return;
    const seat = availableSeats.find((s) => s.seatNumber === selectedSeatNumber);
    if (!seat) return;
    router.push(
      `/viajes/${trip.id}/pagar?${query}&seatId=${encodeURIComponent(seat.id)}&seatNumber=${seat.seatNumber}`
    );
  };

  return (
    <div className="min-h-screen bg-background px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <Link href={`/viajes?${query}`} className="text-sm font-semibold text-accent hover:underline">
          ← Volver a los resultados
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-6 rounded-xl border border-border bg-card p-5">
          <h1 className="flex items-center gap-2 font-display text-2xl text-foreground">
            {origin} <span className="text-accent">→</span> {destination}
          </h1>
          <div className="ml-auto flex flex-wrap items-center gap-6">
            <div>
              <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Empresa</p>
              <p className="text-sm font-bold text-card-foreground">{trip.company}</p>
            </div>
            <div>
              <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Fecha</p>
              <p className="text-sm font-bold text-card-foreground">{formatDateLabel(dateISO)}</p>
            </div>
            <div>
              <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Salida</p>
              <p className="text-sm font-bold text-card-foreground">{trip.departureTime}</p>
            </div>
            <div>
              <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">Duración</p>
              <p className="text-sm font-bold text-card-foreground">{trip.duration}</p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{trip.totalSeats} puestos</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl text-foreground">Elige tu asiento</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Toca un asiento disponible en el mapa del bus.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <SeatMap
                totalSeats={trip.totalSeats}
                availableSeatNumbers={availableSeatNumbers}
                selectedSeatNumber={selectedSeatNumber}
                onToggleSeat={toggleSeat}
              />
            </div>
          </div>

          <SeatSelectionPanel
            selectedSeat={selectedSeatInfo}
            pricePerSeat={trip.price}
            onRemoveSeat={() => setSelectedSeatNumber(null)}
            onExpire={() => setSelectedSeatNumber(null)}
            onContinue={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default function AsientoPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AsientoPageContent />
    </Suspense>
  );
}
