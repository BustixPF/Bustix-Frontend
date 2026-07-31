"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchCurrentUser, getDashboardPathForRole } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import { consumeReservationRedirect } from "@/lib/reservation-redirect";
import LoadingScreen from "@/components/LoadingScreen";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // Para cuando llegamos acá, el backend ya dejó la cookie httpOnly puesta
    // (vía /api/auth/google/complete, same-site con el front) — no hace falta
    // ningún dato en la URL, solo preguntarle al backend quién quedó logueado.
    let cancelled = false;

    (async () => {
      const profile = await fetchCurrentUser();

      if (cancelled) return;

      if (!profile) {
        toast.error("No se pudo iniciar sesión con Google");
        router.replace("/auth/login");
        return;
      }

      login(profile);
      toast.success("Sesión iniciada con Google");

      const pendingReservation = consumeReservationRedirect();
      router.replace(pendingReservation ?? getDashboardPathForRole(profile.role));
    })();

    return () => {
      cancelled = true;
    };
  }, [router, login]);

  return <LoadingScreen />;
}