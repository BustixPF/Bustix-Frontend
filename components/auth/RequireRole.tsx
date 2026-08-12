"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/context/AuthContext";
import { getDashboardPathForRole } from "@/lib/api";
import LoadingScreen from "@/components/LoadingScreen";

const VERIFY_DELAY_MS = 500;

interface RequireRoleProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RequireRole = ({ allowedRoles, children }: RequireRoleProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const allowedRolesKey = allowedRoles.join(",");

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      if (!allowedRolesKey.split(",").includes(user.role)) {
        const destination = getDashboardPathForRole(user.role, user.companyId);
        if (!destination) {
          toast.error("Tu cuenta no tiene una empresa asociada", {
            description: "Contacta a soporte para vincular tu cuenta a una empresa.",
          });
          router.replace("/");
          return;
        }
        router.replace(destination);
        return;
      }

      setIsVerifying(false);
    }, VERIFY_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isLoading, user, router, allowedRolesKey]);

  if (isLoading || isVerifying) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default RequireRole;
