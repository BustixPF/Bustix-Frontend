"use client";
import { useState } from "react";
import type { AdminUser, Company } from "@/lib/api";
import { getRoleLabel } from "@/lib/user";
import Avatar from "@/components/Avatar";

interface AssignAdminModalProps {
  company: Company;
  users: AdminUser[];
  isSubmitting: boolean;
  onConfirm: (userId: string) => void;
  onClose: () => void;
}

const AssignAdminModal = ({ company, users, isSubmitting, onConfirm, onClose }: AssignAdminModalProps) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-card-foreground">Asignar administrador</h3>
        <p className="mt-1 text-sm text-muted-foreground">{company.name}</p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="mt-4 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />

        <div className="mt-3 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            {visibleUsers.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">No hay usuarios que coincidan.</p>
            ) : (
              visibleUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedId(user.id)}
                  className={`flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                    selectedId === user.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <Avatar
                    src={user.profilePicture}
                    name={user.name}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email} · {getRoleLabel(user.role)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Esto convierte al usuario elegido en administrador de {company.name}, sin importar su rol actual.
        </p>

        <div className="mt-4 flex justify-end gap-3">
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
            onClick={() => selectedId && onConfirm(selectedId)}
            disabled={isSubmitting || !selectedId}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignAdminModal;
