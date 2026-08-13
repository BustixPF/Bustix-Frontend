"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import {
  fetchUsers,
  changeUserRole,
  updateUserActive,
  getApiErrorMessage,
  type AdminUser,
  type UserRole,
} from "@/lib/api";
import { SWR_KEYS } from "@/lib/swrKeys";
import { getRoleLabel } from "@/lib/user";
import Avatar from "@/components/Avatar";
import ConfirmModal from "@/components/ConfirmModal";
import RoleChangeModal from "./RoleChangeModal";

const PAGE_SIZE = 15;

const UsersManagementCard = () => {
  // Misma clave/fetcher que AssignAdminCard - comparten la lista de
  // usuarios en cache, y la paginacion ahora es en memoria sobre esos
  // mismos 100 (en vez de pedir una pagina nueva al back cada vez).
  const { data: allUsers } = useSWR(SWR_KEYS.adminUsers, () => fetchUsers(1, 100));
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [activeTarget, setActiveTarget] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  const handleChangeRole = async (role: UserRole) => {
    if (!target) return;
    setIsSubmitting(true);
    try {
      const updated = await changeUserRole(target.id, role);
      mutate(SWR_KEYS.adminUsers);
      toast.success(`${updated.name} ahora es ${getRoleLabel(updated.role)}`);
      setTarget(null);
    } catch (error) {
      toast.error("No se pudo cambiar el rol", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!activeTarget) return;
    const nextActive = !(activeTarget.isActive ?? true);
    setIsTogglingActive(true);
    try {
      const updated = await updateUserActive(activeTarget.id, nextActive);
      mutate(SWR_KEYS.adminUsers);
      toast.success(nextActive ? `${updated.name} fue reactivado` : `${updated.name} fue desactivado`);
      setActiveTarget(null);
    } catch (error) {
      toast.error("No se pudo cambiar el estado", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setIsTogglingActive(false);
    }
  };

  const filteredUsers = (allUsers ?? []).filter((u) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
  });
  const users = allUsers ?? null;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-card-foreground">Usuarios</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Todas las cuentas registradas en la plataforma.
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="w-full max-w-xs rounded-full border border-border bg-muted px-4 py-2 text-sm text-card-foreground outline-none focus:border-primary"
        />
      </div>

      {users === null ? (
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : visibleUsers.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No hay usuarios que coincidan.</p>
      ) : (
        <div className="mt-4 max-h-[65vh] overflow-y-auto pr-1">
          <div className="flex flex-col gap-2">
            {visibleUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar
                    src={user.profilePicture}
                    name={user.name}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      user.isActive === false
                        ? "bg-destructive/15 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getRoleLabel(user.role)}
                    {user.isActive === false ? " · Desactivado" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTarget(user)}
                    className="text-xs font-bold text-accent hover:underline"
                  >
                    Cambiar rol
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTarget(user)}
                    className={`text-xs font-bold hover:underline ${
                      user.isActive === false ? "text-success" : "text-destructive"
                    }`}
                  >
                    {user.isActive === false ? "Reactivar" : "Desactivar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-card-foreground transition-colors hover:border-primary disabled:opacity-40"
        >
          Anterior
        </button>
        <span className="text-xs text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-card-foreground transition-colors hover:border-primary disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

      {target && (
        <RoleChangeModal
          user={target}
          isSubmitting={isSubmitting}
          onConfirm={handleChangeRole}
          onClose={() => setTarget(null)}
        />
      )}

      {activeTarget && (
        <ConfirmModal
          title={activeTarget.isActive === false ? "¿Reactivar usuario?" : "¿Desactivar usuario?"}
          message={
            activeTarget.isActive === false
              ? `${activeTarget.name} va a poder iniciar sesión de nuevo.`
              : `${activeTarget.name} no va a poder iniciar sesión hasta que lo reactives.`
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

export default UsersManagementCard;
