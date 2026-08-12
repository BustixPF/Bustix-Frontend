"use client";
import { useState } from "react";
import { getRoleLabel } from "@/lib/user";
import type { AdminUser, UserRole } from "@/lib/api";

const ROLES: UserRole[] = ["user", "admin", "superAdmin"];

interface RoleChangeModalProps {
  user: AdminUser;
  isSubmitting: boolean;
  onConfirm: (role: UserRole) => void;
  onClose: () => void;
}

const RoleChangeModal = ({ user, isSubmitting, onConfirm, onClose }: RoleChangeModalProps) => {
  const [role, setRole] = useState<UserRole>(user.role);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-card-foreground">Cambiar rol</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {user.name} · {user.email}
        </p>

        <label className="mt-4 block">
          <span className="font-mono-label text-xs uppercase text-muted-foreground">
            Nuevo rol
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {getRoleLabel(r)}
              </option>
            ))}
          </select>
        </label>

        <p className="mt-3 text-xs text-muted-foreground">
          El cambio aplica de inmediato — no hace falta que la persona vuelva a iniciar sesión.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground transition-colors hover:border-primary disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(role)}
            disabled={isSubmitting || role === user.role}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Confirmar cambio"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleChangeModal;
