import { dashboardUser } from "@/data/dashboard";

const DashboardTopBar = () => {
  const firstName = dashboardUser.name.split(" ")[0];

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-foreground">Mis viajes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bienvenido de nuevo, {firstName}.
        </p>
      </div>

      <div className="mt-6 border-t border-border" />
    </div>
  );
};

export default DashboardTopBar;
