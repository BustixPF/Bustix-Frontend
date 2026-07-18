import { dashboardNotifications, type NotificationTone } from "@/data/dashboard";

const TONE_CLASSES: Record<NotificationTone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  muted: "bg-muted-foreground",
};

const NotificationsCard = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-base text-card-foreground">Notificaciones</h3>

      <ul className="mt-4 flex flex-col gap-4">
        {dashboardNotifications.map((notification) => (
          <li key={notification.id} className="flex items-start gap-2.5">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE_CLASSES[notification.tone]}`}
            />
            <div>
              <p className="text-sm font-semibold text-card-foreground">{notification.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{notification.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsCard;
