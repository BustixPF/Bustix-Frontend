"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CompanySidebar from "@/components/company-dashboard/CompanySidebar";
import EditProfileForm from "@/components/forms/profile/EditProfileForm";
import RequireRole from "@/components/auth/RequireRole";
import LoadingScreen from "@/components/LoadingScreen";
import { fetchCompany, type Company } from "@/lib/api";
import { getInitials } from "@/lib/user";
import { useAuth } from "@/components/context/AuthContext";

function CompanyProfileContent() {
  const { companyId } = useParams<{ companyId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.companyId && user.companyId !== companyId) {
      router.replace(`/empresa/dashboard/${user.companyId}`);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const result = await fetchCompany(companyId);
      if (!cancelled) {
        setCompany(result);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [companyId, user?.companyId, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Empresa no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar
        companyId={companyId}
        company={{
          name: company.name,
          initials: getInitials(company.name),
          status: company.status,
          rejectionReason: company.rejectionReason,
        }}
      />

      <main className="min-w-0 flex-1 px-6 py-8 md:px-10 md:py-10">
        <h1 className="font-display text-3xl text-foreground">Editar perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Actualiza los datos personales del administrador de la empresa.
        </p>
        <div className="mt-6 border-t border-border" />

        <EditProfileForm />
      </main>
    </div>
  );
}

export default function CompanyProfilePage() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <CompanyProfileContent />
    </RequireRole>
  );
}
