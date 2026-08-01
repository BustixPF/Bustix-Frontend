"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { searchInitialValues, searchValidationSchema, todayISO } from "@/components/forms/home/SearchSchema";

const ArrowLeftRight = ({ className }: { className?: string }) => (
  <span className={`flex items-center justify-center leading-none ${className ?? ""}`}>⇄</span>
);

const Search = ({ className }: { className?: string }) => (
  <span className={className}>🔍</span>
);

const SearchForm = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: searchInitialValues,
    validationSchema: searchValidationSchema,
    onSubmit: (values) => {
      const query = `origen=${encodeURIComponent(values.origin)}&destino=${encodeURIComponent(values.destination)}&fecha=${values.departureDate}`;
      router.push(`/viajes?${query}`);
    },
  });

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
    formik.setTouched({ origin: true, destination: true, departureDate: true });

    if (errors.origin || errors.destination) {
      return;
    }

    if (!formik.values.departureDate) {
      toast.error("Falta la fecha de ida", {
        description: "Elige una fecha para poder buscar los buses disponibles.",
      });
      return;
    }

    if (errors.departureDate) {
      toast.error("Fecha de ida inválida", {
        description: errors.departureDate,
      });
      return;
    }

    formik.handleSubmit(event);
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
          <input
            type="date"
            name="departureDate"
            autoComplete="off"
            min={todayISO()}
            value={formik.values.departureDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-[var(--bustix-text-on-dark)] outline-none focus:border-primary"
          />
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