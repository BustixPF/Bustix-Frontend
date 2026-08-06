"use client";
import { useState } from "react";
import { toast } from "sonner";
import { api, getApiErrorMessage } from "@/lib/api";

interface NewRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const NewRouteModal = ({ isOpen, onClose }: NewRouteModalProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setOrigin("");
    setDestination("");
    setDuration("");
    setPrice("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/dashboard/admin/routes", {
        type: "add",
        origin,
        destination,
        duration: Number(duration),
        price: Number(price),
      });
      toast.success("Solicitud enviada", {
        description: "Tu solicitud de nueva ruta quedó pendiente de revisión.",
      });
      handleClose();
    } catch (error) {
      toast.error("No se pudo enviar la solicitud", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />

      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-card-foreground">Solicitar nueva ruta</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block">
            <span className="font-mono-label text-xs uppercase text-muted-foreground">
              Origen
            </span>
            <input
              type="text"
              required
              placeholder="Medellín"
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
            />
          </label>

          <label className="mt-4 block">
            <span className="font-mono-label text-xs uppercase text-muted-foreground">
              Destino
            </span>
            <input
              type="text"
              required
              placeholder="Bogotá"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
            />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="font-mono-label text-xs uppercase text-muted-foreground">
                Duración (min)
              </span>
              <input
                type="number"
                required
                min={1}
                placeholder="360"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
              />
            </label>

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
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRouteModal;
