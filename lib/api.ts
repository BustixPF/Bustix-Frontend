import axios from "axios";

export const api = axios.create({
  // Ruta relativa: pasa por el rewrite de next.config.ts (mismo origen que el
  // navegador), no directo a Railway — así la cookie de sesión es same-site.
  baseURL: "/api",
  // El backend autentica vía cookie httpOnly (token), no header — el navegador
  // necesita mandar/recibir la cookie en cada request.
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
  dni?: number;
  phone?: number;
  address?: string | null;
  role: string;
}

// La cookie httpOnly no se puede leer desde JS (a propósito, es lo que la hace
// segura), así que para saber quién está logueado le preguntamos al backend.
export const fetchCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    // GET /users/profile es la verificación real (pasa por el guard, valida la cookie).
    const { data: session } = await api.get("/users/profile");
    try {
      // GET /users/:id enriquece con name/dni/phone/address si está disponible.
      const { data: full } = await api.get(`/users/${session.id}`);
      return { ...full, role: session.role };
    } catch {
      // La sesión sigue siendo válida aunque esta segunda llamada falle;
      // degradamos con lo mínimo en vez de desloguear a alguien con sesión válida.
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

// Aliado para compatibilidad si algún componente llama a fetchUserProfile
export const fetchUserProfile = fetchCurrentUser;

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

export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const { data } = await api.get("/companies");
    return data;
  } catch {
    return [];
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

export interface ApiTrip {
  id: string;
  companyId: string;
  origin: string;
  destination: string;
  departureDate: string;
  price: string;
  totalSeats: number;
}

export interface ApiSeat {
  id: string;
  tripId: string;
  seatNumber: number;
  status: string;
}

export const fetchTrips = async (): Promise<ApiTrip[]> => {
  try {
    const { data } = await api.get("/trips");
    return data;
  } catch {
    return [];
  }
};

export const fetchTripById = async (id: string): Promise<ApiTrip | null> => {
  try {
    const { data } = await api.get(`/trips/${id}`);
    return data;
  } catch {
    return null;
  }
};

export interface CreateTripPayload {
  companyId: string;
  origin: string;
  destination: string;
  departureDate: string;
  price: number;
  totalSeats: number;
}

export const createTrip = async (payload: CreateTripPayload): Promise<ApiTrip> => {
  const { data } = await api.post("/trips", payload);
  return data;
};

export const fetchAvailableSeats = async (tripId: string): Promise<ApiSeat[]> => {
  try {
    const { data } = await api.get(`/trips/${tripId}/seats`);
    return data;
  } catch {
    return [];
  }
};

export const PENDING_PAYMENT_KEY = "bustix_pending_payment_id";

export const createCheckoutSession = async (
  tripId: string,
  seatIds: string[]
): Promise<{ url: string; paymentId: string }> => {
  const { data } = await api.post("/payments/checkout-session", { tripId, seatIds });
  return data;
};

export interface ApiPayment {
  id: string;
  status: string;
  amount: number;
}

export const fetchPayment = async (paymentId: string): Promise<ApiPayment | null> => {
  try {
    const { data } = await api.get(`/payments/${paymentId}`);
    return data;
  } catch {
    return null;
  }
};

export interface ApiTicket {
  id: string;
  origin: string;
  destination: string;
  price: number;
  purchaseDate: string;
  company: { id: string; name: string } | null;
}

export const fetchMyTickets = async (): Promise<ApiTicket[]> => {
  try {
    const { data } = await api.get("/dashboard/user/tickets");
    return data;
  } catch {
    return [];
  }
};

export interface ApiSale {
  id: string;
  origin: string;
  destination: string;
  price: number;
  purchaseDate: string;
  user: { id: string; name: string } | null;
  company: { id: string; name: string } | null;
}

// El backend todavía no filtra este historial por empresa (devuelve las
// ventas de todas las empresas) — hay que filtrar por companyId en el cliente.
export const fetchSalesHistory = async (): Promise<ApiSale[]> => {
  try {
    const { data } = await api.get("/dashboard/admin/sales-history");
    return data;
  } catch {
    return [];
  }
};