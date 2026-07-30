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
