const SuperAdminTopBar = () => {
  return (
    <div>
      <div>
        <h1 className="font-display text-2xl text-foreground sm:text-3xl">Panel de super admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visión general de la plataforma y aprobación de empresas
        </p>
      </div>

      <div className="mt-6 border-t border-border" />
    </div>
  );
};

export default SuperAdminTopBar;
