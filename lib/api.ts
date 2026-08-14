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

export const deleteAccount = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
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
  isActive?: boolean;
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

// GET /companies es publico y ahora solo devuelve empresas aprobadas (antes
// devolvia todas, incluyendo pendientes/rechazadas - eso se cerro a proposito
// para no filtrar solicitudes de empresa a cualquier visitante anonimo).
export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const { data } = await api.get("/companies");
    return data;
  } catch {
    return [];
  }
};

// Solo trae companias en estado pending (con status/rejectionReason, sin
// documentos) - requiere superAdmin o Admin.
export const fetchPendingCompanies = async (): Promise<Company[]> => {
  try {
    const { data } = await api.get("/companies/pending");
    return data;
  } catch {
    return [];
  }
};

// Trae TODAS las companias con sus documentos (sin status/rejectionReason) -
// requiere superAdmin. Se combina con fetchPendingCompanies() para armar la
// lista de solicitudes pendientes con sus documentos adjuntos.
export const fetchCompaniesWithDocuments = async (): Promise<Company[]> => {
  try {
    const { data } = await api.get("/dashboard/superadmin/companies");
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

// Desactivar una empresa tambien desactiva en cascada a sus administradores
// (lo hace el back). Requiere superAdmin.
export const updateCompanyActive = async (
  companyId: string,
  isActive: boolean
): Promise<Company> => {
  const { data } = await api.patch(`/companies/${companyId}/active`, { isActive });
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

export interface CreateCompanyResponse {
  id: string;
  name: string;
  nit: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  // Token temporal (30 min) para poder subir documentos justo despues de
  // registrarse, sin sesion de usuario todavia - ver
  // uploadCompanyRegistrationDocument.
  documentUploadToken: string;
  documentUploadTokenExpiresIn: number;
}

// Endpoint dedicado para subir documentos durante el registro: no requiere
// sesion, usa el token temporal que devuelve POST /companies. El back
// bloquea la subida en cuanto la empresa deja de estar "pending".
export const uploadCompanyRegistrationDocument = async (
  companyId: string,
  documentUploadToken: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(
    `/file-upload/company/${companyId}/registration`,
    formData,
    {
      headers: {
        "Content-Type": undefined,
        "X-Company-Upload-Token": documentUploadToken,
      },
    }
  );
  return data;
};

// El back ya lo implemento en un endpoint dedicado (distinto del que se
// esperaba originalmente): sube a Cloudinary y guarda la URL en
// User.profilePicture, devolviendo { message, profilePictureUrl }.
export const uploadProfilePicture = async (
  userId: string,
  file: File
): Promise<{ profilePicture: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(
    `/file-upload/user/${userId}/profile-picture`,
    formData,
    { headers: { "Content-Type": undefined } }
  );
  return { profilePicture: data.profilePictureUrl };
};

export type TripStatus =
  | "A_TIEMPO"
  | "EMBARCANDO"
  | "SALIO"
  | "RETRASADO"
  | "CANCELADO"
  | "LLEGÓ"
  | "EN_RUTA"
  | "REPROGRAMADO";

export interface ApiTrip {
  id: string;
  companyId: string;
  origin: string;
  destination: string;
  departureDate: string;
  price: string;
  totalSeats: number;
  status: TripStatus;
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

export type ManualTripStatus = "CANCELADO" | "RETRASADO" | "REPROGRAMADO";

export const updateTripStatus = async (
  tripId: string,
  status: ManualTripStatus,
  newDepartureDate?: string
): Promise<ApiTrip> => {
  const { data } = await api.patch(`/trips/${tripId}/status`, {
    status,
    ...(newDepartureDate ? { newDepartureDate } : {}),
  });
  return data;
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

// El backend ya filtra este historial por la empresa del Admin autenticado.
export const fetchSalesHistory = async (): Promise<ApiSale[]> => {
  try {
    const { data } = await api.get("/dashboard/admin/sales-history");
    return data;
  } catch {
    return [];
  }
};

// Ventas de TODA la plataforma, sin filtrar por empresa - requiere superAdmin.
export const fetchGlobalSales = async (): Promise<ApiSale[]> => {
  try {
    const { data } = await api.get("/dashboard/superadmin/sales");
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

export interface RequestedByUser {
  id: string;
  name: string;
  email: string;
}

export type RequestStatus = "pending" | "accepted" | "rejected";

export interface RouteRequestItem {
  id: string;
  type: "add" | "delete";
  origin?: string;
  destination?: string;
  stops?: string[];
  duration?: number;
  price?: number;
  companyId?: string;
  routeId?: string;
  status: RequestStatus;
  message?: string;
  requestedBy: RequestedByUser | null;
}

// GET ya filtra por status "pending" del lado del backend.
export const fetchRouteRequests = async (): Promise<RouteRequestItem[]> => {
  try {
    const { data } = await api.get("/dashboard/superadmin/route-requests");
    return data;
  } catch {
    return [];
  }
};

export const respondRouteRequest = async (
  id: string,
  status: "accepted" | "rejected",
  message?: string
): Promise<RouteRequestItem> => {
  const { data } = await api.post(`/dashboard/superadmin/route-requests/${id}/respond`, {
    status,
    ...(message ? { message } : {}),
  });
  return data;
};

export interface ScheduleRequestItem {
  id: string;
  companyId: string;
  routeId: number;
  origin: string;
  destination: string;
  departureDate: string;
  price: number;
  totalSeats: number;
  status: RequestStatus;
  createdTripId?: string;
  message?: string;
  requestedBy: RequestedByUser;
}

// GET ya filtra por status "pending" del lado del backend.
export const fetchScheduleRequests = async (): Promise<ScheduleRequestItem[]> => {
  try {
    const { data } = await api.get("/dashboard/superadmin/schedule-requests");
    return data;
  } catch {
    return [];
  }
};

export const respondScheduleRequest = async (
  id: string,
  status: "accepted" | "rejected",
  message?: string
): Promise<ScheduleRequestItem> => {
  const { data } = await api.post(`/dashboard/superadmin/schedule-requests/${id}/respond`, {
    status,
    ...(message ? { message } : {}),
  });
  return data;
};

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// El backend no guarda historial - el cliente manda el historial previo en
// cada request para que el asistente tenga contexto de la conversación.
export const sendChatMessage = async (
  message: string,
  history: ChatMessage[]
): Promise<string> => {
  const { data } = await api.post("/chatbot/message", { message, history });
  return data.reply;
};

export type UserRole = "user" | "admin" | "superAdmin";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  dni?: number | string | null;
  phone?: number | string | null;
  address?: string | null;
  role: UserRole;
  companyId?: string | null;
  profilePicture?: string | null;
  isActive?: boolean;
}

// Requiere superAdmin. El backend pagina con page/limit, sin busqueda server-side.
export const fetchUsers = async (page = 1, limit = 15): Promise<AdminUser[]> => {
  try {
    const { data } = await api.get(`/users?page=${page}&limit=${limit}`);
    return data;
  } catch {
    return [];
  }
};

export const changeUserRole = async (userId: string, role: UserRole): Promise<AdminUser> => {
  const { data } = await api.patch(`/dashboard/superadmin/users/${userId}/role`, { role });
  return data;
};

// Un usuario desactivado ya no puede iniciar sesion (lo valida el back en
// login/signup/JwtStrategy). Requiere superAdmin.
export const updateUserActive = async (
  userId: string,
  isActive: boolean
): Promise<AdminUser> => {
  const { data } = await api.patch(`/users/${userId}/active`, { isActive });
  return data;
};

export interface DashboardSummary {
  companyCount: number;
  ticketCount: number;
  pendingCompanyRequests: number;
  pendingRouteRequests: number;
  pendingScheduleRequests: number;
}

export const fetchDashboardSummary = async (): Promise<DashboardSummary | null> => {
  try {
    const { data } = await api.get("/dashboard/summary");
    return data;
  } catch {
    return null;
  }
};

export interface ApiPaymentDetail {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "canceled" | "refunded";
  description?: string | null;
  tripId?: string | null;
  createdAt: string;
  user?: { id: string; name: string; email: string } | null;
}

export const fetchPaymentById = async (paymentId: string): Promise<ApiPaymentDetail | null> => {
  try {
    const { data } = await api.get(`/payments/${paymentId}`);
    return data;
  } catch {
    return null;
  }
};

export const refundPayment = async (paymentId: string): Promise<ApiPaymentDetail> => {
  const { data } = await api.post(`/payments/${paymentId}/refund`);
  return data;
};

export interface SuperAdminPendingSummary {
  companies: number;
  routes: number;
  schedules: number;
}

// No existe un endpoint de notificaciones para superAdmin - se arma
// contando las 3 listas de solicitudes pendientes que ya usa el dashboard.
export const fetchSuperAdminPendingSummary = async (): Promise<SuperAdminPendingSummary> => {
  const [companies, routes, schedules] = await Promise.all([
    fetchPendingCompanies(),
    fetchRouteRequests(),
    fetchScheduleRequests(),
  ]);
  return {
    companies: companies.length,
    routes: routes.length,
    schedules: schedules.length,
  };
};

export interface HealthCheckDetail {
  status: "up" | "down";
  message?: string;
}

export interface SystemHealth {
  status: "ok" | "error" | "shutting_down";
  details: Record<string, HealthCheckDetail>;
}

// Terminus responde 200 si todo esta "up" pero 503 si algo esta "down" - en
// ambos casos el body trae el detalle de cada check, asi que hay que leerlo
// tambien del error de axios (no solo del caso feliz).
export const fetchSystemHealth = async (): Promise<SystemHealth | null> => {
  try {
    const { data } = await api.get("/dashboard/superadmin/health");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.details) {
      return error.response.data;
    }
    return null;
  }
};

// Fuerza role:"admin" en el usuario elegido sin validar si ya era admin de
// otra empresa - el picker del front filtra superAdmins para evitar una
// degradacion accidental de esa cuenta.
export const assignCompanyAdmin = async (companyId: string, userId: string): Promise<void> => {
  await api.patch(`/companies/${companyId}/assign-admin`, { userId });
};

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  action: string;
  method: string;
  endpoint: string;
  ip: string | null;
  createdAt: string;
}

// Solo trae acciones que tengan el decorador @AuditAction en el back -
// hoy en dia son las de aprobar/rechazar empresa, cambiar su estado activo
// y asignar administrador. Requiere superAdmin.
export const fetchAuditLogs = async (): Promise<AuditLogEntry[]> => {
  try {
    const { data } = await api.get("/admin/audit-logs");
    return data;
  } catch {
    return [];
  }
};