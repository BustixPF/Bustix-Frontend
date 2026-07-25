"use client";
import { Suspense, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import SeatMap from "@/components/viajes/SeatMap";
import SeatSelectionPanel, { type SelectedSeatInfo } from "@/components/viajes/SeatSelectionPanel";
import LoadingScreen from "@/components/LoadingScreen";
import { getTripById, formatDateLabel, seatPositionLabel } from "@/data/viajes";

const todayISO = () => new Date().toISOString().slice(0, 10);

const AsientoPageContent = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const origin = searchParams.get("origen") ?? "Medellín (Ant.)";
  const destination = searchParams.get("destino") ?? "Bogotá (D.C.)";
  const dateISO = searchParams.get("fecha") ?? todayISO();
  const passengers = Number(searchParams.get("pasajeros")) || 1;

  const trip = getTripById(tripId);

  const [activeFloor, setActiveFloor] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatKey: string) => {
    if (!selectedSeats.includes(seatKey) && selectedSeats.length >= passengers) {
      toast.info("Ya elegiste el máximo de asientos", {
        description: `Buscaste para ${passengers} pasajero${passengers > 1 ? "s" : ""}. Quita un asiento para elegir otro.`,
      });
      return;
    }

    setSelectedSeats((current) => {
      if (current.includes(seatKey)) {
        return current.filter((key) => key !== seatKey);
      }
      if (current.length >= passengers) {
        return current;
      }
      return [...current, seatKey];
    });
  };

  const selectedSeatInfos: SelectedSeatInfo[] = useMemo(() => {
    if (!trip) return [];
    return selectedSeats.map((seatKey) => {
      const [floorPart, seatId] = seatKey.split("-");
      const floorNumber = Number(floorPart);
      const floor = trip.seatMap.find((f) => f.floor === floorNumber);
      const seatsPerRow = floor?.rows[0]?.seats.length ?? 4;
      return {
        seatKey,
        id: seatId,
        floor: floorNumber,
        seatType: floor?.seatType ?? trip.seatType,
        position: seatPositionLabel(seatId, seatsPerRow),
      };
    });
  }, [selectedSeats, trip]);

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

  const floor = trip.seatMap[activeFloor];
  const query = `origen=${encodeURIComponent(origin)}&destino=${encodeURIComponent(destination)}&fecha=${dateISO}&pasajeros=${passengers}`;

  const handleContinue = () => {
    const seatsParam = selectedSeats.map((seatKey) => seatKey.split("-")[1]).join(",");
    router.push(`/viajes/${trip.id}/pagar?${query}&seats=${encodeURIComponent(seatsParam)}`);
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
        <p className="mt-2 text-xs text-muted-foreground">
          {trip.busType} · {trip.floorsCount} piso{trip.floorsCount > 1 ? "s" : ""} · {trip.totalSeats} puestos
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl text-foreground">Elige tu asiento</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Toca un asiento disponible en el mapa del bus.
                </p>
              </div>
              {trip.seatMap.length > 1 && (
                <div className="flex gap-2">
                  {trip.seatMap.map((f, index) => (
                    <button
                      key={f.floor}
                      type="button"
                      onClick={() => setActiveFloor(index)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        index === activeFloor
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      Piso {f.floor}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <SeatMap floor={floor} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
            </div>
          </div>

          <SeatSelectionPanel
            selectedSeats={selectedSeatInfos}
            pricePerSeat={trip.price}
            requiredSeats={passengers}
            onRemoveSeat={(seatKey) =>
              setSelectedSeats((current) => current.filter((key) => key !== seatKey))
            }
            onExpire={() => setSelectedSeats([])}
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
