"use client";
import { useState } from "react";

interface RejectCompanyModalProps {
  companyName: string;
  isSubmitting: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const RejectCompanyModal = ({
  companyName,
  isSubmitting,
  onConfirm,
  onClose,
}: RejectCompanyModalProps) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-card-foreground">Rechazar {companyName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Puedes dejar un motivo (opcional) que se enviará por correo a la empresa.
        </p>

        <label className="mt-4 block">
          <span className="font-mono-label text-xs uppercase text-muted-foreground">Motivo</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Documentación incompleta, NIT inválido, etc."
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
            onClick={() => onConfirm(reason.trim())}
            disabled={isSubmitting}
            className="rounded-full bg-destructive px-5 py-2.5 text-sm font-bold text-destructive-foreground transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Rechazando..." : "Rechazar solicitud"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectCompanyModal;
