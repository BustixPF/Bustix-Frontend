"use client";

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
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-10">
          <h2 className="text-center font-display text-2xl text-card-foreground">
            Inicia sesión
          </h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Bienvenido de nuevo a BusTix
          </p>

          {/* Formulario tradicional (Email / Password) */}
          <LoginForm />

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