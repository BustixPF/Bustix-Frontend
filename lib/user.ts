const ROLE_LABELS: Record<string, string> = {
  user: "Pasajero",
  admin: "Administrador",
  superAdmin: "Super administrador",
};

export const getRoleLabel = (role: string): string => ROLE_LABELS[role] ?? role;

export const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
