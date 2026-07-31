"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getTripById, formatDateLabel, type Trip } from "@/data/viajes";
import { formatCOP } from "@/data/home";
import { createCheckoutSession, getApiErrorMessage, PENDING_PAYMENT_KEY } from "@/lib/api";
import LoadingScreen from "@/components/LoadingScreen";

const todayISO = () => new Date().toISOString().slice(0, 10);

const PagarPageContent = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const searchParams = useSearchParams();

  const origin = searchParams.get("origen") ?? "Medellín (Ant.)";
  const destination = searchParams.get("destino") ?? "Bogotá (D.C.)";
  const dateISO = searchParams.get("fecha") ?? todayISO();
  const seatIds = searchParams.get("seatIds")?.split(",").filter(Boolean) ?? [];
  const seatNumbers = searchParams.get("seatNumbers")?.split(",").filter(Boolean) ?? [];
  const passengerCount = Number(searchParams.get("pasajeros")) || undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTripById(tripId).then((tripData) => {
      if (!cancelled) {
        setTrip(tripData);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!trip || seatIds.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-8 text-center">
        <div>
          <p className="text-sm font-bold text-foreground">
            {trip ? "No se encontró el asiento elegido." : "Viaje no encontrado."}
          </p>
          <Link href="/viajes" className="mt-2 inline-block text-sm text-accent hover:underline">
            ← Volver a los resultados
          </Link>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const { url, paymentId } = await createCheckoutSession(trip.id, seatIds);
      window.sessionStorage.setItem(PENDING_PAYMENT_KEY, paymentId);
      window.location.href = url;
    } catch (error) {
      toast.error("No se pudo iniciar el pago", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center text-left pl-15 pt-8">
        <Link
          href={`/viajes/${trip.id}/asiento?origen=${encodeURIComponent(origin)}&destino=${encodeURIComponent(destination)}&fecha=${dateISO}`}
          className="mt-2 inline-block text-sm text-accent hover:underline"
        >
          ← Volver a la selección de asientos
        </Link>
      </div>
      <div className="flex min-h-screen items-center justify-center bg-background px-8 py-8">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
          <p className="font-mono-label text-xs uppercase text-muted-foreground">Resumen de la compra</p>
          <h1 className="mt-2 flex items-center gap-2 font-display text-2xl text-foreground">
            {origin} <span className="text-accent">→</span> {destination}
          </h1>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Empresa</span>
              <span className="font-bold text-card-foreground">{trip.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha</span>
              <span className="font-bold text-card-foreground">{formatDateLabel(dateISO)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Salida</span>
              <span className="font-bold text-card-foreground">{trip.departureTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asientos</span>
              <span className="font-bold text-card-foreground">{seatNumbers.join(", ") || "—"}</span>
            </div>
            {passengerCount ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pasajeros</span>
                <span className="font-bold text-card-foreground">{passengerCount}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-mono-label text-xs uppercase text-muted-foreground">Total</span>
            <span className="font-display text-2xl text-foreground">{formatCOP(trip.price * seatIds.length)}</span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {isSubmitting ? "Redirigiendo a pago…" : "Confirmar pago"}
          </button>
        </div>
      </div>
    </>
  );
};

export default function PagarPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PagarPageContent />
    </Suspense>
  );
}
