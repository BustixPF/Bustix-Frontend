import axios from "axios";

export const TOKEN_STORAGE_KEY = "bustix_token";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
};

interface JwtPayload {
  id?: string;
  sub?: string;
  email: string;
  role?: string;
  roles?: string | string[];
}

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
};

// El login normal firma { id, role } y el de Google firma { sub, roles } (a veces
// como string en vez de array) — se toleran las dos formas acá en un solo lugar.
export const getUserIdFromPayload = (payload: JwtPayload | null): string | undefined =>
  payload?.id ?? payload?.sub;

export const getRoleFromPayload = (payload: JwtPayload | null): string | undefined => {
  if (!payload) return undefined;
  if (Array.isArray(payload.roles)) return payload.roles[0];
  if (typeof payload.roles === "string") return payload.roles;
  return payload.role;
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

export const fetchUserProfile = async (token: string): Promise<UserProfile | null> => {
  const payload = decodeJwtPayload(token);
  const userId = getUserIdFromPayload(payload);
  if (!userId) return null;
  try {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  } catch {
    return null;
  }
};

export interface Company {
  id: string;
  name: string;
  nit: string;
  email: string;
}

// TODO: quitar cuando el backend vincule un usuario "admin" con su empresa real.
export const DEMO_COMPANY_ID = "8b87b95c-331b-4a5b-9ab8-4cd9352dfa7f";

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
