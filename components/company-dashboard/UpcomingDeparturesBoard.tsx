"use client";
import { useEffect, useState } from "react";
import { fetchTrips, fetchAvailableSeats, type ApiTrip } from "@/lib/api";
import { formatTime, formatDateLabel, toLocalDateISO } from "@/data/viajes";

interface Departure {
  id: string;
  route: string;
  date: string;
  time: string;
  occupancy: string;
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
  const [departures, setDepartures] = useState<Departure[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchTrips().then(async (trips) => {
      const now = new Date();
      const upcoming = trips
        .filter((trip) => trip.companyId === companyId && new Date(trip.departureDate) > now)
        .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
        .slice(0, MAX_DEPARTURES);

      const withOccupancy = await Promise.all(
        upcoming.map(async (trip) => ({
          id: trip.id,
          route: `${trip.origin} → ${trip.destination}`,
          date: formatDateLabel(toLocalDateISO(new Date(trip.departureDate))),
          time: formatTime(new Date(trip.departureDate)),
          occupancy: await buildOccupancy(trip),
        }))
      );

      if (!cancelled) setDepartures(withOccupancy);
    });

    return () => {
      cancelled = true;
    };
  }, [companyId]);

  return (
    <div className="bustix-dark rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Próximas salidas</h2>
      </div>

      {departures === null ? (
        <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
      ) : departures.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No hay viajes próximos programados.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="font-mono-label text-xs uppercase text-muted-foreground">
                <th className="px-3 py-2 font-normal">Ruta</th>
                <th className="px-3 py-2 font-normal">Fecha</th>
                <th className="px-3 py-2 font-normal">Hora</th>
                <th className="px-3 py-2 font-normal">Ocupación</th>
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
                  <td className="font-mono-label rounded-r-lg px-3 py-3 text-muted-foreground">
                    {departure.occupancy}
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

export default UpcomingDeparturesBoard;
