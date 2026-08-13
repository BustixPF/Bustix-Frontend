"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import {
  fetchTrips,
  fetchAvailableSeats,
  updateTripStatus,
  getApiErrorMessage,
  type ApiTrip,
  type ManualTripStatus,
} from "@/lib/api";
import { SWR_KEYS } from "@/lib/swrKeys";
import { formatTime, formatDateLabel, toLocalDateISO } from "@/data/viajes";
import { TRIP_STATUS_LABEL, TRIP_STATUS_BADGE_CLASSES } from "@/lib/tripStatus";
import TripStatusModal from "./TripStatusModal";

interface Departure {
  id: string;
  route: string;
  date: string;
  time: string;
  occupancy: string;
  status: ApiTrip["status"];
}

const MAX_DEPARTURES = 6;

const buildOccupancy = async (trip: ApiTrip): Promise<string> => {
  const availableSeats = await fetchAvailableSeats(trip.id);
  const sold = trip.totalSeats - availableSeats.length;
  return `${sold}/${trip.totalSeats}`;
};

interface UpcomingDeparturesBoardProps {
  companyId: string;
}

const UpcomingDeparturesBoard = ({ companyId }: UpcomingDeparturesBoardProps) => {
  const [target, setTarget] = useState<Departure | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: trips } = useSWR(SWR_KEYS.trips, fetchTrips);
  const now = new Date();
  const upcoming = (trips ?? [])
    .filter((trip) => trip.companyId === companyId && new Date(trip.departureDate) > now)
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
    .slice(0, MAX_DEPARTURES);
  const upcomingIds = upcoming.map((trip) => trip.id).join(",");

  const { data: departures, mutate: refreshDepartures } = useSWR(
    trips ? ["upcoming-departures", companyId, upcomingIds] : null,
    () =>
      Promise.all(
        upcoming.map(async (trip) => ({
          id: trip.id,
          route: `${trip.origin} → ${trip.destination}`,
          date: formatDateLabel(toLocalDateISO(new Date(trip.departureDate))),
          time: formatTime(new Date(trip.departureDate)),
          occupancy: await buildOccupancy(trip),
          status: trip.status,
        }))
      )
  );

  const handleConfirm = async (status: ManualTripStatus, newDepartureDate?: string) => {
    if (!target) return;
    setIsSubmitting(true);
    try {
      await updateTripStatus(target.id, status, newDepartureDate);
      toast.success(`Viaje actualizado a "${TRIP_STATUS_LABEL[status]}"`);
      setTarget(null);
      // "trips" es la lista compartida (CompanyKpiRow/QuickActionsCard
      // tambien la usan); la vista derivada de esta card se refresca aparte
      // porque su clave no cambia solo con el nuevo status.
      mutate(SWR_KEYS.trips);
      refreshDepartures();
    } catch (error) {
      toast.error("No se pudo cambiar el estado", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bustix-dark rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-foreground">Próximas salidas</h2>
        </div>

        {departures === undefined ? (
          <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
        ) : departures.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No hay viajes próximos programados.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="font-mono-label text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2 font-normal">Ruta</th>
                  <th className="px-3 py-2 font-normal">Fecha</th>
                  <th className="px-3 py-2 font-normal">Hora</th>
                  <th className="px-3 py-2 font-normal">Ocupación</th>
                  <th className="px-3 py-2 font-normal">Estado</th>
                  <th className="px-3 py-2 font-normal" />
                </tr>
              </thead>
              <tbody>
                {departures.map((departure) => (
                  <tr key={departure.id} className="rounded-lg bg-background">
                    <td className="font-mono-label rounded-l-lg px-3 py-3 font-medium text-foreground">
                      {departure.route}
                    </td>
                    <td className="font-mono-label px-3 py-3 text-muted-foreground">{departure.date}</td>
                    <td className="font-mono-label px-3 py-3 text-foreground">{departure.time}</td>
                    <td className="font-mono-label px-3 py-3 text-muted-foreground">
                      {departure.occupancy}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`font-mono-label inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${TRIP_STATUS_BADGE_CLASSES[departure.status]}`}
                      >
                        {TRIP_STATUS_LABEL[departure.status]}
                      </span>
                    </td>
                    <td className="rounded-r-lg px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setTarget(departure)}
                        className="text-xs font-bold text-accent hover:underline"
                      >
                        Cambiar estado
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {target && (
        <TripStatusModal
          tripRoute={target.route}
          isSubmitting={isSubmitting}
          onConfirm={handleConfirm}
          onClose={() => setTarget(null)}
        />
      )}
    </>
  );
};

export default UpcomingDeparturesBoard;
