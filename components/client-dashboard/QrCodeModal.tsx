"use client";
import { QRCodeSVG } from "qrcode.react";

interface QrCodeModalProps {
  isOpen: boolean;
  value: string;
  title: string;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const QrCodeModal = ({ isOpen, value, title, onClose }: QrCodeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div className="relative flex max-h-[90vh] w-full max-w-xs flex-col items-center overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <CloseIcon />
        </button>

        <p className="mt-2 text-center font-display text-lg text-card-foreground">{title}</p>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Presenta este código al abordar
        </p>

        <div className="mt-6 flex h-56 w-56 items-center justify-center rounded-lg bg-white p-3">
          <QRCodeSVG value={value} size={200} bgColor="#ffffff" fgColor="#000000" level="M" />
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;
