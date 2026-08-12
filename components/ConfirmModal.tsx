"use client";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  isSubmitting?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  isSubmitting,
  destructive,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-card-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>

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
            disabled={isSubmitting}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors disabled:opacity-60 ${
              destructive
                ? "bg-destructive text-destructive-foreground hover:opacity-90"
                : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {isSubmitting ? "Guardando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
