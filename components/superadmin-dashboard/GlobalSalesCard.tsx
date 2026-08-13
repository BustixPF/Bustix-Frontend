"use client";
import useSWR from "swr";
import { fetchGlobalSales } from "@/lib/api";
import { SWR_KEYS } from "@/lib/swrKeys";
import { formatCOP } from "@/data/home";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

const GlobalSalesCard = () => {
  const { data: sales } = useSWR(SWR_KEYS.globalSales, fetchGlobalSales);

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-lg text-card-foreground">Ventas de la plataforma</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Todas las ventas confirmadas, de cualquier empresa.
      </p>

      {sales === undefined ? (
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg border border-border bg-muted" />
          ))}
        </div>
      ) : sales.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no hay ventas registradas.</p>
      ) : (
        <div className="mt-4 max-h-[65vh] overflow-x-auto overflow-y-auto pr-1">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
                <th className="px-3 pb-1 font-normal">Ruta</th>
                <th className="px-3 pb-1 font-normal">Empresa</th>
                <th className="px-3 pb-1 font-normal">Usuario</th>
                <th className="px-3 pb-1 font-normal">Fecha</th>
                <th className="px-3 pb-1 font-normal">Precio</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="bg-muted">
                  <td className="rounded-l-lg px-3 py-3 font-medium text-card-foreground">
                    {sale.origin} → {sale.destination}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{sale.company?.name ?? "—"}</td>
                  <td className="px-3 py-3 text-muted-foreground">{sale.user?.name ?? "—"}</td>
                  <td className="px-3 py-3 text-muted-foreground">{formatDate(sale.purchaseDate)}</td>
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

export default GlobalSalesCard;
