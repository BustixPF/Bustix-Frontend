import Link from "next/link";

export default function PagoCanceladoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-8 text-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
        <p className="font-mono-label text-xs uppercase text-destructive">Pago cancelado</p>
        <h1 className="mt-2 font-display text-2xl text-foreground">No completaste el pago</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No te preocupes, no se hizo ningún cobro. El asiento que habías elegido puede que ya no esté disponible si
          alguien más lo tomó mientras tanto.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
