import { formatCOP } from "@/data/home";

export type KpiTrend = "up" | "neutral";

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: KpiTrend;
}

export interface ActiveTicket {
  route: string;
  company: string;
  busType: string;
  seat: string;
  status: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
}

export type TripStatus = "completado" | "cancelado";

export interface TripHistoryItem {
  id: string;
  route: string;
  company: string;
  date: string;
  status: TripStatus;
}

export type NotificationTone = "primary" | "secondary" | "muted";

export interface DashboardNotification {
  id: string;
  tone: NotificationTone;
  title: string;
  description: string;
}

export interface FeaturedRoute {
  destination: string;
  description: string;
  priceFrom: number;
}

export const dashboardKpis: DashboardKpi[] = [
  { id: "proximo-viaje", label: "Próximo viaje", value: "2 días", helper: "Medellín → Bogotá", trend: "neutral" },
  { id: "viajes-realizados", label: "Viajes realizados", value: "14", helper: "↑ 3 este año", trend: "up" },
  { id: "tiquetes-activos", label: "Tiquetes activos", value: "1", helper: "Listo para viajar", trend: "neutral" },
  { id: "total-ahorrado", label: "Total ahorrado", value: formatCOP(184000), helper: "↑ vs. terminal física", trend: "up" },
];

export const activeTicket: ActiveTicket = {
  route: "Medellín → Bogotá",
  company: "Rápido Ochoa",
  busType: "Bus cama",
  seat: "Puesto 14",
  status: "Confirmado",
  departureTime: "6:30 AM",
  arrivalTime: "3:10 PM",
  date: "18 jul 2026",
};

export const tripHistory: TripHistoryItem[] = [
  { id: "trip-1", route: "Medellín → Bogotá", company: "Rápido Ochoa", date: "02 jun 2026", status: "completado" },
  { id: "trip-2", route: "Bogotá → Girardot", company: "Coomotor", date: "18 may 2026", status: "completado" },
  { id: "trip-3", route: "Medellín → Pereira", company: "Flota Occidental", date: "30 abr 2026", status: "completado" },
  { id: "trip-4", route: "Bogotá → Tunja", company: "Berlinas del Fonce", date: "15 abr 2026", status: "cancelado" },
];

export const dashboardNotifications: DashboardNotification[] = [
  { id: "notif-1", tone: "primary", title: "Tu viaje sale en 2 días", description: "Medellín → Bogotá · 6:30 AM" },
  { id: "notif-2", tone: "secondary", title: "Pago confirmado", description: "Bogotá → Girardot" },
  { id: "notif-3", tone: "muted", title: "Nuevo descuento disponible", description: "10% en rutas a Guatapé" },
];

export const featuredRoute: FeaturedRoute = {
  destination: "Guatapé",
  description: "Escápate el fin de semana.",
  priceFrom: 18500,
};
