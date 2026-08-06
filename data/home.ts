export type DepartureStatus = "a-tiempo" | "embarcando";

export interface UpcomingDeparture {
  id: string;
  route: string;
  company: string;
  departureDateLabel: string;
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

const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function weekdayFromDate(dateISO: string): string {
  const parsed = new Date(`${dateISO}T00:00:00`);
  return WEEKDAYS[parsed.getDay()];
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}