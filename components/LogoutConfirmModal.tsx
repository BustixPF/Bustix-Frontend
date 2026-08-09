"use client";

interface LogoutConfirmModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const LogoutConfirmModal = ({ onConfirm, onClose }: LogoutConfirmModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-card-foreground">
          ¿Seguro que deseas cerrar sesión?
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu sesión se cerrará y tendrás que iniciar sesión nuevamente.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground transition-colors hover:border-primary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-destructive px-5 py-2.5 text-sm font-bold text-destructive-foreground transition-colors hover:opacity-90"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
