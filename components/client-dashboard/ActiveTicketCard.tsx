import { activeTicket } from "@/data/dashboard";

const QrCodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10"
    aria-hidden
  >
    <path d="M4 4h6v6H4z" />
    <path d="M14 4h6v6h-6z" />
    <path d="M4 14h6v6H4z" />
    <path d="M10 14h2v2h-2z" />
    <path d="M14 10h2v2h-2z" />
    <path d="M18 14h2v2h-2z" />
    <path d="M18 18h2v2h-2z" />
  </svg>
);

const ActiveTicketCard = () => {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm md:p-8">
      <div className="flex items-start justify-between">
        <p className="font-mono-label text-xs uppercase text-muted-foreground">Tiquete activo</p>
        <span className="rounded-full bg-secondary/15 px-4 py-1 text-xs font-bold text-secondary">
          {activeTicket.status.toUpperCase()}
        </span>
      </div>

      <h2 className="mt-5 font-display text-2xl text-card-foreground sm:text-3xl">
        {activeTicket.route}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {activeTicket.company} · {activeTicket.busType} · {activeTicket.seat}
      </p>

      <div className="relative mt-8 flex items-center" aria-hidden="true">
        <span className="absolute -left-8 h-4 w-4 rounded-full bg-background md:-left-10" />
        <span className="h-0.5 w-full border-t-2 border-dashed border-border" />
        <span className="absolute -right-8 h-4 w-4 rounded-full bg-background md:-right-10" />
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
              Salida
            </p>
            <p className="mt-2 font-display text-lg text-card-foreground">
              {activeTicket.departureTime}
            </p>
          </div>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
              Llegada
            </p>
            <p className="mt-2 font-display text-lg text-card-foreground">
              {activeTicket.arrivalTime}
            </p>
          </div>
          <div>
            <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
              Fecha
            </p>
            <p className="mt-2 font-display text-lg text-card-foreground">{activeTicket.date}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
            <QrCodeIcon />
          </div>
          <p className="font-mono-label text-[10px] text-muted-foreground">Código QR</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveTicketCard;
