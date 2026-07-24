"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { companyProfile } from "@/data/companyDashboard";

const NAV_ITEMS = [
  { label: "Panel", href: "/empresa/dashboard" },
  { label: "Rutas", href: "#" },
  { label: "Horarios", href: "#" },
  { label: "Reservas", href: "#" },
  { label: "Reportes", href: "#" },
  { label: "Configuración", href: "#" },
];

const CompanySidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <aside className="bustix-dark sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col overflow-y-auto bg-background px-4 py-6 lg:flex">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === pathname;
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
        <p className="font-mono-label text-xs uppercase text-success">Estado empresa</p>
        <h3 className="mt-4 font-display text-lg text-foreground">{companyProfile.status}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{companyProfile.since}</p>
        <p className="mt-6 font-mono-label text-sm font-bold text-success">
          ✓ {companyProfile.statusNote}
        </p>
      </div>

      <div className="mt-auto border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {companyProfile.initials}
          </span>
          <div>
            <p className="text-sm text-foreground">{companyProfile.name}</p>
            <p className="text-xs text-muted-foreground">{companyProfile.role}</p>
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
    </aside>
  );
};

export default CompanySidebar;
