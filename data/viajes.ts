export type SeatType = "Convencional" | "Semi-cama" | "Cama";

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
}

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
  },
];

export function getTripsForRoute(_origin: string, _destination: string): Trip[] {
  return MOCK_TRIPS;
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