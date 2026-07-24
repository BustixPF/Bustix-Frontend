import { occupancyAverage } from "@/data/companyDashboard";

const QuickActionsCard = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg text-card-foreground">Acciones rápidas</h2>

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          className="rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:brightness-95"
        >
          + Nueva ruta
        </button>
        <button
          type="button"
          className="rounded-lg border border-secondary py-3 text-sm font-bold text-secondary transition-colors hover:bg-secondary/10"
        >
          + Nuevo horario
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
    </div>
  );
};

export default QuickActionsCard;
