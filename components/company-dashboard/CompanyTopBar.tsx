interface CompanyTopBarProps {
  company: { name: string };
}

const CompanyTopBar = ({ company }: CompanyTopBarProps) => {
  return (
    <div>
      <div>
        <h1 className="font-display text-2xl text-foreground sm:text-3xl">Panel de la empresa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {company.name} · Gestiona tus rutas y horarios
        </p>
      </div>

      <div className="mt-6 border-t border-border" />
    </div>
  );
};

export default CompanyTopBar;
