"use client";
import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { searchInitialValues, searchValidationSchema, todayISO } from "@/components/forms/home/SearchSchema";
import { fetchTrips, type ApiTrip } from "@/lib/api";
import { normalizeCityName } from "@/data/viajes";
import DepartureDatePicker from "@/components/DepartureDatePicker";

const ArrowLeftRight = ({ className }: { className?: string }) => (
  <span className={`flex items-center justify-center leading-none ${className ?? ""}`}>⇄</span>
);

const Search = ({ className }: { className?: string }) => (
  <span className={className}>🔍</span>
);

const SearchForm = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [tripsLoaded, setTripsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchTrips()
      .then((data) => {
        if (!cancelled) setTrips(data);
      })
      .finally(() => {
        if (!cancelled) setTripsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const formik = useFormik({
    initialValues: searchInitialValues,
    validationSchema: searchValidationSchema,
    onSubmit: (values) => {
      const query = `origen=${encodeURIComponent(values.origin)}&destino=${encodeURIComponent(values.destination)}&fecha=${values.departureDate}`;
      router.push(`/viajes?${query}`);
    },
  });

  const hasOriginAndDestination = Boolean(
    formik.values.origin.trim() && formik.values.destination.trim()
  );

  const availableDates = useMemo(() => {
    const origin = formik.values.origin.trim();
    const destination = formik.values.destination.trim();
    if (!origin || !destination) return [];

    const o = normalizeCityName(origin);
    const d = normalizeCityName(destination);
    const todayIso = todayISO();
    const isoDates = new Set<string>();

    for (const trip of trips) {
      if (normalizeCityName(trip.origin) !== o || normalizeCityName(trip.destination) !== d) {
        continue;
      }
      const iso = new Date(trip.departureDate).toISOString().slice(0, 10);
      if (iso >= todayIso) {
        isoDates.add(iso);
      }
    }

    return Array.from(isoDates).sort();
  }, [trips, formik.values.origin, formik.values.destination]);

  useEffect(() => {
    if (availableDates.length === 0) {

      if (formik.values.departureDate) {
        formik.setFieldValue("departureDate", "");
      }
      return;
    }
    if (!availableDates.includes(formik.values.departureDate)) {
      formik.setFieldValue("departureDate", availableDates[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableDates]);

  const handleSwap = () => {
    formik.setValues({
      ...formik.values,
      origin: formik.values.destination,
      destination: formik.values.origin,
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = await formik.validateForm();
    formik.setTouched({ origin: true, destination: true });

    if (errors.origin || errors.destination) {
      return;
    }

    if (!tripsLoaded) {
      toast.info("Un momento", {
        description: "Todavía estamos cargando las rutas disponibles, intenta de nuevo en un segundo.",
      });
      return;
    }

    if (availableDates.length === 0) {
      toast.error("Ruta no disponible", {
        description: "No encontramos viajes programados para esa ruta en este momento. Ve a rutas populares y filtra la ruta que quieras",
      });
      return;
    }

    const departureDate = availableDates.includes(formik.values.departureDate)
      ? formik.values.departureDate
      : availableDates[0];

    const query = `origen=${encodeURIComponent(formik.values.origin)}&destino=${encodeURIComponent(formik.values.destination)}&fecha=${departureDate}`;
    router.push(`/viajes?${query}`);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      noValidate
      className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
    >
      <p className="font-mono-label text-xs uppercase text-muted-foreground">
        Buscar viaje
      </p>

      <div className="mt-4 flex items-stretch gap-2">
        <div className="flex flex-1 flex-col gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Origen</span>
            <input
              type="text"
              name="origin"
              autoComplete="off"
              placeholder="Ej. Medellín"
              value={formik.values.origin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(formik.touched.origin && formik.errors.origin)}
              className={`w-full rounded-lg border bg-muted px-4 py-2.5 text-sm text-[var(--bustix-text-on-dark)] outline-none placeholder:text-muted-foreground ${
                formik.touched.origin && formik.errors.origin
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            {formik.touched.origin && formik.errors.origin && (
              <p className="mt-1 text-xs font-semibold text-destructive">{formik.errors.origin}</p>
            )}
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Destino</span>
            <input
              type="text"
              name="destination"
              autoComplete="off"
              placeholder="Ej. Bogotá"
              value={formik.values.destination}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(formik.touched.destination && formik.errors.destination)}
              className={`w-full rounded-lg border bg-muted px-4 py-2.5 text-sm text-[var(--bustix-text-on-dark)] outline-none placeholder:text-muted-foreground ${
                formik.touched.destination && formik.errors.destination
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            {formik.touched.destination && formik.errors.destination && (
              <p className="mt-1 text-xs font-semibold text-destructive">{formik.errors.destination}</p>
            )}
          </label>
        </div>

        <button
          type="button"
          onClick={handleSwap}
          aria-label="Intercambiar origen y destino"
          className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">Fecha de ida</span>
          {availableDates.length > 0 ? (
            <DepartureDatePicker
              value={formik.values.departureDate}
              availableDates={availableDates}
              onChange={(iso) => formik.setFieldValue("departureDate", iso)}
            />
          ) : (
            <div
              aria-disabled="true"
              title={hasOriginAndDestination ? "No encontramos viajes para esa ruta" : "Elige origen y destino primero"}
              className="flex h-10.5 w-full cursor-not-allowed items-center overflow-hidden truncate whitespace-nowrap rounded-lg border border-border bg-muted px-4 text-sm text-muted-foreground opacity-60"
            >
              {hasOriginAndDestination ? "Sin fechas disponibles" : "Elige origen y destino"}
            </div>
          )}
          {/* Reserva el espacio siempre (con invisible) para que la tarjeta no
              cambie de tamaño cada vez que este mensaje aparece o desaparece. */}
          <p
            className={`mt-1 text-xs text-muted-foreground ${
              hasOriginAndDestination && availableDates.length === 0 ? "" : "invisible"
            }`}
          >
            No encontramos viajes programados para esa ruta todavía.
          </p>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Fecha de vuelta <span className="text-muted-foreground/70">(próximamente)</span>
          </span>
          <input
            type="date"
            name="returnDate"
            autoComplete="off"
            disabled
            title="La compra de ida y vuelta todavía no está disponible"
            value={formik.values.returnDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-[var(--bustix-text-on-dark)] opacity-50 outline-none"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Buscar buses
      </button>
    </form>
  );
};

export default SearchForm;