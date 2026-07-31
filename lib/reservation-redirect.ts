const RESERVATION_REDIRECT_KEY = "bustix_reservation_redirect";
const RESERVATION_PASSENGERS_KEY = "bustix_reservation_passengers";

export const saveReservationRedirect = (path: string): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(RESERVATION_REDIRECT_KEY, path);
};

export const consumeReservationRedirect = (): string | null => {
  if (typeof window === "undefined") return null;
  const path = window.sessionStorage.getItem(RESERVATION_REDIRECT_KEY);
  if (path) {
    window.sessionStorage.removeItem(RESERVATION_REDIRECT_KEY);
  }
  return path;
};

export const savePendingPassengers = (count: number): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(RESERVATION_PASSENGERS_KEY, String(count));
};

export const consumePendingPassengers = (): number | null => {
  if (typeof window === "undefined") return null;
  const v = window.sessionStorage.getItem(RESERVATION_PASSENGERS_KEY);
  if (!v) return null;
  window.sessionStorage.removeItem(RESERVATION_PASSENGERS_KEY);
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};
