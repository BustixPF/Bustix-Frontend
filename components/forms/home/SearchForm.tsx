"use client";
import { useFormik } from "formik";
import { searchInitialValues, searchValidationSchema } from "@/components/forms/home/SearchSchema";

const ArrowLeftRight = ({ className }: { className?: string }) => (
  <span className={className}>⇄</span>
);

const Search = ({ className }: { className?: string }) => (
  <span className={className}>🔍</span>
);

const SearchForm = () => {
  const formik = useFormik({
    initialValues: searchInitialValues,
    validationSchema: searchValidationSchema,
    onSubmit: () => {
    },
  });

  const handleSwap = () => {
    formik.setValues({
      ...formik.values,
      origin: formik.values.destination,
      destination: formik.values.origin,
    });
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
    >
      <p className="font-mono-label text-xs uppercase text-muted-foreground">
        Buscar viaje
      </p>

      <div className="relative mt-4 flex flex-col gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Origen
          </span>
          <input
            type="text"
            name="origin"
            value={formik.values.origin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
          />
        </label>

        <button
          type="button"
          onClick={handleSwap}
          aria-label="Intercambiar origen y destino"
          className="absolute right-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Destino
          </span>
          <input
            type="text"
            name="destination"
            value={formik.values.destination}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
          />
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Fecha de ida
          </span>
          <input
            type="date"
            name="departureDate"
            value={formik.values.departureDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Fecha de vuelta
          </span>
          <input
            type="date"
            name="returnDate"
            value={formik.values.returnDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
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