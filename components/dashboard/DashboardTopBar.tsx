import { dashboardUser } from "@/data/dashboard";

const BellIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const DashboardTopBar = () => {
  const firstName = dashboardUser.name.split(" ")[0];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Mis viajes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bienvenido de nuevo, {firstName}.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <BellIcon />
            <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </button>

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
            {dashboardUser.initials}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-border" />
    </div>
  );
};

export default DashboardTopBar;
