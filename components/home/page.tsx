"use client";
import { useMemo, useState } from "react";
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
  weekdayFromDate,
  type BenefitIcon,
  type DepartureStatus,
} from "@/data/home";

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
  { value: "60+", label: "Empresas aliadas" },
  { value: "6.000+", label: "Rutas activas" },
  { value: "24/7", label: "Compra en línea" },
];

const SkylineSilhouette = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 400 40"
    preserveAspectRatio="none"
    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full sm:h-14"
  >
    <path
      d="M0,40 L0,22 40,17 80,24 120,10 160,20 200,8 240,18 280,12 320,22 360,14 400,20 400,40 Z"
      className="fill-black/25"
    />
  </svg>
);

export const Hero = () => {
  return (
    <section className="bustix-dark relative bg-background px-8 pb-20 pt-14 md:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="flex items-center gap-2 font-mono-label text-xs uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Terminal Digital · Colombia
          </p>

          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            Tu próxima
            <br />
            <span className="text-primary">ruta, en segundos</span>
          </h1>

          <p className="mt-5 max-w-md text-muted-foreground">
            Compara horarios y precios de más de 60 empresas de buses en un
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

      <SkylineSilhouette />
    </section>
  );
};

// ---------- Wave divider (separador) ----------

export const WaveDivider = () => {
  return (
    <div
      aria-hidden="true"
      className="bustix-dark h-3 w-full bg-background"
      style={{
        backgroundImage:
          "radial-gradient(circle at 10px 100%, hsl(var(--bustix-cream)) 9px, transparent 9.5px)",
        backgroundSize: "20px 100%",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
};

// ---------- Rutas populares ----------

export const PopularRoutes = () => {
  const [origin, setOrigin] = useState("Todos");
  const [destination, setDestination] = useState("Todos");
  const [company, setCompany] = useState("Todos");
  const [date, setDate] = useState("");

  const origins = useMemo(
    () => ["Todos", ...Array.from(new Set(popularRoutes.map((r) => r.origin)))],
    []
  );
  const destinations = useMemo(
    () => ["Todos", ...Array.from(new Set(popularRoutes.map((r) => r.destination)))],
    []
  );
  const companies = useMemo(
    () => ["Todos", ...Array.from(new Set(popularRoutes.map((r) => r.company)))],
    []
  );

  const filteredRoutes = useMemo(() => {
    const weekday = date ? weekdayFromDate(date) : null;
    return popularRoutes.filter((route) => {
      if (origin !== "Todos" && route.origin !== origin) return false;
      if (destination !== "Todos" && route.destination !== destination) return false;
      if (company !== "Todos" && route.company !== company) return false;
      if (weekday && !route.availableDays.includes(weekday)) return false;
      return true;
    });
  }, [origin, destination, company, date]);

  const handleReset = () => {
    setOrigin("Todos");
    setDestination("Todos");
    setCompany("Todos");
    setDate("");
  };

  const hasActiveFilters = origin !== "Todos" || destination !== "Todos" || company !== "Todos" || date !== "";

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

        <div className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted-foreground">Origen</span>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-card-foreground outline-none focus:border-primary"
            >
              {origins.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted-foreground">Destino</span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-card-foreground outline-none focus:border-primary"
            >
              {destinations.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted-foreground">Empresa</span>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-card-foreground outline-none focus:border-primary"
            >
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted-foreground">Fecha</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-card-foreground outline-none focus:border-primary"
            />
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto text-sm font-semibold text-accent hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filteredRoutes.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No hay rutas que coincidan con esos filtros. Prueba con otra combinación.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredRoutes.map((route) => (
              <article
                key={route.id}
                className="flex flex-col rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-display text-base text-card-foreground">
                  {route.origin} → {route.destination}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {route.company} · {route.companiesCount} empresas · Desde {route.durationFrom}
                </p>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <span className="font-mono-label text-lg font-bold text-secondary">
                      {formatCOP(route.price)}
                    </span>
                    <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
                      COP · desde
                    </p>
                  </div>
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
        )}
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
                  <td className="font-mono-label px-5 py-4 font-medium">{departure.route}</td>
                  <td className="font-mono-label px-5 py-4 text-muted-foreground">{departure.company}</td>
                  <td className="font-mono-label px-5 py-4 text-muted-foreground">{departure.departureTime}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-mono-label inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASSES[departure.status]}`}
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
              className="font-display flex h-16 items-center justify-center rounded-lg border border-border bg-card px-4 text-center text-sm text-muted-foreground"
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
          href="/auth/register"
          className="whitespace-nowrap rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:brightness-95"
        >
          Registrar mi empresa
        </Link>
      </div>
    </section>
  );
};