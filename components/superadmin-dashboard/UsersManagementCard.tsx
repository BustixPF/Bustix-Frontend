"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchUsers,
  changeUserRole,
  getApiErrorMessage,
  type AdminUser,
  type UserRole,
} from "@/lib/api";
import { getInitials, getRoleLabel } from "@/lib/user";
import RoleChangeModal from "./RoleChangeModal";

const PAGE_SIZE = 15;

const UsersManagementCard = () => {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setUsers(null);
      const result = await fetchUsers(page, PAGE_SIZE);
      if (!cancelled) setUsers(result);
    })();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const handleChangeRole = async (role: UserRole) => {
    if (!target) return;
    setIsSubmitting(true);
    try {
      const updated = await changeUserRole(target.id, role);
      setUsers((prev) => (prev ?? []).map((u) => (u.id === updated.id ? updated : u)));
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

  const visibleUsers = (users ?? []).filter((u) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
  });

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
          onChange={(e) => setSearch(e.target.value)}
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
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    {getInitials(user.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                    {getRoleLabel(user.role)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTarget(user)}
                    className="text-xs font-bold text-accent hover:underline"
                  >
                    Cambiar rol
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
          disabled={page === 1}
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-card-foreground transition-colors hover:border-primary disabled:opacity-40"
        >
          Anterior
        </button>
        <span className="text-xs text-muted-foreground">Página {page}</span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={!users || users.length < PAGE_SIZE}
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
    </div>
  );
};

export default UsersManagementCard;
