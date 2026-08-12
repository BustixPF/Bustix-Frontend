"use client";
import { useState } from "react";
import { toast } from "sonner";
import {
  fetchPaymentById,
  refundPayment,
  getApiErrorMessage,
  type ApiPaymentDetail,
} from "@/lib/api";
import { formatCOP } from "@/data/home";

const STATUS_LABEL: Record<ApiPaymentDetail["status"], string> = {
  pending: "Pendiente",
  paid: "Pagado",
  failed: "Fallido",
  canceled: "Cancelado",
  refunded: "Reembolsado",
};

const RefundPaymentCard = () => {
  const [paymentId, setPaymentId] = useState("");
  const [payment, setPayment] = useState<ApiPaymentDetail | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = paymentId.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setNotFound(false);
    setPayment(null);
    try {
      const result = await fetchPaymentById(trimmed);
      if (result) {
        setPayment(result);
      } else {
        setNotFound(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefund = async () => {
    if (!payment) return;
    setIsRefunding(true);
    try {
      const updated = await refundPayment(payment.id);
      setPayment(updated);
      toast.success("Pago reembolsado correctamente");
    } catch (error) {
      toast.error("No se pudo reembolsar el pago", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-lg text-card-foreground">Reembolsar un pago</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Busca un pago por su ID (visible en Stripe o en soporte) para revisarlo y reembolsarlo.
      </p>

      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <input
          type="text"
          value={paymentId}
          onChange={(e) => setPaymentId(e.target.value)}
          placeholder="ID del pago (uuid)"
          className="min-w-0 flex-1 rounded-full border border-border bg-muted px-4 py-2 text-sm text-card-foreground outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={isSearching || !paymentId.trim()}
          className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {notFound && (
        <p className="mt-4 text-sm text-muted-foreground">No se encontró ningún pago con ese ID.</p>
      )}

      {payment && (
        <div className="mt-4 rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-card-foreground">
              {formatCOP(Number(payment.amount))}
            </p>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
              {STATUS_LABEL[payment.status]}
            </span>
          </div>
          {payment.user && (
            <p className="mt-2 text-xs text-muted-foreground">
              {payment.user.name} · {payment.user.email}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Creado el {new Date(payment.createdAt).toLocaleDateString("es-CO")}
          </p>

          {payment.status === "paid" ? (
            <button
              type="button"
              onClick={handleRefund}
              disabled={isRefunding}
              className="mt-4 rounded-full bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground transition-colors hover:opacity-90 disabled:opacity-60"
            >
              {isRefunding ? "Reembolsando..." : "Reembolsar pago"}
            </button>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">
              Solo se pueden reembolsar pagos en estado &quot;Pagado&quot;.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RefundPaymentCard;
