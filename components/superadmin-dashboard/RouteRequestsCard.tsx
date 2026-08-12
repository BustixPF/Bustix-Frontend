"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchRouteRequests,
  respondRouteRequest,
  getApiErrorMessage,
  type RouteRequestItem,
} from "@/lib/api";
import RejectRequestModal from "./RejectRequestModal";

const RouteRequestsCard = () => {
  const [requests, setRequests] = useState<RouteRequestItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<RouteRequestItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const all = await fetchRouteRequests();
        if (!cancelled) {
          setRequests(all);
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setRequests([]);
          setLoadError(getApiErrorMessage(error, "No se pudieron cargar las solicitudes de rutas"));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleApprove = async (request: RouteRequestItem) => {
    setPendingActionId(request.id);
    try {
      await respondRouteRequest(request.id, "accepted");
      setRequests((prev) => (prev ?? []).filter((r) => r.id !== request.id));
      toast.success("Solicitud de ruta aprobada");
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
      await respondRouteRequest(rejectTarget.id, "rejected", reason || undefined);
      setRequests((prev) => (prev ?? []).filter((r) => r.id !== rejectTarget.id));
      toast.success("Solicitud de ruta rechazada");
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
        <h3 className="font-display text-lg text-card-foreground">Solicitudes de rutas</h3>
        {requests !== null && requests.length > 0 && (
          <span className="font-mono-label text-xs text-muted-foreground">
            {requests.length} pendiente{requests.length === 1 ? "" : "s"}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Rutas nuevas o eliminaciones de ruta solicitadas por empresas.
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
                  <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
                    {request.type === "add" ? "Nueva ruta" : "Eliminar ruta"}
                  </p>
                  <p className="mt-1 font-display text-base text-card-foreground">
                    {request.origin && request.destination
                      ? `${request.origin} → ${request.destination}`
                      : request.routeId
                        ? `Ruta #${request.routeId}`
                        : "Sin datos de ruta"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {request.requestedBy
                      ? `Solicitado por ${request.requestedBy.name} (${request.requestedBy.email})`
                      : "Solicitante no disponible"}
                    {request.companyId ? ` · Empresa ${request.companyId}` : ""}
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

              {(request.duration || request.price || (request.stops && request.stops.length > 0)) && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                  {request.duration && <span>Duración: {request.duration} min</span>}
                  {request.price && <span>Precio: {request.price}</span>}
                  {request.stops && request.stops.length > 0 && (
                    <span>Paradas: {request.stops.join(", ")}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {rejectTarget && (
        <RejectRequestModal
          title="Rechazar solicitud de ruta"
          description="Puedes dejar un motivo (opcional) para la empresa."
          isSubmitting={pendingActionId === rejectTarget.id}
          onConfirm={handleReject}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
};

export default RouteRequestsCard;