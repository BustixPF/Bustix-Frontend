"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MobileDrawer from "@/components/MobileDrawer";
import { useAuth } from "@/components/context/AuthContext";
import { getInitials } from "@/lib/user";

const HamburgerIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </svg>
);

const NAV_ITEMS = [{ label: "Panel", href: "/superadmin/dashboard" }];

const SuperAdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    router.push("/");
  };

  const content = (
    <>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
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
        <p className="font-mono-label text-xs uppercase text-primary">Rol</p>
        <h3 className="mt-4 font-display text-lg text-foreground">Super Admin</h3>
        <p className="mt-1 text-xs text-muted-foreground">Acceso a toda la plataforma.</p>
      </div>

      <div className="mt-auto border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {getInitials(user?.name ?? "SA")}
          </span>
          <div>
            <p className="text-sm text-foreground">{user?.name ?? "Super Admin"}</p>
            <p className="text-xs text-muted-foreground">superAdmin</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
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
    </>
  );
};

export default SuperAdminSidebar;
