"use client";

import { useAuth } from "@/components/context/AuthContext";

const DashboardTopBar = () => {
  const { user, isLoading } = useAuth(); // Asumiendo que AuthContext provee estado de carga

  // 1. Estado mientras se carga la sesión
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-64 rounded bg-muted" />
        <div className="mt-6 border-t border-border" />
      </div>
    );
  }

  // 2. Si no hay usuario autenticado, no renderiza nada
  if (!user) return null;

  // 3. Extracción segura del primer nombre con Optional Chaining y Fallback
  const rawFirstName = user.name?.trim().split(/\s+/)[0];

  // 4. Capitalizar primera letra (ej: "juan" -> "Juan")
  const firstName = rawFirstName
    ? rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1).toLowerCase()
    : "Usuario";

  return (
    <header className="w-full">
      <div>
        <h1 className="font-display text-2xl text-foreground sm:text-3xl">
          Mis viajes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bienvenido de nuevo, <span className="font-medium text-foreground">{firstName}</span>.
        </p>
      </div>

      <div className="mt-6 border-t border-border" />
    </header>
  );
};

export default DashboardTopBar;
