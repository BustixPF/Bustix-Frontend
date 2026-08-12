"use client";
import { useEffect, useState } from "react";
import { fetchSystemHealth, type SystemHealth } from "@/lib/api";

const CHECK_LABELS: Record<string, string> = {
  database: "Base de datos",
  memory_heap: "Memoria del servidor",
  stripe_gateway: "Pasarela de pago (Stripe)",
  external_services: "Conectividad externa",
};

const SystemHealthCard = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsRefreshing(true);
      const result = await fetchSystemHealth();
      if (cancelled) return;
      setHealth(result);
      setCheckedAt(new Date());
      setIsRefreshing(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  const load = () => setRefreshToken((t) => t + 1);

  const entries = health ? Object.entries(health.details) : [];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-card-foreground">Estado del sistema</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Salud en vivo de la base de datos, Stripe y la conectividad del servidor.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={isRefreshing}
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-card-foreground transition-colors hover:border-primary disabled:opacity-60"
        >
          {isRefreshing ? "Revisando..." : "Actualizar"}
        </button>
      </div>

      {health === null ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {entries.map(([key, detail]) => {
            const isUp = detail.status === "up";
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-2 rounded-xl border border-border p-3"
              >
                <span className="text-sm text-card-foreground">{CHECK_LABELS[key] ?? key}</span>
                <span
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                    isUp ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isUp ? "bg-success" : "bg-destructive"}`} />
                  {isUp ? "Operativo" : "Con fallas"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {checkedAt && (
        <p className="mt-3 text-right text-xs text-muted-foreground">
          Última revisión: {checkedAt.toLocaleTimeString("es-CO")}
        </p>
      )}
    </div>
  );
};

export default SystemHealthCard;
