import { useState } from "react";
import useSWR from "swr";
import { fetchTrips, fetchAvailableSeats } from "@/lib/api";
import { SWR_KEYS } from "@/lib/swrKeys";
import NewRouteModal from "@/components/company-dashboard/NewRouteModal";
import NewScheduleModal from "@/components/company-dashboard/NewScheduleModal";

interface QuickActionsCardProps {
  companyId: string;
}

const QuickActionsCard = ({ companyId }: QuickActionsCardProps) => {
  const [isNewRouteOpen, setIsNewRouteOpen] = useState(false);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const { data: trips } = useSWR(SWR_KEYS.trips, fetchTrips);
  const companyTrips = (trips ?? []).filter((trip) => trip.companyId === companyId);
  const companyTripIds = companyTrips.map((trip) => trip.id).join(",");

  const { data: occupancyAverage } = useSWR(
    trips ? ["company-occupancy", companyTripIds] : null,
    async () => {
      if (companyTrips.length === 0) return 0;
      const rates = await Promise.all(
        companyTrips.map(async (trip) => {
          const availableSeats = await fetchAvailableSeats(trip.id);
          const sold = trip.totalSeats - availableSeats.length;
          return trip.totalSeats > 0 ? sold / trip.totalSeats : 0;
        })
      );
      const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
      return Math.round(average * 100);
    }
  );

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
          onClick={() => setIsNewScheduleOpen(true)}
          className="rounded-lg border border-secondary py-3 text-sm font-bold text-secondary transition-colors hover:bg-secondary/10"
        >
          + Nuevo horario
        </button>
        <button
          type="button"
          disabled
          title="Todavía no está disponible"
          className="cursor-not-allowed rounded-lg border border-border py-3 text-sm font-bold text-muted-foreground opacity-50"
        >
          Exportar reporte (.csv) · Próximamente
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <p>Ocupación promedio</p>
        <p className="font-display text-sm text-card-foreground">
          {occupancyAverage === undefined ? "—" : `${occupancyAverage}%`}
        </p>
      </div>
      <div className="mt-2 h-2.5 w-full rounded-full bg-muted">
        <div
          className="h-2.5 rounded-full bg-secondary"
          style={{ width: `${occupancyAverage ?? 0}%` }}
        />
      </div>

      <NewRouteModal isOpen={isNewRouteOpen} onClose={() => setIsNewRouteOpen(false)} />
      <NewScheduleModal
        isOpen={isNewScheduleOpen}
        companyId={companyId}
        onClose={() => setIsNewScheduleOpen(false)}
      />
    </div>
  );
};

export default QuickActionsCard;
