"use client";
import { useEffect, useState } from "react";
import { fetchAuditLogs, type AuditLogEntry } from "@/lib/api";

const ACTION_LABEL: Record<string, string> = {
  APPROVE_COMPANY: "Aprobó una empresa",
  REJECT_COMPANY: "Rechazó una empresa",
  UPDATE_COMPANY_STATUS: "Cambió el estado de una empresa",
  UPDATE_COMPANY_ACTIVE: "Activó/desactivó una empresa",
  ASSIGN_COMPANY_ADMIN: "Asignó un administrador",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const AuditLogCard = () => {
  const [logs, setLogs] = useState<AuditLogEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAuditLogs().then((result) => {
      if (!cancelled) setLogs(result);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-lg text-card-foreground">Registro de auditoría</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Últimas acciones administrativas registradas en la plataforma.
      </p>

      {logs === null ? (
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no hay acciones registradas.</p>
      ) : (
        <div className="mt-4 max-h-[65vh] overflow-y-auto pr-1">
          <div className="flex flex-col gap-2">
            {logs.map((log) => (
              <div key={log.id} className="rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-card-foreground">
                    {ACTION_LABEL[log.action] ?? log.action}
                  </p>
                  <span className="font-mono-label text-[10.5px] text-muted-foreground">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {log.userEmail ?? "Usuario desconocido"} · {log.method} {log.endpoint}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogCard;
