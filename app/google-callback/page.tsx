"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { fetchCurrentUser, getDashboardPathForRole } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import { consumeReservationRedirect } from "@/lib/reservation-redirect";
import LoadingScreen from "@/components/LoadingScreen";

const GoogleCallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // El backend ya dejó la cookie httpOnly puesta antes de mandarnos acá —
    // este parámetro solo confirma que sí vinimos de un redirect real de Google.
    const token = searchParams.get("token");

    if (!token) {
      toast.error("No se pudo iniciar sesión con Google");
      router.replace("/auth/login");
      return;
    }

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
  }, [searchParams, router, login]);

  return <LoadingScreen />;
};

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}