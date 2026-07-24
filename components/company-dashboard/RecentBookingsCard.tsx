import { recentBookings, type PaymentStatus } from "@/data/companyDashboard";

const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  pagado: "Pagado",
  pendiente: "Pendiente",
};

const PAYMENT_CLASSES: Record<PaymentStatus, string> = {
  pagado: "bg-secondary/15 text-secondary",
  pendiente: "bg-primary/15 text-primary",
};

const RecentBookingsCard = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg text-card-foreground">Reservas recientes</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
              <th className="px-3 py-1 font-normal">Pasajero</th>
              <th className="px-3 py-1 font-normal">Ruta</th>
              <th className="px-3 py-1 font-normal">Asiento</th>
              <th className="px-3 py-1 font-normal">Pago</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="bg-muted">
                <td className="rounded-l-lg px-3 py-3 text-card-foreground">
                  {booking.passenger}
                </td>
                <td className="px-3 py-3 text-muted-foreground">{booking.route}</td>
                <td className="px-3 py-3 text-muted-foreground">{booking.seat}</td>
                <td className="rounded-r-lg px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${PAYMENT_CLASSES[booking.payment]}`}
                  >
                    {PAYMENT_LABEL[booking.payment]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookingsCard;
