const RESERVATION_REDIRECT_KEY = "bustix_reservation_redirect";

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
