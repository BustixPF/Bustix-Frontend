"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { formatCOP } from "@/data/home";
import { useAuth } from "@/components/context/AuthContext";
import { getInitials, getRoleLabel } from "@/lib/user";
import MobileDrawer from "@/components/MobileDrawer";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import { fetchRoutes, type ApiRoute } from "@/lib/api";

const HamburgerIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </svg>
);

const NAV_ITEMS = [
  { label: "Buscar viaje", href: "/#rutas-populares" },
  { label: "Mis viajes", href: "/cliente/dashboard" },
  { label: "Perfil", href: "/cliente/perfil" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [featuredRoute, setFeaturedRoute] = useState<ApiRoute | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const routes = await fetchRoutes();
      if (cancelled) return;
      // "Destacada" = la más barata entre las rutas reales — no hay ningún
      // concepto de "ruta destacada" en el backend, así que se usa el
      // criterio más defendible en vez de inventar uno.
      const cheapest = routes.reduce<ApiRoute | null>((min, route) => {
        if (!min) return route;
        return Number(route.price) < Number(min.price) ? route : min;
      }, null);
      setFeaturedRoute(cheapest);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    router.push("/");
  };

  if (!user) return null;

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

      {featuredRoute ? (
        <Link
          href={`/viajes?origen=${encodeURIComponent(featuredRoute.origin)}&destino=${encodeURIComponent(featuredRoute.destination)}`}
          onClick={closeMenu}
          className="mt-6 block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
        >
          <p className="font-mono-label text-xs uppercase text-success">Ruta destacada</p>
          <h3 className="mt-4 font-display text-lg text-foreground">
            {featuredRoute.origin} → {featuredRoute.destination}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">Con {featuredRoute.company.name}</p>
          <p className="mt-6 font-mono-label text-sm font-bold text-primary">
            desde {formatCOP(Number(featuredRoute.price))}
          </p>
        </Link>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="font-mono-label text-xs uppercase text-success">Ruta destacada</p>
          <p className="mt-4 text-sm text-muted-foreground">Todavía no hay rutas disponibles.</p>
        </div>
      )}

      <div className="mt-auto border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
            {getInitials(user.name)}
          </span>
          <div>
            <p className="text-sm text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</p>
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

export default Sidebar;