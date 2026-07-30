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
