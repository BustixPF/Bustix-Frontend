"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchCompaniesWithDocuments,
  fetchUsers,
  assignCompanyAdmin,
  getApiErrorMessage,
  type Company,
  type AdminUser,
} from "@/lib/api";
import AssignAdminModal from "./AssignAdminModal";

const AssignAdminCard = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<Company | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [companiesResult, usersResult] = await Promise.all([
        fetchCompaniesWithDocuments(),
        fetchUsers(1, 100),
      ]);
      if (cancelled) return;
      setCompanies(companiesResult);
      setUsers(usersResult);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // No hay endpoint que devuelva "el admin de la empresa X" directo - se
  // infiere cruzando la lista de usuarios por companyId + role admin.
  const adminByCompanyId = new Map(
    users.filter((user) => user.role === "admin" && user.companyId).map((user) => [user.companyId as string, user])
  );

  const handleAssign = async (userId: string) => {
    if (!target) return;
    setIsSubmitting(true);
    try {
      await assignCompanyAdmin(target.id, userId);
      const assignedUser = users.find((user) => user.id === userId);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: "admin", companyId: target.id } : user
        )
      );
      toast.success(
        assignedUser ? `${assignedUser.name} ahora administra ${target.name}` : "Administrador asignado"
      );
      setTarget(null);
    } catch (error) {
      toast.error("No se pudo asignar el administrador", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleCompanies = (companies ?? []).filter((company) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return company.name.toLowerCase().includes(query) || company.nit.toLowerCase().includes(query);
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-card-foreground">Administradores de empresa</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Vincula o reasigna qué usuario administra cada empresa.
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar empresa por nombre o NIT..."
          className="w-full max-w-xs rounded-full border border-border bg-muted px-4 py-2 text-sm text-card-foreground outline-none focus:border-primary"
        />
      </div>

      {companies === null ? (
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : visibleCompanies.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No hay empresas que coincidan.</p>
      ) : (
        <div className="mt-4 max-h-[65vh] overflow-y-auto pr-1">
          <div className="flex flex-col gap-2">
            {visibleCompanies.map((company) => {
              const admin = adminByCompanyId.get(company.id);
              return (
                <div
                  key={company.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{company.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {admin ? `Admin: ${admin.name} (${admin.email})` : "Sin administrador asignado"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTarget(company)}
                    className="shrink-0 text-xs font-bold text-accent hover:underline"
                  >
                    {admin ? "Reasignar admin" : "Asignar admin"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {target && (
        <AssignAdminModal
          company={target}
          users={users.filter((user) => user.role !== "superAdmin")}
          isSubmitting={isSubmitting}
          onConfirm={handleAssign}
          onClose={() => setTarget(null)}
        />
      )}
    </div>
  );
};

export default AssignAdminCard;
