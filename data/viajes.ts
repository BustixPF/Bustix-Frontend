import {
  fetchTrips,
  fetchTripById as fetchApiTripById,
  fetchRoutes,
  fetchAvailableSeats,
  type ApiTrip,
  type ApiRoute,
} from "@/lib/api";

export interface Trip {
  id: string;
  companyId: string;
  company: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departureDateISO: string;
  seatsAvailable: number;
  price: number;
  totalSeats: number;
}

export function normalizeCityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // quita tildes
    .replace(/\(.*?\)/g, "") // quita "(Ant.)", "(Valle)", etc.
    .trim()
    .toLowerCase();
}

function routeKey(companyId: string, origin: string, destination: string): string {
  return `${companyId}|${normalizeCityName(origin)}|${normalizeCityName(destination)}`;
}

// GET /trips no trae duración ni el nombre de la empresa (solo companyId) —
// se arma un mapa desde /routes (que sí los tiene) para enriquecer cada trip.
// Si una empresa tiene dos rutas iguales (mismo origen/destino), nos quedamos
// con la de menor duración en vez de asumir que no puede pasar.
function buildRouteLookup(routes: ApiRoute[]): Map<string, ApiRoute> {
  const map = new Map<string, ApiRoute>();
  for (const route of routes) {
    const key = routeKey(route.companyId, route.origin, route.destination);
    const existing = map.get(key);
    if (!existing || route.duration < existing.duration) {
      if (existing) {
        console.warn(`Ruta duplicada para ${key}, usando la de menor duración`);
      }
      map.set(key, route);
    }
  }
  return map;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
}

export function formatTime(date: Date): string {
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

async function enrichTrip(trip: ApiTrip, routeLookup: Map<string, ApiRoute>): Promise<Trip> {
  const route = routeLookup.get(routeKey(trip.companyId, trip.origin, trip.destination));
  const departure = new Date(trip.departureDate);
  const durationMinutes = route?.duration ?? 0;
  const arrival = new Date(departure.getTime() + durationMinutes * 60000);
  const seats = await fetchAvailableSeats(trip.id);

  return {
    id: trip.id,
    companyId: trip.companyId,
    company: route?.company.name ?? "—",
    origin: trip.origin,
    destination: trip.destination,
    departureTime: formatTime(departure),
    arrivalTime: formatTime(arrival),
    duration: formatDuration(durationMinutes),
    departureDateISO: trip.departureDate,
    seatsAvailable: seats.length,
    price: Number(trip.price),
    totalSeats: trip.totalSeats,
  };
}

export async function findKnownRoute(origin: string, destination: string): Promise<ApiRoute | undefined> {
  const routes = await fetchRoutes();
  const o = normalizeCityName(origin);
  const d = normalizeCityName(destination);
  return routes.find(
    (route) => normalizeCityName(route.origin) === o && normalizeCityName(route.destination) === d
  );
}

export async function isDateAvailableForRoute(
  origin: string,
  destination: string,
  dateISO: string
): Promise<boolean> {
  const trips = await fetchTrips();
  const o = normalizeCityName(origin);
  const d = normalizeCityName(destination);
  const target = new Date(`${dateISO}T00:00:00`);

  return trips.some((trip) => {
    if (normalizeCityName(trip.origin) !== o || normalizeCityName(trip.destination) !== d) {
      return false;
    }
    const departure = new Date(trip.departureDate);
    return (
      departure.getFullYear() === target.getFullYear() &&
      departure.getMonth() === target.getMonth() &&
      departure.getDate() === target.getDate()
    );
  });
}

export async function getTripsForRoute(origin: string, destination: string): Promise<Trip[]> {
  const [trips, routes] = await Promise.all([fetchTrips(), fetchRoutes()]);
  const o = normalizeCityName(origin);
  const d = normalizeCityName(destination);
  const matching = trips.filter(
    (trip) => normalizeCityName(trip.origin) === o && normalizeCityName(trip.destination) === d
  );
  const routeLookup = buildRouteLookup(routes);
  return Promise.all(matching.map((trip) => enrichTrip(trip, routeLookup)));
}

export async function getTripById(id: string): Promise<Trip | null> {
  const [trip, routes] = await Promise.all([fetchApiTripById(id), fetchRoutes()]);
  if (!trip) return null;
  return enrichTrip(trip, buildRouteLookup(routes));
}

const WEEKDAY_SHORT = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const MONTH_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export interface DateOption {
  iso: string;
  weekday: string;
  day: number;
}

export function buildDateOptions(centerDateISO: string): DateOption[] {
  const center = new Date(`${centerDateISO}T00:00:00`);
  const options: DateOption[] = [];

  for (let offset = -3; offset <= 3; offset++) {
    const date = new Date(center);
    date.setDate(center.getDate() + offset);
    options.push({
      iso: date.toISOString().slice(0, 10),
      weekday: WEEKDAY_SHORT[date.getDay()],
      day: date.getDate(),
    });
  }

  return options;
}

export function formatDateLabel(dateISO: string): string {
  const date = new Date(`${dateISO}T00:00:00`);
  const weekday = WEEKDAY_SHORT[date.getDay()];
  const weekdayCapitalized = weekday.charAt(0) + weekday.slice(1).toLowerCase();
  return `${weekdayCapitalized}. ${date.getDate()} ${MONTH_SHORT[date.getMonth()]}.`;
}

// Grilla de 4 asientos por fila (2 | pasillo | 2) — el backend no tiene
// concepto de piso/tipo de cama, solo un número de asiento plano.
export function seatPositionLabel(seatNumber: number): "Ventana" | "Pasillo" {
  const col = (seatNumber - 1) % 4;
  return col === 0 || col === 3 ? "Ventana" : "Pasillo";
}
