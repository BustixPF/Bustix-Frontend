import { dashboardUser } from "@/data/dashboard";

const ProfileCard = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-base font-bold text-secondary-foreground">
          {dashboardUser.initials}
        </span>
        <div>
          <h3 className="font-display text-base text-card-foreground">{dashboardUser.name}</h3>
          <p className="text-xs text-muted-foreground">{dashboardUser.email}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <div>
          <p className="text-xs text-muted-foreground">Miembro desde</p>
          <p className="mt-1 text-sm font-bold text-card-foreground">{dashboardUser.memberSince}</p>
        </div>
        <a href="#" className="text-xs font-bold text-accent hover:underline">
          Editar perfil
        </a>
      </div>
    </div>
  );
};

export default ProfileCard;
