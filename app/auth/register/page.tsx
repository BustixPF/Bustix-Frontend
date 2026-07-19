import Link from "next/link";
import AuthSidePanel from "@/components/auth/AuthSidePanel";
import RegisterRoleSwitcher from "@/components/forms/register/RegisterRoleSwitcher";

const STATS = [
  { value: "60+", label: "Empresas aliadas" },
  { value: "6.000+", label: "Rutas activas" },
  { value: "24/7", label: "Compra en línea" },
];

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen">
      <AuthSidePanel
        eyebrow="Terminal digital · Colombia"
        titleLine1="Únete a"
        titleAccent="BusTix hoy"
        description="Crea tu cuenta y compra tiquetes de bus en segundos, sin filas."
        stats={STATS}
      />

      <div className="relative flex flex-1 items-center justify-center bg-background px-6 py-16">
        <Link
          href="/auth/login"
          className="absolute right-6 top-6 text-sm font-semibold text-accent hover:underline"
        >
          Iniciar sesión →
        </Link>

        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-10 shadow-xl">
          <h2 className="text-center font-display text-2xl text-card-foreground">
            Crea tu cuenta
          </h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Compra tiquetes de bus en toda Colombia
          </p>

          <div className="mt-6 flex items-center gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full border border-border bg-card" />
            <span className="h-px flex-1 border-t border-dashed border-border" />
            <span className="h-2 w-2 rounded-full border border-border bg-card" />
          </div>

          <RegisterRoleSwitcher />
        </div>
      </div>
    </main>
  );
}
