"use client";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CloseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const MobileDrawer = ({ isOpen, onClose, children }: MobileDrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="bustix-dark absolute left-0 top-0 flex h-full w-[260px] flex-col overflow-y-auto bg-background px-4 py-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="mb-4 flex h-9 w-9 items-center justify-center self-end rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

export default MobileDrawer;
