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
  companyId?: string | null;
  profilePicture?: string | null;
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
        companyId: null,
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

export interface CompanyDocument {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
}

export interface Company {
  id: string;
  name: string;
  nit: string;
  email: string;
  phone?: string;
  status?: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  documents?: CompanyDocument[];
}

// Admin sin companyId es un estado inconsistente (cuenta vieja o promovida
// manualmente sin pasar por la aprobación de una solicitud de empresa) - no
// hay a donde mandarlo, así que se devuelve null y el que llama decide cómo
// avisarle en vez de asumir una empresa cualquiera.
export const getDashboardPathForRole = (
  role: string,
  companyId?: string | null
): string | null => {
  if (role === "superAdmin") {
    return "/superadmin/dashboard";
  }
  if (role === "admin") {
    return companyId ? `/empresa/dashboard/${companyId}` : null;
  }
  return "/cliente/dashboard";
};

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

export const approveCompany = async (companyId: string): Promise<Company> => {
  const { data } = await api.patch(`/companies/${companyId}/approve`);
  return data;
};

export const rejectCompany = async (
  companyId: string,
  reason?: string
): Promise<Company> => {
  const { data } = await api.patch(`/companies/${companyId}/reject`, reason ? { reason } : {});
  return data;
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

// El endpoint existe (POST /file-upload/user/:userId) pero hoy esta roto del
// lado del backend: lee el companyId de la ruta en vez del userId, y aunque
// se arreglara ese typo, el repositorio solo sabe buscar el id en la tabla
// companies (no existe ningun vinculo Document->User ni columna
// profilePicture en User). Se deja conectado ya, apuntando al contrato que
// se espera una vez lo arreglen: sube el archivo y devuelve la URL nueva.
export const uploadProfilePicture = async (
  userId: string,
  file: File
): Promise<{ profilePicture: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/file-upload/user/${userId}`, formData, {
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

export interface RequestSchedulePayload {
  routeId: number;
  departureDate: string;
  price: number;
  totalSeats: number;
}

export interface ScheduleRequestResponse {
  id: string;
  companyId: string;
  routeId: number;
  origin: string;
  destination: string;
  departureDate: string;
  price: number;
  totalSeats: number;
  status: "pending" | "accepted" | "rejected";
  createdTripId?: string;
}

// Ya no se puede crear un Trip directo desde el dashboard de empresa
// (POST /trips quedo restringido a superAdmin) - esto crea una solicitud
// pendiente que el superadmin aprueba o rechaza desde su panel.
export const requestSchedule = async (
  payload: RequestSchedulePayload
): Promise<ScheduleRequestResponse> => {
  const { data } = await api.post("/dashboard/admin/schedules", payload);
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
  // Requiere el fix de backend pendiente (Ticket -> Trip): si el backend
  // todavia no lo manda, estos campos llegan undefined y el front cae al
  // estado vacio.
  tripId?: string | null;
  seatNumber?: number | null;
  departureDate?: string | null;
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

export interface AdminMetrics {
  overview: {
    totalIncome: number;
    totalPaidTransactions: number;
    totalTicketsSold: number;
    activeCompanies: number;
    totalUsers: number;
  };
  charts: {
    salesOverTime: { date: string; total: number; count: number }[];
    topRoutes: { route: string; ticketsSold: number }[];
  };
}

// Metricas globales de la plataforma (no filtran por empresa, ni siquiera
// cuando las consulta un Admin) - solo tiene sentido para el dashboard de
// superAdmin.
export const fetchAdminMetrics = async (): Promise<AdminMetrics | null> => {
  try {
    const { data } = await api.get("/admin/metrics");
    return data;
  } catch {
    return null;
  }
};