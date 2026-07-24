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
  id: string;
  email: string;
  roles: string[];
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
  if (!payload?.id) return null;
  try {
    const { data } = await api.get(`/users/${payload.id}`);
    return data;
  } catch {
    return null;
  }
};
