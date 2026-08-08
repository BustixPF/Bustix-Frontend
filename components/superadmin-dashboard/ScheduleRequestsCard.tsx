"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchScheduleRequests,
  respondScheduleRequest,
  getApiErrorMessage,
  type ScheduleRequestItem,
} from "@/lib/api";
import { formatCOP } from "@/data/home";
import RejectRequestModal from "./RejectRequestModal";

const formatDateTime = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

const ScheduleRequestsCard = () => {
  const [requests, setRequests] = useState<ScheduleRequestItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ScheduleRequestItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const all = await fetchScheduleRequests();
        if (!cancelled) {
          setRequests(all);
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setRequests([]);
          setLoadError(
            getApiErrorMessage(error, "No se pudieron cargar las solicitudes de horarios")
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleApprove = async (request: ScheduleRequestItem) => {
    setPendingActionId(request.id);
    try {
      await respondScheduleRequest(request.id, "accepted");
      setRequests((prev) => (prev ?? []).filter((r) => r.id !== request.id));
      toast.success("Solicitud de horario aprobada");
    } catch (error) {
      toast.error("No se pudo aprobar la solicitud", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setPendingActionId(null);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setPendingActionId(rejectTarget.id);
    try {
      await respondScheduleRequest(rejectTarget.id, "rejected", reason || undefined);
      setRequests((prev) => (prev ?? []).filter((r) => r.id !== rejectTarget.id));
      toast.success("Solicitud de horario rechazada");
      setRejectTarget(null);
    } catch (error) {
      toast.error("No se pudo rechazar la solicitud", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg text-card-foreground">Solicitudes de horarios</h3>
        {requests !== null && requests.length > 0 && (
          <span className="font-mono-label text-xs text-muted-foreground">
            {requests.length} pendiente{requests.length === 1 ? "" : "s"}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Horarios (Trips) solicitados por empresas para sus rutas.
      </p>

      {requests === null ? (
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : loadError ? (
        <p className="mt-4 text-sm text-destructive">{loadError}</p>
      ) : requests.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No hay solicitudes pendientes.</p>
      ) : (
        <div className="mt-4 flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1">
          {requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-border p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base text-card-foreground">
                    {request.origin} → {request.destination}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(request.departureDate)} · {formatCOP(request.price)} ·{" "}
                    {request.totalSeats} asientos
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Solicitado por {request.requestedBy.name} ({request.requestedBy.email}) ·
                    Empresa {request.companyId}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(request)}
                    disabled={pendingActionId === request.id}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
                  >
                    {pendingActionId === request.id ? "..." : "Aprobar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectTarget(request)}
                    disabled={pendingActionId === request.id}
                    className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-card-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectTarget && (
        <RejectRequestModal
          title="Rechazar solicitud de horario"
          description="Puedes dejar un motivo (opcional) para la empresa."
          isSubmitting={pendingActionId === rejectTarget.id}
          onConfirm={handleReject}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
};

export default ScheduleRequestsCard;