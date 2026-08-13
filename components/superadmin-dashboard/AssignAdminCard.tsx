"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchCompaniesWithDocuments,
  fetchCompanies,
  fetchPendingCompanies,
  fetchUsers,
  assignCompanyAdmin,
  updateCompanyActive,
  getApiErrorMessage,
  type Company,
  type AdminUser,
} from "@/lib/api";
import AssignAdminModal from "./AssignAdminModal";
import ConfirmModal from "@/components/ConfirmModal";

const STATUS_LABEL: Record<NonNullable<Company["status"]>, string> = {
  approved: "Aprobada",
  pending: "Pendiente",
  rejected: "Rechazada",
};

const STATUS_BADGE_CLASSES: Record<NonNullable<Company["status"]>, string> = {
  approved: "bg-success/15 text-success",
  pending: "bg-secondary/15 text-secondary",
  rejected: "bg-destructive/15 text-destructive",
};

const AssignAdminCard = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<Company | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTarget, setActiveTarget] = useState<Company | null>(null);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // /dashboard/superadmin/companies trae TODAS las empresas (con
      // documentos) pero sin status/isActive; /companies (aprobadas) y
      // /companies/pending si tienen esos campos - se cruzan por id. Lo que
      // no aparece en ninguna de las dos quedo rechazado (es el unico
      // estado que ningun endpoint devuelve directo).
      const [companiesResult, usersResult, approvedResult, pendingResult] = await Promise.all([
        fetchCompaniesWithDocuments(),
        fetchUsers(1, 100),
        fetchCompanies(),
        fetchPendingCompanies(),
      ]);
      if (cancelled) return;
      const activeById = new Map(approvedResult.map((c) => [c.id, c.isActive ?? true]));
      const statusById = new Map<string, NonNullable<Company["status"]>>([
        ...approvedResult.map((c): [string, "approved"] => [c.id, "approved"]),
        ...pendingResult.map((c): [string, "pending"] => [c.id, "pending"]),
      ]);
      setCompanies(
        companiesResult.map((company) => ({
          ...company,
          isActive: activeById.get(company.id) ?? true,
          status: statusById.get(company.id) ?? "rejected",
        }))
      );
      setUsers(usersResult);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleActive = async () => {
    if (!activeTarget) return;
    const nextActive = !(activeTarget.isActive ?? true);
    setIsTogglingActive(true);
    try {
      const updated = await updateCompanyActive(activeTarget.id, nextActive);
      setCompanies((prev) =>
        (prev ?? []).map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
      );
      toast.success(nextActive ? `${updated.name} fue reactivada` : `${updated.name} fue desactivada`);
      setActiveTarget(null);
    } catch (error) {
      toast.error("No se pudo cambiar el estado", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setIsTogglingActive(false);
    }
  };

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
          <h3 className="font-display text-lg text-card-foreground">Empresas</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Estado de cada empresa, y quién la administra.
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
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-card-foreground">
                      {company.name}
                      {company.status && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${STATUS_BADGE_CLASSES[company.status]}`}
                        >
                          {STATUS_LABEL[company.status]}
                        </span>
                      )}
                      {company.isActive === false && (
                        <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10.5px] font-bold text-destructive">
                          Desactivada
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {admin ? `Admin: ${admin.name} (${admin.email})` : "Sin administrador asignado"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTarget(company)}
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      {admin ? "Reasignar admin" : "Asignar admin"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTarget(company)}
                      className={`text-xs font-bold hover:underline ${
                        company.isActive === false ? "text-success" : "text-destructive"
                      }`}
                    >
                      {company.isActive === false ? "Reactivar" : "Desactivar"}
                    </button>
                  </div>
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

      {activeTarget && (
        <ConfirmModal
          title={activeTarget.isActive === false ? "¿Reactivar empresa?" : "¿Desactivar empresa?"}
          message={
            activeTarget.isActive === false
              ? `${activeTarget.name} y sus administradores van a recuperar el acceso.`
              : `${activeTarget.name} y todos sus administradores van a perder el acceso hasta que la reactives.`
          }
          confirmLabel={activeTarget.isActive === false ? "Reactivar" : "Desactivar"}
          destructive={activeTarget.isActive !== false}
          isSubmitting={isTogglingActive}
          onConfirm={handleToggleActive}
          onClose={() => setActiveTarget(null)}
        />
      )}
    </div>
  );
};

export default AssignAdminCard;
