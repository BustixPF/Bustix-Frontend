"use client";
import { useFormik } from "formik";
import { toast } from "sonner";
import { api, getApiErrorMessage, type Company } from "@/lib/api";
import {
  buildEditCompanyInitialValues,
  editCompanyValidationSchema,
} from "@/components/forms/profile/EditCompanySchema";

interface EditCompanyFormProps {
  company: Company;
  onUpdated: (company: Company) => void;
}

const EditCompanyForm = ({ company, onUpdated }: EditCompanyFormProps) => {
  const formik = useFormik({
    initialValues: buildEditCompanyInitialValues(company),
    validationSchema: editCompanyValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // El nit se muestra pero no se reenvia - ver nota en EditCompanySchema.
        const payload = { name: values.name, email: values.email, phone: values.phone };
        const { data } = await api.patch(`/companies/${company.id}`, payload);
        onUpdated(data);
        toast.success("Datos de la empresa actualizados", {
          description: "Los cambios se guardaron correctamente.",
        });
      } catch (error) {
        toast.error("No se pudo actualizar la empresa", {
          description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="mx-auto mt-6 max-w-lg">
      <label className="block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Nombre de la empresa
        </span>
        <input
          type="text"
          name="name"
          autoComplete="organization"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.name}</p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">NIT</span>
        <input
          type="text"
          value={formik.values.nit}
          disabled
          className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground outline-none"
        />
        <p className="mt-1 text-xs text-muted-foreground">El NIT no se puede modificar.</p>
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Correo de la empresa
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.email}</p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">Teléfono</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.phone}</p>
        )}
      </label>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {formik.isSubmitting ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
};

export default EditCompanyForm;
