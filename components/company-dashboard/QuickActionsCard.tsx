import { useState } from "react";
import { occupancyAverage } from "@/data/companyDashboard";
import NewRouteModal from "@/components/company-dashboard/NewRouteModal";

const QuickActionsCard = () => {
  const [isNewRouteOpen, setIsNewRouteOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <h2 className="font-display text-lg text-card-foreground">Acciones rápidas</h2>

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setIsNewRouteOpen(true)}
          className="rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:brightness-95"
        >
          + Nueva ruta
        </button>
        <button
          type="button"
          disabled
          title="Próximamente"
          className="cursor-not-allowed rounded-lg border border-secondary py-3 text-sm font-bold text-secondary opacity-50"
        >
          + Nuevo horario (Próximamente)
        </button>
        <button
          type="button"
          className="rounded-lg border border-border py-3 text-sm font-bold text-card-foreground transition-colors hover:border-primary"
        >
          Exportar reporte (.csv)
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <p>Ocupación promedio hoy</p>
        <p className="font-display text-sm text-card-foreground">{occupancyAverage}%</p>
      </div>
      <div className="mt-2 h-2.5 w-full rounded-full bg-muted">
        <div
          className="h-2.5 rounded-full bg-secondary"
          style={{ width: `${occupancyAverage}%` }}
        />
      </div>

      <NewRouteModal isOpen={isNewRouteOpen} onClose={() => setIsNewRouteOpen(false)} />
    </div>
  );
};

export default QuickActionsCard;
