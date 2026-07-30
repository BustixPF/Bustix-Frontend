"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPayment, PENDING_PAYMENT_KEY } from "@/lib/api";
import LoadingScreen from "@/components/LoadingScreen";

const POLL_ATTEMPTS = 5;
const POLL_DELAY_MS = 1500;

type PageStatus = "checking" | "confirmed" | "pending";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PagoExitosoPage() {
  const [status, setStatus] = useState<PageStatus>("checking");

  useEffect(() => {
    let cancelled = false;
    const paymentId = window.sessionStorage.getItem(PENDING_PAYMENT_KEY);

    (async () => {
      if (!paymentId) {
        if (!cancelled) setStatus("pending");
        return;
      }

      // El webhook de Stripe confirma el pago de forma asíncrona — puede
      // tardar unos segundos en llegar, así que reintentamos un rato antes
      // de asumir que sigue pendiente.
      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        const payment = await fetchPayment(paymentId);
        if (cancelled) return;
        if (payment?.status === "paid") {
          window.sessionStorage.removeItem(PENDING_PAYMENT_KEY);
          setStatus("confirmed");
          return;
        }
        await wait(POLL_DELAY_MS);
      }

      if (!cancelled) setStatus("pending");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-8 text-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
        {status === "confirmed" ? (
          <>
            <p className="font-mono-label text-xs uppercase text-primary">Pago confirmado</p>
            <h1 className="mt-2 font-display text-2xl text-foreground">¡Listo, tu tiquete está en camino!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ya puedes ver tu compra en tu historial de viajes.
            </p>
          </>
        ) : (
          <>
            <p className="font-mono-label text-xs uppercase text-secondary">Procesando</p>
            <h1 className="mt-2 font-display text-2xl text-foreground">Tu pago se está confirmando</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Puede tardar unos minutos en reflejarse. Revisa tu historial de viajes más tarde si no lo ves de una.
            </p>
          </>
        )}

        <Link
          href="/cliente/dashboard"
          className="mt-6 inline-block w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Ir a mi dashboard
        </Link>
      </div>
    </div>
  );
}
