import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // El backend autentica vía cookie httpOnly (token), no header — el navegador
  // necesita mandar/recibir la cookie en cada request cross-origin.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dni: number;
  phone: number;
  address: string | null;
  role: string;
}

// La cookie httpOnly no se puede leer desde JS (a propósito, es lo que la hace
// segura), así que para saber quién está logueado le preguntamos al backend
// en vez de decodificar el JWT nosotros mismos.
export const fetchCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    // GET /users/profile es la verificación real (pasa por el guard, valida la cookie).
    const { data: session } = await api.get("/users/profile");
    try {
      // GET /users/:id solo enriquece con name/dni/phone/address.
      const { data: full } = await api.get(`/users/${session.id}`);
      return { ...full, role: session.role };
    } catch {
      // La sesión sigue siendo válida aunque esta segunda llamada falle;
      // degradamos con lo mínimo en vez de deslogear a alguien con sesión válida.
      return {
        id: session.id,
        name: session.email,
        email: session.email,
        dni: 0,
        phone: 0,
        address: null,
        role: session.role,
      };
    }
  } catch {
    return null;
  }
};

export const logoutRequest = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch {
    // No pasa nada si falla — lo que importa es limpiar el estado local.
  }
};

export interface Company {
  id: string;
  name: string;
  nit: string;
  email: string;
}

// TODO: quitar cuando el backend vincule un usuario "admin" con su empresa real.
export const DEMO_COMPANY_ID = "dacee2cc-0f36-4aaf-a107-a19a57c92475";

export const getDashboardPathForRole = (role: string): string =>
  role === "admin" ? `/empresa/dashboard/${DEMO_COMPANY_ID}` : "/cliente/dashboard";

export const fetchCompany = async (companyId: string): Promise<Company | null> => {
  try {
    const { data } = await api.get(`/companies/${companyId}`);
    return data;
  } catch {
    return null;
  }
};

export interface ApiRoute {
  id: string;
  origin: string;
  destination: string;
  duration: number;
  price: string;
  companyId: string;
  company: { id: string; name: string };
}

export const fetchRoutes = async (): Promise<ApiRoute[]> => {
  try {
    const { data } = await api.get("/routes");
    return data;
  } catch {
    return [];
  }
};

export const uploadCompanyDocument = async (companyId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/file-upload/company/${companyId}`, formData, {
    headers: { "Content-Type": undefined },
  });
  return data;
};
