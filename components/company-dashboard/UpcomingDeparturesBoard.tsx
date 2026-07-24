import { companyDepartures, type CompanyDepartureStatus } from "@/data/companyDashboard";

const STATUS_LABEL: Record<CompanyDepartureStatus, string> = {
  "a-tiempo": "A tiempo",
  embarcando: "Embarcando",
  retrasado: "Retrasado",
};

const STATUS_CLASSES: Record<CompanyDepartureStatus, string> = {
  "a-tiempo": "bg-success/15 text-success",
  embarcando: "bg-primary/15 text-primary",
  retrasado: "bg-destructive/15 text-destructive",
};

const UpcomingDeparturesBoard = () => {
  return (
    <div className="bustix-dark rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Próximas salidas</h2>
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Hoy
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="font-mono-label text-xs uppercase text-muted-foreground">
              <th className="px-3 py-2 font-normal">Ruta</th>
              <th className="px-3 py-2 font-normal">Hora</th>
              <th className="px-3 py-2 font-normal">Bus</th>
              <th className="px-3 py-2 font-normal">Ocupación</th>
              <th className="px-3 py-2 font-normal">Estado</th>
            </tr>
          </thead>
          <tbody>
            {companyDepartures.map((departure) => (
              <tr key={departure.id} className="rounded-lg bg-background">
                <td className="font-mono-label rounded-l-lg px-3 py-3 font-medium text-foreground">
                  {departure.route}
                </td>
                <td className="font-mono-label px-3 py-3 text-foreground">{departure.time}</td>
                <td className="font-mono-label px-3 py-3 text-muted-foreground">{departure.bus}</td>
                <td className="font-mono-label px-3 py-3 text-muted-foreground">
                  {departure.occupancy}
                </td>
                <td className="rounded-r-lg px-3 py-3">
                  <span
                    className={`font-mono-label inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASSES[departure.status]}`}
                  >
                    {STATUS_LABEL[departure.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingDeparturesBoard;
