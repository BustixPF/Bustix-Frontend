import Link from "next/link";
import AuthSidePanel from "@/components/auth/AuthSidePanel";
import LoginForm from "@/components/forms/login/LoginForm";

const STATS = [
  { value: "60+", label: "Empresas aliadas" },
  { value: "6.000+", label: "Rutas activas" },
  { value: "24/7", label: "Compra en línea" },
];

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <AuthSidePanel
        eyebrow="Terminal digital · Colombia"
        titleLine1="Tu próxima"
        titleAccent="ruta te espera"
        description="Inicia sesión y retoma la compra de tu tiquete en segundos."
        stats={STATS}
      />

      <div className="flex flex-1 items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-10 shadow-xl">
          <div className="flex items-center justify-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="font-display text-lg text-card-foreground">BusTix</span>
          </div>

          <h2 className="mt-6 text-center font-display text-2xl text-card-foreground">
            Inicia sesión
          </h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Bienvenido de nuevo a BusTix
          </p>

          <LoginForm />

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">o continúa con</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-card-foreground transition-colors hover:border-primary"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px] font-bold">
                G
              </span>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-card-foreground transition-colors hover:border-primary"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px] font-bold">
                f
              </span>
              Facebook
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register" className="font-bold text-accent hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}