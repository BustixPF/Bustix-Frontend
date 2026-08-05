"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createTrip, fetchRoutes, getApiErrorMessage, type ApiRoute } from "@/lib/api";

interface NewScheduleModalProps {
  isOpen: boolean;
  companyId: string;
  onClose: () => void;
  onCreated: () => void;
}

const CloseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const NewScheduleModal = ({ isOpen, companyId, onClose, onCreated }: NewScheduleModalProps) => {
  const [routes, setRoutes] = useState<ApiRoute[] | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [price, setPrice] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    fetchRoutes().then((allRoutes) => {
      if (cancelled) return;
      const companyRoutes = allRoutes.filter((route) => route.companyId === companyId);
      setRoutes(companyRoutes);
      if (companyRoutes.length > 0) {
        setSelectedRouteId(companyRoutes[0].id);
        setPrice(companyRoutes[0].price);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, companyId]);

  if (!isOpen) return null;

  const reset = () => {
    setRoutes(null);
    setSelectedRouteId("");
    setDepartureDate("");
    setPrice("");
    setTotalSeats("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRouteChange = (routeId: string) => {
    setSelectedRouteId(routeId);
    const route = routes?.find((r) => r.id === routeId);
    if (route) setPrice(route.price);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const route = routes?.find((r) => r.id === selectedRouteId);
    if (!route) return;

    setIsSubmitting(true);
    try {
      await createTrip({
        companyId,
        routeId: Number(route.id),
        origin: route.origin,
        destination: route.destination,
        departureDate: new Date(departureDate).toISOString(),
        price: Number(price),
        totalSeats: Number(totalSeats),
      });
      toast.success("Horario creado", {
        description: "El nuevo viaje ya quedó disponible para reservar.",
      });
      onCreated();
      handleClose();
    } catch (error) {
      toast.error("No se pudo crear el horario", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-card-foreground">Nuevo horario</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        {routes === null ? (
          <p className="mt-4 text-sm text-muted-foreground">Cargando rutas…</p>
        ) : routes.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Todavía no tienes ninguna ruta creada. Primero solicita una ruta con &quot;Nueva ruta&quot;
            antes de programar un horario.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <label className="block">
              <span className="font-mono-label text-xs uppercase text-muted-foreground">
                Ruta
              </span>
              <select
                required
                value={selectedRouteId}
                onChange={(event) => handleRouteChange(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
              >
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.origin} → {route.destination}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className="font-mono-label text-xs uppercase text-muted-foreground">
                Fecha y hora de salida
              </span>
              <input
                type="datetime-local"
                required
                value={departureDate}
                onChange={(event) => setDepartureDate(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
              />
            </label>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="font-mono-label text-xs uppercase text-muted-foreground">
                  Precio
                </span>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="85000"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="font-mono-label text-xs uppercase text-muted-foreground">
                  Asientos
                </span>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="40"
                  value={totalSeats}
                  onChange={(event) => setTotalSeats(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-full border border-border py-3 text-sm font-semibold text-card-foreground transition-colors hover:border-primary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
              >
                {isSubmitting ? "Creando..." : "Crear horario"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewScheduleModal;
