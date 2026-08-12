"use client";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6 pb-4">
          <div>
            <p id="terms-modal-title" className="font-display text-lg text-card-foreground">
              Términos y condiciones
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Uso de la plataforma BusTix
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
              <span className="font-bold text-card-foreground">Aceptación de los términos.</span>{" "}
              Al crear una cuenta y utilizar BusTix, aceptas estos términos y condiciones en su
              totalidad. Si no estás de acuerdo con alguno de los puntos aquí descritos, te
              pedimos no utilizar la plataforma.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Uso de la plataforma.</span>{" "}
              BusTix es una plataforma digital que te permite consultar rutas, comparar horarios
              y precios, y reservar viajes en bus ofrecidos por empresas de transporte aliadas.
              Te comprometes a usar la plataforma únicamente con fines lícitos y de acuerdo con
              lo previsto en este documento.
            </li>
            <li>
              <span className="font-bold text-card-foreground">
                Registro y responsabilidad de la cuenta.
              </span>{" "}
              Para reservar un viaje debes crear una cuenta con información veraz y actualizada.
              Eres responsable de mantener la confidencialidad de tu contraseña y de todas las
              actividades que ocurran bajo tu cuenta.
            </li>
            <li>
              <span className="font-bold text-card-foreground">
                Consulta, reserva y compra de viajes.
              </span>{" "}
              La información de rutas, horarios, precios y disponibilidad de asientos es
              proporcionada por las empresas de transporte aliadas y puede variar según la
              disponibilidad en el momento de la reserva. BusTix actúa como intermediario entre
              el pasajero y la empresa transportadora.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Pagos.</span> Los pagos realizados
              a través de la plataforma se procesan mediante pasarelas de pago externas. Al
              confirmar una compra, aceptas que el monto correspondiente al valor del tiquete
              (y los cargos aplicables, si los hay) sea cobrado a través del método de pago que
              selecciones.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Cancelaciones y reembolsos.</span>{" "}
              Las condiciones de cancelación y reembolso pueden variar según la empresa
              transportadora y el tipo de tiquete adquirido. Te recomendamos revisar la
              información disponible al momento de tu compra antes de confirmar la reserva.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Responsabilidades del usuario.</span>{" "}
              Te comprometes a proporcionar información correcta al momento de registrarte y
              reservar, a presentarte con la documentación requerida por la empresa
              transportadora, y a hacer un uso adecuado de la plataforma, sin intentar vulnerar
              su funcionamiento o seguridad.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Disponibilidad del servicio.</span>{" "}
              Trabajamos para que la plataforma esté disponible de forma continua, pero no
              garantizamos que el servicio esté libre de interrupciones, errores o
              mantenimientos programados que puedan afectar temporalmente su funcionamiento.
            </li>
            <li>
              <span className="font-bold text-card-foreground">
                Tratamiento de la información.
              </span>{" "}
              La información que nos proporcionas al registrarte (como nombre, documento, correo
              y teléfono) se utiliza para gestionar tu cuenta y tus reservas dentro de la
              plataforma. Nos comprometemos a manejar tus datos de forma responsable y a no
              compartirlos con terceros salvo cuando sea necesario para completar tu reserva.
            </li>
            <li>
              <span className="font-bold text-card-foreground">Contacto y soporte.</span> Si
              tienes dudas sobre estos términos o necesitas ayuda con tu cuenta o tus reservas,
              puedes comunicarte con nosotros a través de los canales de soporte disponibles
              dentro de la plataforma.
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

export default TermsModal;