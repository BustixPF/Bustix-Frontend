"use client";
import { useState } from "react";

interface DeleteAccountModalProps {
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const CONFIRM_WORD = "ELIMINAR";

const DeleteAccountModal = ({ isSubmitting, onConfirm, onClose }: DeleteAccountModalProps) => {
  const [confirmText, setConfirmText] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-card-foreground">¿Eliminar tu cuenta?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Esta acción es permanente: perderás el acceso a tu cuenta y a tu historial de compras.
          No se puede deshacer.
        </p>

        <label className="mt-4 block">
          <span className="font-mono-label text-xs uppercase text-muted-foreground">
            Escribe {CONFIRM_WORD} para confirmar
          </span>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
          />
        </label>

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
            onClick={onConfirm}
            disabled={isSubmitting || confirmText !== CONFIRM_WORD}
            className="rounded-full bg-destructive px-5 py-2.5 text-sm font-bold text-destructive-foreground transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Eliminando..." : "Eliminar cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
