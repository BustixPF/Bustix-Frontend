"use client";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import MobileDrawer from "@/components/MobileDrawer";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import { useAuth } from "@/components/context/AuthContext";
import Avatar from "@/components/Avatar";
import { fetchDashboardSummary } from "@/lib/api";
import { SWR_KEYS } from "@/lib/swrKeys";

const HamburgerIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </svg>
);

const SuperAdminSidebar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { data: summary } = useSWR(SWR_KEYS.dashboardSummary, fetchDashboardSummary);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    router.push("/");
  };

  const content = (
    <>
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="font-mono-label text-xs uppercase text-primary">Rol</p>
        <h3 className="mt-4 font-display text-lg text-foreground">Super Admin</h3>
        {summary ? (
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Empresas registradas</span>
              <span className="font-bold text-foreground">{summary.companyCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tiquetes vendidos</span>
              <span className="font-bold text-foreground">{summary.ticketCount}</span>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">Acceso a toda la plataforma.</p>
        )}
      </div>

      <div className="mt-auto border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.profilePicture}
            name={user?.name ?? "SA"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
          />
          <div>
            <p className="text-sm text-foreground">{user?.name ?? "Super Admin"}</p>
            <p className="text-xs text-muted-foreground">superAdmin</p>
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

export default SuperAdminSidebar;