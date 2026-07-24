import { tripHistory, type TripStatus } from "@/data/dashboard";

const STATUS_LABEL: Record<TripStatus, string> = {
  completado: "Completado",
  cancelado: "Cancelado",
};

const STATUS_CLASSES: Record<TripStatus, string> = {
  completado: "bg-secondary/15 text-secondary",
  cancelado: "bg-accent/15 text-accent",
};

const TripHistoryCard = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-display text-lg text-card-foreground">Historial de viajes</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
              <th className="px-3 pb-1 font-normal">Ruta</th>
              <th className="px-3 pb-1 font-normal">Empresa</th>
              <th className="px-3 pb-1 font-normal">Fecha</th>
              <th className="px-3 pb-1 font-normal">Estado</th>
            </tr>
          </thead>
          <tbody>
            {tripHistory.map((trip) => (
              <tr key={trip.id} className="bg-muted">
                <td className="rounded-l-lg px-3 py-3 font-medium text-card-foreground">
                  {trip.route}
                </td>
                <td className="px-3 py-3 text-muted-foreground">{trip.company}</td>
                <td className="px-3 py-3 text-muted-foreground">{trip.date}</td>
                <td className="rounded-r-lg px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASSES[trip.status]}`}
                  >
                    {STATUS_LABEL[trip.status]}
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

export default TripHistoryCard;
