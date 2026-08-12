import type { TripStatus } from "@/lib/api";

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  A_TIEMPO: "A tiempo",
  EMBARCANDO: "Embarcando",
  EN_RUTA: "En ruta",
  SALIO: "Salió",
  LLEGÓ: "Llegó",
  RETRASADO: "Retrasado",
  CANCELADO: "Cancelado",
  REPROGRAMADO: "Reprogramado",
};

// destructive y accent son literalmente el mismo color en el tema (coral) -
// se evita usar ambos para estados distintos porque se verían iguales.
export const TRIP_STATUS_BADGE_CLASSES: Record<TripStatus, string> = {
  A_TIEMPO: "bg-success/15 text-success",
  LLEGÓ: "bg-success/15 text-success",
  EMBARCANDO: "bg-secondary/15 text-secondary",
  EN_RUTA: "bg-secondary/15 text-secondary",
  SALIO: "bg-muted text-muted-foreground",
  RETRASADO: "bg-primary/15 text-primary",
  REPROGRAMADO: "bg-primary/15 text-primary",
  CANCELADO: "bg-destructive/15 text-destructive",
};

export const TRIP_STATUS_TEXT_CLASSES: Record<TripStatus, string> = {
  A_TIEMPO: "text-success",
  LLEGÓ: "text-success",
  EMBARCANDO: "text-secondary",
  EN_RUTA: "text-secondary",
  SALIO: "text-muted-foreground",
  RETRASADO: "text-primary",
  REPROGRAMADO: "text-primary",
  CANCELADO: "text-destructive",
};

// Los unicos estados que un Admin/superAdmin puede setear a mano - el resto
// los calcula solo el cron del backend segun la hora de salida.
export const MANUAL_TRIP_STATUSES: TripStatus[] = ["CANCELADO", "RETRASADO", "REPROGRAMADO"];
