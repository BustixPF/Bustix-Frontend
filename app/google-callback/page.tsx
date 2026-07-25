"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  decodeJwtPayload,
  fetchUserProfile,
  getDashboardPathForRole,
  getRoleFromPayload,
  getUserIdFromPayload,
  TOKEN_STORAGE_KEY,
} from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

const GoogleCallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const name = searchParams.get("name");

    if (!token) {
      toast.error("No se pudo iniciar sesión con Google");
      router.replace("/auth/login");
      return;
    }

    let cancelled = false;

    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);

    (async () => {
      const payload = decodeJwtPayload(token);
      const profile = await fetchUserProfile(token);
      const role = profile?.role ?? getRoleFromPayload(payload) ?? "user";

      if (cancelled) return;

      login(
        profile ?? {
          id: getUserIdFromPayload(payload) ?? "",
          name: name ?? email ?? "",
          email: email ?? "",
          role,
        }
      );
      toast.success("Sesión iniciada con Google");
      router.replace(getDashboardPathForRole(role));
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
