import { popularRoutes } from "@/data/home";

export type SeatType = "Convencional" | "Semi-cama" | "Cama";

export type SeatStatus = "disponible" | "ocupado";

export interface Seat {
  id: string;
  status: SeatStatus;
}

export interface SeatRow {
  row: number;
  seats: Seat[];
}

export interface SeatFloor {
  floor: number;
  seatType: SeatType;
  rows: SeatRow[];
}

export interface Trip {
  id: string;
  company: string;
  busType: string;
  seatType: SeatType;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  seatsAvailable: number;
  price: number;
  totalSeats: number;
  floorsCount: number;
  seatMap: SeatFloor[];
}

const SEAT_LETTERS = ["A", "B", "C", "D"];

// Cada bus declara su propio layout (filas, asientos por fila, pisos) — no hay
// una plantilla única, distintas empresas y buses tienen configuraciones distintas.
function buildFloor(
  floor: number,
  seatType: SeatType,
  rowsCount: number,
  seatsPerRow: number,
  defaultStatus: SeatStatus,
  overrides: Record<string, SeatStatus> = {}
): SeatFloor {
  const letters = SEAT_LETTERS.slice(0, seatsPerRow);
  const rows: SeatRow[] = [];

  for (let row = 1; row <= rowsCount; row++) {
    const seats: Seat[] = letters.map((letter) => {
      const id = `${row}${letter}`;
      return { id, status: overrides[id] ?? defaultStatus };
    });
    rows.push({ row, seats });
  }

  return { floor, seatType, rows };
}

function totalSeatsOf(floors: SeatFloor[]): number {
  return floors.reduce(
    (sum, floor) => sum + floor.rows.reduce((rowSum, row) => rowSum + row.seats.length, 0),
    0
  );
}

const trip1Seats: SeatFloor[] = [
  buildFloor(1, "Semi-cama", 10, 4, "ocupado", {
    "1A": "disponible",
    "1B": "disponible",
    "1C": "disponible",
    "1D": "disponible",
    "2A": "disponible",
    "2B": "disponible",
    "4A": "disponible",
    "4B": "disponible",
  }),
  buildFloor(2, "Cama", 6, 3, "ocupado", {
    "1A": "disponible",
    "2C": "disponible",
    "3A": "disponible",
    "3B": "disponible",
  }),
];

const trip2Seats: SeatFloor[] = [
  buildFloor(1, "Convencional", 10, 4, "disponible", {
    "1A": "ocupado",
    "1B": "ocupado",
    "2C": "ocupado",
    "2D": "ocupado",
    "3A": "ocupado",
    "4B": "ocupado",
    "4C": "ocupado",
    "5A": "ocupado",
    "5D": "ocupado",
    "6B": "ocupado",
    "6C": "ocupado",
    "7A": "ocupado",
    "7D": "ocupado",
    "8B": "ocupado",
    "8C": "ocupado",
    "9A": "ocupado",
    "9D": "ocupado",
    "10B": "ocupado",
    "10C": "ocupado",
  }),
];

const trip3Seats: SeatFloor[] = [
  buildFloor(1, "Cama", 8, 3, "ocupado", {
    "1A": "disponible",
    "4B": "disponible",
  }),
  buildFloor(2, "Cama", 8, 3, "ocupado", {
    "2C": "disponible",
    "5A": "disponible",
    "6B": "disponible",
    "7A": "disponible",
  }),
];

const trip4Seats: SeatFloor[] = [
  buildFloor(1, "Semi-cama", 8, 4, "ocupado", {
    "3B": "disponible",
  }),
  buildFloor(2, "Semi-cama", 6, 4, "ocupado", {
    "2A": "disponible",
    "5D": "disponible",
  }),
];

const MOCK_TRIPS: Trip[] = [
  {
    id: "trip-1",
    company: "Rápido Ochoa",
    busType: "Bus doble piso",
    seatType: "Semi-cama",
    departureTime: "6:30 AM",
    arrivalTime: "3:00 PM",
    duration: "8h 30m",
    seatsAvailable: 14,
    price: 62000,
    totalSeats: totalSeatsOf(trip1Seats),
    floorsCount: trip1Seats.length,
    seatMap: trip1Seats,
  },
  {
    id: "trip-2",
    company: "Coomotor",
    busType: "Bus sencillo",
    seatType: "Convencional",
    departureTime: "7:15 AM",
    arrivalTime: "4:25 PM",
    duration: "9h 10m",
    seatsAvailable: 21,
    price: 58000,
    totalSeats: totalSeatsOf(trip2Seats),
    floorsCount: trip2Seats.length,
    seatMap: trip2Seats,
  },
  {
    id: "trip-3",
    company: "Flota Occidental",
    busType: "Bus doble piso",
    seatType: "Cama",
    departureTime: "9:00 AM",
    arrivalTime: "5:05 PM",
    duration: "8h 05m",
    seatsAvailable: 6,
    price: 81000,
    totalSeats: totalSeatsOf(trip3Seats),
    floorsCount: trip3Seats.length,
    seatMap: trip3Seats,
  },
  {
    id: "trip-4",
    company: "Berlinas del Fonce",
    busType: "Bus doble piso",
    seatType: "Semi-cama",
    departureTime: "10:45 PM",
    arrivalTime: "7:25 AM",
    duration: "8h 40m",
    seatsAvailable: 3,
    price: 65000,
    totalSeats: totalSeatsOf(trip4Seats),
    floorsCount: trip4Seats.length,
    seatMap: trip4Seats,
  },
];

const WEEKDAY_FULL = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function normalizeCityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/\(.*?\)/g, "") // quita "(Ant.)", "(Valle)", etc.
    .trim()
    .toLowerCase();
}

export function findKnownRoute(origin: string, destination: string) {
  const o = normalizeCityName(origin);
  const d = normalizeCityName(destination);
  return popularRoutes.find(
    (route) => normalizeCityName(route.origin) === o && normalizeCityName(route.destination) === d
  );
}

export function isDateAvailableForRoute(origin: string, destination: string, dateISO: string): boolean {
  const route = findKnownRoute(origin, destination);
  if (!route) return false;
  const weekday = WEEKDAY_FULL[new Date(`${dateISO}T00:00:00`).getDay()];
  return route.availableDays.includes(weekday);
}

export function getTripsForRoute(origin: string, destination: string): Trip[] {
  return findKnownRoute(origin, destination) ? MOCK_TRIPS : [];
}

export function getTripById(id: string): Trip | undefined {
  return MOCK_TRIPS.find((trip) => trip.id === id);
}

export const TOTAL_COMPANIES_LABEL = 18;

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

export function seatPositionLabel(seatId: string, seatsPerRow: number): "Ventana" | "Pasillo" {
  const letterIndex = SEAT_LETTERS.indexOf(seatId.slice(-1));
  return letterIndex === 0 || letterIndex === seatsPerRow - 1 ? "Ventana" : "Pasillo";
}