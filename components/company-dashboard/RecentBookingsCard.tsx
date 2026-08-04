"use client";
import { useEffect, useState } from "react";
import { fetchSalesHistory, type ApiSale } from "@/lib/api";
import { formatCOP } from "@/data/home";

interface RecentBookingsCardProps {
  companyId: string;
}

const formatPurchaseDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

const RecentBookingsCard = ({ companyId }: RecentBookingsCardProps) => {
  const [sales, setSales] = useState<ApiSale[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSalesHistory().then((allSales) => {
      if (!cancelled) {
        setSales(allSales.filter((sale) => sale.company?.id === companyId));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <h2 className="font-display text-lg text-card-foreground">Reservas recientes</h2>

      {sales === null ? (
        <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
      ) : sales.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no tienes reservas.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
                <th className="px-3 py-1 font-normal">Pasajero</th>
                <th className="px-3 py-1 font-normal">Ruta</th>
                <th className="px-3 py-1 font-normal">Fecha</th>
                <th className="px-3 py-1 font-normal">Precio</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 8).map((sale) => (
                <tr key={sale.id} className="bg-muted">
                  <td className="rounded-l-lg px-3 py-3 text-card-foreground">
                    {sale.user?.name ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {sale.origin} → {sale.destination}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {formatPurchaseDate(sale.purchaseDate)}
                  </td>
                  <td className="rounded-r-lg px-3 py-3 font-medium text-card-foreground">
                    {formatCOP(Number(sale.price))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentBookingsCard;
