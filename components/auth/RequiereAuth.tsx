"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

const VERIFY_DELAY_MS = 500;

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setIsVerifying(false);
      }
    }, VERIFY_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isLoading, user, router]);

  if (isLoading || isVerifying) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default RequireAuth;