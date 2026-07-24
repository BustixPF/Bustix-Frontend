import { companyProfile } from "@/data/companyDashboard";

const CompanyTopBar = () => {
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-foreground">Panel de la empresa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {companyProfile.name} · Gestiona tus rutas y horarios
        </p>
      </div>

      <div className="mt-6 border-t border-border" />
    </div>
  );
};

export default CompanyTopBar;
