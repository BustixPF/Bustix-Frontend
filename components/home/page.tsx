import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import SearchForm from "@/components/forms/home/SearchForm";
import {
  popularRoutes,
  upcomingDepartures,
  benefits,
  howItWorksSteps,
  partners,
  formatCOP,
  type BenefitIcon,
  type DepartureStatus,
} from "@/data/home";

const MapPin = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    <path d="M12 22s8-4.5 8-11A8 8 0 0 0 4 11.08c0 6.5 8 11 8 11z" />
  </svg>
);

const ArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const Building2 = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 21h18" />
    <path d="M6 21V10h12v11" />
    <path d="M9 21V6h6v15" />
    <path d="M9 10h6" />
    <path d="M9 14h6" />
  </svg>
);

const ShieldCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3l7 4v5c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const Armchair = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 13V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4" />
    <path d="M4 18v-5h16v5" />
    <path d="M7 18v3" />
    <path d="M17 18v3" />
  </svg>
);

const QrCode = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h6v6H4z" />
    <path d="M14 4h6v6h-6z" />
    <path d="M4 14h6v6H4z" />
    <path d="M10 14h2v2h-2z" />
    <path d="M14 10h2v2h-2z" />
    <path d="M18 14h2v2h-2z" />
    <path d="M18 18h2v2h-2z" />
  </svg>
);

const Headphones = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
    <path d="M6 15a2 2 0 0 0 2 2h1v-4H8a2 2 0 0 0-2 2z" />
    <path d="M18 15a2 2 0 0 1-2 2h-1v-4h1a2 2 0 0 1 2 2z" />
  </svg>
);

const STATS = [
  { value: "30+", label: "Empresas activas" },
  { value: "900+", label: "Rutas activas" },
  { value: "24/7", label: "Soporte" },
];

export const Hero = () => {
  return (
    <section className="bustix-dark bg-background px-8 pb-20 pt-14 md:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="flex items-center gap-2 font-mono-label text-xs uppercase text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Terminal Digital · Colombia
          </p>

          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            Tu próxima ruta, <span className="text-primary">en segundos</span>
          </h1>

          <p className="mt-5 max-w-md text-muted-foreground">
            Compara horarios y precios de más de 30 empresas de buses en un
            solo lugar. Sin filas, sin llamadas, sin sorpresas.
          </p>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-2xl text-foreground sm:text-3xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex justify-center lg:justify-end">
          <SearchForm />
        </div>
      </div>
    </section>
  );
};

// ---------- Wave divider (separador) ----------

export const WaveDivider = () => {
  return (
    <div
      aria-hidden="true"
      className="bustix-dark h-4 w-full bg-background"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(var(--bustix-cream)) 50%, transparent 50%),
          linear-gradient(45deg, transparent 50%, hsl(var(--bustix-cream)) 50%)`,
        backgroundSize: "24px 16px",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
};

// ---------- Rutas populares ----------

export const PopularRoutes = () => {
  return (
    <section id="rutas-populares" className="bg-background px-8 pb-20 pt-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              Rutas populares
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Los recorridos más buscados esta semana en la plataforma.
            </p>
          </div>
          <a
            href="#"
            className="hidden text-sm font-semibold text-secondary hover:underline sm:block"
          >
            Ver todas
          </a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularRoutes.map((route) => (
            <article
              key={route.id}
              className="flex flex-col rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-display text-base text-card-foreground">
                {route.origin} → {route.destination}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {route.companiesCount} empresas · Desde {route.durationFrom}
              </p>

              <div className="mt-6 flex items-end justify-between">
                <span className="font-display text-2xl text-card-foreground">
                  {formatCOP(route.price)}
                </span>
                <a
                  href="#"
                  className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                >
                  Ver horarios
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- Próximas salidas ----------

const STATUS_LABEL: Record<DepartureStatus, string> = {
  "a-tiempo": "A tiempo",
  embarcando: "Embarcando",
};

const STATUS_CLASSES: Record<DepartureStatus, string> = {
  "a-tiempo": "bg-success/15 text-success",
  embarcando: "bg-primary/15 text-primary",
};

export const UpcomingDepartures = () => {
  return (
    <section id="proximas-salidas" className="bustix-dark bg-background px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">
          Próximas salidas
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Así se ve la información en tiempo real dentro de la plataforma.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="font-mono-label text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3 font-normal">Ruta</th>
                <th className="px-5 py-3 font-normal">Empresa</th>
                <th className="px-5 py-3 font-normal">Salida</th>
                <th className="px-5 py-3 font-normal">Estado</th>
              </tr>
            </thead>
            <tbody>
              {upcomingDepartures.map((departure) => (
                <tr key={departure.id} className="border-t border-border text-foreground">
                  <td className="px-5 py-4 font-medium">{departure.route}</td>
                  <td className="px-5 py-4 text-muted-foreground">{departure.company}</td>
                  <td className="px-5 py-4 text-muted-foreground">{departure.departureTime}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASSES[departure.status]}`}
                    >
                      {STATUS_LABEL[departure.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// ---------- Beneficios ----------

const BENEFIT_ICONS: Record<BenefitIcon, ComponentType<{ className?: string }>> = {
  compare: Building2,
  payment: ShieldCheck,
  seats: Armchair,
  ticket: QrCode,
  support: Headphones,
};

export const Benefits = () => {
  return (
    <section className="bg-background px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="flex items-center gap-2 font-mono-label text-xs uppercase text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Beneficios
        </p>
        <h2 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
          Pensado para viajar sin fricción
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((benefit) => {
            const Icon = BENEFIT_ICONS[benefit.icon];
            return (
              <div
                key={benefit.id}
                className={`rounded-xl border bg-card p-5 ${
                  benefit.highlighted ? "border-2 border-primary" : "border-border"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-secondary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-card-foreground">{benefit.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ---------- Cómo funciona ----------

export const HowItWorks = () => {
  return (
    <section id="como-funciona" className="bustix-dark bg-background px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">Cómo funciona</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tres pasos entre tú y tu próximo viaje.
        </p>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {howItWorksSteps.map((step) => (
            <li key={step.id} className="rounded-xl border border-border bg-card p-6">
              <p className="font-mono-label text-xs text-primary">
                {step.number} · {step.label.toUpperCase()}
              </p>
              <h3 className="mt-3 font-display text-lg text-card-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

// ---------- Empresas aliadas ----------

export const PartnerCompanies = () => {
  return (
    <section id="empresas" className="bg-background px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">Empresas aliadas</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Operadores verificados que venden sus rutas en BusTix.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex h-16 items-center justify-center rounded-lg border border-border bg-card px-4 text-center text-sm font-semibold text-muted-foreground"
            >
              {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- CTA empresas ----------

export const CompanyCta = () => {
  return (
    <section className="bg-background px-8 pb-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-2xl bg-secondary px-8 py-10 text-center text-secondary-foreground md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">¿Tienes una empresa de buses?</h2>
          <p className="mt-2 max-w-md text-sm text-secondary-foreground/80">
            Publica tus rutas en BusTix y llega a miles de viajeros en todo el país.
          </p>
        </div>

        <Link
          href="/Register"
          className="whitespace-nowrap rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:brightness-95"
        >
          Registrar mi empresa
        </Link>
      </div>
    </section>
  );
};
