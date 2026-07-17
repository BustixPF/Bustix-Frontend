export interface PopularRoute {
  id: string;
  origin: string;
  destination: string;
  companiesCount: number;
  durationFrom: string;
  price: number;
}

export type DepartureStatus = "a-tiempo" | "embarcando";

export interface UpcomingDeparture {
  id: string;
  route: string;
  company: string;
  departureTime: string;
  status: DepartureStatus;
}

export type BenefitIcon = "compare" | "payment" | "seats" | "ticket" | "support";

export interface Benefit {
  id: string;
  icon: BenefitIcon;
  title: string;
  description: string;
  highlighted?: boolean;
}

export interface HowItWorksStep {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
}

export interface Partner {
  id: string;
  name: string;
}

export const popularRoutes: PopularRoute[] = [
  { id: "medellin-cali", origin: "Medellín", destination: "Cali", companiesCount: 10, durationFrom: "8h 00m", price: 62000 },
  { id: "cali-pasto", origin: "cali", destination: "pasto", companiesCount: 12, durationFrom: "10h 00m", price: 28000 },
  { id: "cartagena-barranquilla", origin: "cartagena", destination: "barranquilla", companiesCount: 6, durationFrom: "2h 30m", price: 18500 },
  { id: "bogota-bucaramanga", origin: "Bogotá", destination: "Bucaramanga", companiesCount: 8, durationFrom: "9h 00m", price: 71000 },
];

export const upcomingDepartures: UpcomingDeparture[] = [
  { id: "dep-1", route: "Medellín → Bogotá", company: "Rápido Ochoa", departureTime: "4:30 PM", status: "a-tiempo" },
  { id: "dep-2", route: "Bogotá → Girardot", company: "Coocotal", departureTime: "7:15 AM", status: "a-tiempo" },
  { id: "dep-3", route: "Bucaramanga → Pereira", company: "Flota Occidental", departureTime: "5:00 PM", status: "embarcando" },
  { id: "dep-4", route: "Bogotá → Tunja", company: "Berlinas del Fonce", departureTime: "8:45 AM", status: "a-tiempo" },
];

export const benefits: Benefit[] = [
  { id: "compare", icon: "compare", title: "Compara empresas", description: "Todos los operadores en un solo lugar." },
  { id: "payment", icon: "payment", title: "Pago seguro", description: "Procesamos tu pago con múltiples métodos." },
  { id: "seats", icon: "seats", title: "Asientos en tiempo real", description: "Disponibilidad real de cada bus, sin sobreventa." },
  { id: "ticket", icon: "ticket", title: "Ticket QR", description: "Tu tiquete va contigo en el celular, sin filas." },
  { id: "support", icon: "support", title: "Soporte", description: "Acompañamiento antes, durante y después del viaje." },
];

export const howItWorksSteps: HowItWorksStep[] = [
  { id: "buscar", number: "01", label: "Buscar", title: "Elige tu ruta y fecha", description: "Compara en un solo vistazo precios y tiempos de viaje entre todas las empresas." },
  { id: "elegir", number: "02", label: "Elegir", title: "Selecciona tu silla", description: "Mira el mapa del bus real y escoge el puesto que más te acomode, sin sorpresas." },
  { id: "recibir", number: "03", label: "Recibir", title: "Recibe tu tiquete digital", description: "Te llega tu código QR y tu tiquete a tu correo, ya lo puedes presentar en la terminal." },
];

export const partners: Partner[] = [
  { id: "expreso", name: "Expreso" },
  { id: "coocotal", name: "Coocotal" },
  { id: "rapido-ochoa", name: "Rápido Ochoa" },
  { id: "flota-occidental", name: "Flota Occidental" },
  { id: "berlinas-del-fonce", name: "Berlinas del Fonce" },
];

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}