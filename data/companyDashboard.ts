export interface CompanyProfile {
  name: string;
  initials: string;
  role: string;
  status: string;
  since: string;
  statusNote: string;
}

export const companyProfile: CompanyProfile = {
  name: "Rápido Ochoa",
  initials: "RO",
  role: "Admin de empresa",
  status: "Verificada",
  since: "Operando desde 2019.",
  statusNote: "Cuenta activa",
};

export type KpiTrend = "up" | "neutral";

export interface CompanyKpi {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: KpiTrend;
}

export const companyKpis: CompanyKpi[] = [
  { id: "rutas-activas", label: "Rutas activas", value: "24", helper: "↑ 2 nuevas este mes", trend: "up" },
  { id: "tiquetes-mes", label: "Tiquetes · mes", value: "1.842", helper: "↑ 12% vs. mes anterior", trend: "up" },
  { id: "ingresos-mes", label: "Ingresos · mes", value: "$96.4M", helper: "COP · corte al 16 jul", trend: "neutral" },
  { id: "proxima-salida", label: "Próxima salida", value: "6:30 AM", helper: "Medellín → Bogotá", trend: "neutral" },
];

export type CompanyDepartureStatus = "a-tiempo" | "embarcando" | "retrasado";

export interface CompanyDeparture {
  id: string;
  route: string;
  time: string;
  bus: string;
  occupancy: string;
  status: CompanyDepartureStatus;
}

export const companyDepartures: CompanyDeparture[] = [
  { id: "dep-1", route: "Medellín → Bogotá", time: "6:30 AM", bus: "ABC-123", occupancy: "38/40", status: "a-tiempo" },
  { id: "dep-2", route: "Medellín → Bogotá", time: "2:00 PM", bus: "ABC-456", occupancy: "22/40", status: "a-tiempo" },
  { id: "dep-3", route: "Medellín → Cartagena", time: "8:00 PM", bus: "ABC-789", occupancy: "40/40", status: "embarcando" },
  { id: "dep-4", route: "Medellín → Bogotá", time: "11:00 PM", bus: "ABC-234", occupancy: "15/40", status: "retrasado" },
];

export type PaymentStatus = "pagado" | "pendiente";

export interface RecentBooking {
  id: string;
  passenger: string;
  route: string;
  seat: string;
  payment: PaymentStatus;
}

export const recentBookings: RecentBooking[] = [
  { id: "book-1", passenger: "Camila Restrepo", route: "Medellín → Bogotá", seat: "14", payment: "pagado" },
  { id: "book-2", passenger: "Andrés Gómez", route: "Medellín → Cartagena", seat: "22", payment: "pagado" },
  { id: "book-3", passenger: "Laura Pérez", route: "Medellín → Bogotá", seat: "08", payment: "pendiente" },
  { id: "book-4", passenger: "Julián Ríos", route: "Medellín → Cartagena", seat: "31", payment: "pagado" },
];

export const occupancyAverage = 77;
