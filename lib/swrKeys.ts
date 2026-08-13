// Claves de cache compartidas para SWR. Dos componentes que usan la misma
// clave comparten los mismos datos en memoria - si uno hace mutate() de una
// clave, todos los que la usan se refrescan solos, sin recargar la pagina.
export const SWR_KEYS = {
  dashboardSummary: "dashboard-summary",
  pendingCompanies: "pending-companies",
  companiesWithDocuments: "companies-with-documents",
  approvedCompanies: "approved-companies",
  adminUsers: "admin-users",
  routeRequests: "route-requests",
  scheduleRequests: "schedule-requests",
  auditLogs: "audit-logs",
  systemHealth: "system-health",
  globalSales: "global-sales",
  superAdminPendingSummary: "superadmin-pending-summary",
  myTickets: "my-tickets",
  routes: "routes",
  trips: "trips",
  salesHistory: "sales-history",
} as const;
