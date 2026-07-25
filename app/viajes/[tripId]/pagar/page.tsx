"use client";
import { Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getTripById, formatDateLabel } from "@/data/viajes";
import { formatCOP } from "@/data/home";
import { useAuth } from "@/components/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

const todayISO = () => new Date().toISOString().slice(0, 10);

const PagarPageContent = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const origin = searchParams.get("origen") ?? "Medellín (Ant.)";
  const destination = searchParams.get("destino") ?? "Bogotá (D.C.)";
  const dateISO = searchParams.get("fecha") ?? todayISO();
  const seatsParam = searchParams.get("seats") ?? "";
  const seatIds = seatsParam ? seatsParam.split(",") : [];

  const trip = getTripById(tripId);

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

  const total = trip.price * seatIds.length;

  // TODO: conectar con un endpoint real de reservas/pagos cuando exista en el backend.
  const handleConfirm = () => {
    toast.success("¡Reserva confirmada!", {
      description: `${trip.company} · ${origin} → ${destination} · ${seatIds.length} asiento${seatIds.length === 1 ? "" : "s"}.`,
    });
    router.push(user ? "/cliente/dashboard" : "/");
  };

  return (
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
            <span className="font-bold text-card-foreground">{seatIds.join(", ") || "—"}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-mono-label text-xs uppercase text-muted-foreground">Total</span>
          <span className="font-display text-2xl text-foreground">{formatCOP(total)}</span>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Confirmar pago
        </button>
      </div>
    </div>
  );
};

export default function PagarPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PagarPageContent />
    </Suspense>
  );
}
