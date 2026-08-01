"use client";

import Link from "next/link";
import AuthSidePanel from "@/components/auth/AuthSidePanel";
import LoginForm from "@/components/forms/login/LoginForm";

const GoogleLogo = () => (
  <svg
    className="h-4 w-4 grayscale transition-all duration-200 group-hover:grayscale-0"
    viewBox="0 0 48 48"
    aria-hidden
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const STATS = [
  { value: "60+", label: "Empresas aliadas" },
  { value: "6.000+", label: "Rutas activas" },
  { value: "24/7", label: "Compra en línea" },
];

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Redirige al endpoint de Google en NestJS
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google`;
  };

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
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-10">
          <h2 className="text-center font-display text-2xl text-card-foreground">
            Inicia sesión
          </h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Bienvenido de nuevo a BusTix
          </p>

          {/* Formulario tradicional (Email / Password) */}
          <LoginForm />

          {/* Separador visual */}
          <div className="mt-6 flex items-center gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full border border-border bg-card" />
            <span className="h-px flex-1 border-t border-dashed border-border" />
            <span className="h-2 w-2 rounded-full border border-border bg-card" />
          </div>

          {/* Botón Google OAuth */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="group flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-card-foreground transition-colors hover:border-primary cursor-pointer"
            >
              <GoogleLogo />
              Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-accent hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}