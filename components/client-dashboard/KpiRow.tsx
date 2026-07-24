import { dashboardKpis } from "@/data/dashboard";

const KpiRow = () => {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardKpis.map((kpi) => (
        <div key={kpi.id} className="rounded-2xl border border-border bg-card p-6">
          <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
            {kpi.label}
          </p>
          <p className="mt-3 font-display text-3xl text-card-foreground">{kpi.value}</p>
          <p className={`mt-2 text-xs ${kpi.trend === "up" ? "text-secondary" : "text-muted-foreground"}`}>
            {kpi.helper}
          </p>
        </div>
      ))}
    </div>
  );
};

export default KpiRow;
