"use client";
import Link from "next/link";
import { useAuth } from "@/components/context/AuthContext";
import { getInitials, getRoleLabel } from "@/lib/user";

const ProfileCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-base font-bold text-secondary-foreground">
          {getInitials(user.name)}
        </span>
        <div>
          <h3 className="font-display text-base text-card-foreground">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <div>
          <p className="text-xs text-muted-foreground">Rol</p>
          <p className="mt-1 text-sm font-bold text-card-foreground">
            {getRoleLabel(user.role)}
          </p>
        </div>
        <Link href="/cliente/perfil" className="text-xs font-bold text-accent hover:underline">
          Editar perfil
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
