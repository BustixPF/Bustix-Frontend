"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSuperAdminPendingSummary, type SuperAdminPendingSummary } from "@/lib/api";

const SuperAdminNotificationsDropdown = () => {
  const [summary, setSummary] = useState<SuperAdminPendingSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSuperAdminPendingSummary().then((result) => {
      if (!cancelled) setSummary(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = summary
    ? [
        { label: "Solicitudes de empresa", count: summary.companies },
        { label: "Solicitudes de ruta", count: summary.routes },
        { label: "Solicitudes de horario", count: summary.schedules },
      ].filter((item) => item.count > 0)
    : [];

  return (
    <div className="w-72 rounded-2xl border border-border bg-card p-4 shadow-xl sm:w-80">
      <h3 className="font-display text-base text-card-foreground">Pendientes por aprobar</h3>

      {summary === null ? (
        <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No hay nada pendiente por ahora.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-card-foreground">{item.label}</span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/superadmin/dashboard"
        className="mt-4 block text-center text-xs font-bold text-accent hover:underline"
      >
        Ir al panel →
      </Link>
    </div>
  );
};

export default SuperAdminNotificationsDropdown;
