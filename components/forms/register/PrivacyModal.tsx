"use client";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6 pb-4">
          <div>
            <p id="privacy-modal-title" className="font-display text-lg text-card-foreground">
              Política de privacidad
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tratamiento de tu información en BusTix
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 text-sm text-muted-foreground">
          <ol className="list-decimal space-y-4 pl-4 marker:font-bold marker:text-card-foreground">
            <li>
              <span className="font-bold text-card-foreground">Qué información recopilamos.</span>{" "}
              Cuando creas una cuenta en BusTix recopilamos la información que nos proporcionas
              directamente: nombre, número de documento, correo electrónico, teléfono y, si
              aplica, la información de la empresa que registras. También guardamos la
              información asociada a tus reservas y viajes dentro de la plataforma.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Para qué usamos tu información.</span>{" "}
              Usamos tus datos para crear y administrar tu cuenta, gestionar tus reservas y
              compras de tiquetes, comunicarnos contigo sobre el estado de tus viajes, y mejorar
              el funcionamiento general de la plataforma.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Con quién compartimos tu información.</span>{" "}
              Tu información se comparte únicamente con la empresa transportadora correspondiente
              cuando es necesario para completar y gestionar tu reserva. No vendemos ni cedemos
              tus datos a terceros con fines comerciales.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Pagos.</span> Los datos de pago se
              procesan a través de pasarelas de pago externas; BusTix no almacena la información
              completa de tus métodos de pago en sus propios servidores.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Seguridad de la información.</span>{" "}
              Tomamos medidas razonables para proteger tu información dentro de la plataforma,
              como el uso de contraseñas cifradas y conexiones seguras. Sin embargo, ningún
              sistema es completamente infalible, y te recomendamos mantener tus credenciales de
              acceso en un lugar seguro.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Tus derechos sobre tus datos.</span>{" "}
              Puedes solicitar acceder, actualizar o corregir la información de tu cuenta en
              cualquier momento a través de tu perfil dentro de la plataforma, o contactando a
              nuestro equipo de soporte.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Conservación de la información.</span>{" "}
              Conservamos tu información mientras tu cuenta permanezca activa, o mientras sea
              necesario para cumplir con las finalidades descritas en esta política.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Cambios en esta política.</span>{" "}
              Esta política puede actualizarse a medida que la plataforma evolucione. Te
              recomendamos revisarla periódicamente.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Contacto.</span> Si tienes
              preguntas sobre el tratamiento de tu información, puedes comunicarte con nosotros a
              través de los canales de soporte disponibles dentro de la plataforma.
            </li>
          </ol>

          <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground/80">
            Última actualización: 7 de agosto de 2026.
          </p>
        </div>

        <div className="flex justify-end border-t border-border p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
