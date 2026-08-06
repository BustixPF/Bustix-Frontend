"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchCurrentUser, getDashboardPathForRole } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import {
  consumeReservationRedirect,
  consumePendingPassengers,
} from "@/lib/reservation-redirect";
import LoadingScreen from "@/components/LoadingScreen";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 1. Le pedimos al backend los datos del usuario autenticado vía Cookie / Auth Header
      const profile = await fetchCurrentUser();

      if (cancelled) return;

      // 2. Si no hay perfil, falló la autenticación
      if (!profile) {
        toast.error("No se pudo iniciar sesión con Google");
        router.replace("/auth/login");
        return;
      }

      // 3. Sincronizamos el estado global en AuthContext
      login(profile);
      toast.success("Sesión iniciada con Google");

      // 4. Si el usuario venía intentando reservar un pasaje, respetamos su flujo
      let pendingReservation = consumeReservationRedirect();
      const pendingPassengers = consumePendingPassengers();

      if (pendingReservation && pendingPassengers) {
        if (!/([?&])pasajeros=/.test(pendingReservation)) {
          const sep = pendingReservation.includes("?") ? "&" : "?";
          pendingReservation = `${pendingReservation}${sep}pasajeros=${pendingPassengers}`;
        }
      }

      // 5. Redirigimos a la reserva pendiente o al Dashboard que corresponda según su Rol
      if (pendingReservation) {
        router.replace(pendingReservation);
        return;
      }

      const destination = getDashboardPathForRole(profile.role, profile.companyId);
      if (!destination) {
        toast.error("Tu cuenta no tiene una empresa asociada", {
          description: "Contacta a soporte para vincular tu cuenta a una empresa.",
        });
        router.replace("/");
        return;
      }
      router.replace(destination);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, login]);

  return <LoadingScreen />;
}