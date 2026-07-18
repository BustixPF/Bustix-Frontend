import Link from "next/link";
import { dashboardUser, featuredRoute } from "@/data/dashboard";
import { formatCOP } from "@/data/home";

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Buscar viaje", href: "/#rutas-populares" },
  { label: "Mis viajes", href: "/cliente/dashboard" },
  { label: "Tiquetes", href: "#" },
  { label: "Perfil", href: "#" },
  { label: "Ayuda", href: "#" },
];

const ACTIVE_HREF = "/cliente/dashboard";

const Sidebar = () => {
  return (
    <aside className="bustix-dark sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col overflow-y-auto bg-background px-4 py-6 lg:flex">
      <div className="flex items-center gap-2 px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="font-display text-lg text-foreground">BusTix</span>
      </div>

      <div className="mt-6 border-t border-border" />

      <nav className="mt-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === ACTIVE_HREF;
          return (
            <Link
              key={item.label}
              href={item.href}
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
        <p className="font-mono-label text-[10.5px] uppercase text-primary">Ruta destacada</p>
        <h3 className="mt-4 font-display text-lg text-foreground">{featuredRoute.destination}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{featuredRoute.description}</p>
        <p className="mt-6 font-mono-label text-sm font-bold text-primary">
          desde {formatCOP(featuredRoute.priceFrom)}
        </p>
      </div>

      <div className="mt-auto border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
            {dashboardUser.initials}
          </span>
          <div>
            <p className="text-sm text-foreground">{dashboardUser.name}</p>
            <p className="text-xs text-muted-foreground">{dashboardUser.role}</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
