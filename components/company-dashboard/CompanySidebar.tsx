"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MobileDrawer from "@/components/MobileDrawer";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import { useAuth } from "@/components/context/AuthContext";
import type { Company } from "@/lib/api";

const HamburgerIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </svg>
);

const STATUS_CONFIG: Record<
  NonNullable<Company["status"]>,
  { label: string; note: string; className: string }
> = {
  approved: { label: "Aprobada", note: "✓ Cuenta verificada", className: "text-success" },
  pending: { label: "Pendiente", note: "Esperando aprobación del equipo", className: "text-secondary" },
  rejected: { label: "Rechazada", note: "Contacta a soporte", className: "text-destructive" },
};

interface CompanySidebarProps {
  companyId: string;
  company: { name: string; initials: string; status?: Company["status"]; rejectionReason?: string | null };
}

const CompanySidebar = ({ companyId, company }: CompanySidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const dashboardHref = `/empresa/dashboard/${companyId}`;
  const navItems = [
    { label: "Panel", href: dashboardHref },
    { label: "Rutas", href: `${dashboardHref}#rutas` },
    { label: "Horarios", href: `${dashboardHref}#horarios` },
    { label: "Reservas", href: `${dashboardHref}#reservas` },
  ];

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    router.push("/");
  };

  const status = STATUS_CONFIG[company.status ?? "pending"];

  const content = (
    <>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.href === pathname;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "border-l-4 border-primary bg-card font-bold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-primary" : "bg-muted-foreground"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="font-mono-label text-xs uppercase text-muted-foreground">Estado empresa</p>
        <h3 className={`mt-4 font-display text-lg ${status.className}`}>{status.label}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {company.status === "rejected" && company.rejectionReason
            ? company.rejectionReason
            : status.note}
        </p>
      </div>

      <div className="mt-auto border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {company.initials}
          </span>
          <div>
            <p className="text-sm text-foreground">{company.name}</p>
            <p className="text-xs text-muted-foreground">Admin de empresa</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="mt-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
        className="fixed right-4 top-20 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-colors hover:border-primary hover:text-foreground lg:hidden"
      >
        <HamburgerIcon />
      </button>

      <aside className="bustix-dark sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col overflow-y-auto bg-background px-4 py-6 lg:flex">
        {content}
      </aside>

      <MobileDrawer isOpen={isOpen} onClose={closeMenu}>
        {content}
      </MobileDrawer>

      {isLogoutConfirmOpen && (
        <LogoutConfirmModal
          onConfirm={() => {
            setIsLogoutConfirmOpen(false);
            handleLogout();
          }}
          onClose={() => setIsLogoutConfirmOpen(false)}
        />
      )}
    </>
  );
};

export default CompanySidebar;
