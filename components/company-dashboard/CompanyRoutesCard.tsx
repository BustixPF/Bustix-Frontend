"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, fetchRoutes, getApiErrorMessage, type ApiRoute } from "@/lib/api";
import { formatCOP } from "@/data/home";

interface CompanyRoutesCardProps {
  companyId: string;
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
};

const CompanyRoutesCard = ({ companyId }: CompanyRoutesCardProps) => {
  const [routes, setRoutes] = useState<ApiRoute[] | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    fetchRoutes().then((allRoutes) => {
      if (!cancelled) {
        setRoutes(allRoutes.filter((route) => route.companyId === companyId));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const handleDeleteRequest = async (routeId: string) => {
    setPendingIds((prev) => new Set(prev).add(routeId));
    try {
      await api.delete(`/dashboard/admin/routes/${routeId}`);
      setRequestedIds((prev) => new Set(prev).add(routeId));
      toast.success("Solicitud enviada", {
        description: "Tu solicitud para eliminar la ruta quedó pendiente de revisión.",
      });
    } catch (error) {
      toast.error("No se pudo enviar la solicitud", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(routeId);
        return next;
      });
    }
  };

  if (!routes) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <h2 className="font-display text-lg text-card-foreground">Tus rutas</h2>

      {routes.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no tienes rutas registradas.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
                <th className="px-3 py-1 font-normal">Ruta</th>
                <th className="px-3 py-1 font-normal">Duración</th>
                <th className="px-3 py-1 font-normal">Precio</th>
                <th className="px-3 py-1 font-normal" />
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => {
                const isPending = pendingIds.has(route.id);
                const isRequested = requestedIds.has(route.id);
                return (
                  <tr key={route.id} className="bg-muted">
                    <td className="rounded-l-lg px-3 py-3 text-card-foreground">
                      {route.origin} → {route.destination}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {formatDuration(route.duration)}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {formatCOP(Number(route.price))}
                    </td>
                    <td className="rounded-r-lg px-3 py-3 text-right">
                      <button
                        type="button"
                        disabled={isPending || isRequested}
                        onClick={() => handleDeleteRequest(route.id)}
                        className="rounded-full border border-destructive px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRequested ? "Solicitado" : isPending ? "Enviando..." : "Solicitar eliminación"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompanyRoutesCard;
