import Link from "next/link";

// El Ticket del backend no está vinculado a ningún Trip (no guarda fecha de
// viaje, asiento ni empresa de forma trazable) — no hay manera real de saber
// si un tiquete comprado es "el próximo viaje", así que esta card solo puede
// mostrar el estado vacío por ahora, sin inventar fecha/asiento/QR.
const ActiveTicketCard = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 md:p-8">
      <p className="font-mono-label text-xs uppercase text-muted-foreground">Tiquete activo</p>
      <p className="mt-4 text-sm text-muted-foreground">
        Todavía no tienes ningún tiquete activo.
      </p>
      <Link
        href="/#rutas-populares"
        className="mt-4 inline-flex items-center text-sm font-bold text-accent hover:underline"
      >
        Buscar un viaje →
      </Link>
    </div>
  );
};

export default ActiveTicketCard;
