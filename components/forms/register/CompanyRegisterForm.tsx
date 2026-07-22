"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import EyeIcon from "@/components/forms/register/EyeIcon";
import { api, getApiErrorMessage } from "@/lib/api";
import { useToast } from "@/components/context/ToastContext";
import {
  companyRegisterInitialValues,
  companyRegisterValidationSchema,
} from "@/components/forms/register/CompanyRegisterSchema";

const CompanyRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const formik = useFormik({
    initialValues: companyRegisterInitialValues,
    validationSchema: companyRegisterValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // El backend aún no tiene auth para empresas: solo crea el registro
        // (name, nit, email). phone/password se validan en el form pero
        // todavía no los recibe la entidad Company.
        await api.post("/companies", {
          name: values.companyName,
          nit: values.nit,
          email: values.email,
        });
        showToast({
          type: "success",
          title: "Empresa registrada",
          message: "Te contactaremos para habilitar el acceso a tu cuenta.",
        });
        router.push("/");
      } catch (error) {
        showToast({
          type: "error",
          title: "No se pudo registrar la empresa",
          message: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="mt-4">
      <label className="block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Nombre de la empresa
        </span>
        <input
          type="text"
          name="companyName"
          placeholder="Expreso Bolivariano S.A.S."
          value={formik.values.companyName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.companyName && formik.errors.companyName && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.companyName}</p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          NIT
        </span>
        <input
          type="text"
          name="nit"
          placeholder="900.123.456-7"
          value={formik.values.nit}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.nit && formik.errors.nit && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.nit}</p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Correo electrónico corporativo
        </span>
        <input
          type="email"
          name="email"
          placeholder="contacto@tuempresa.com"
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
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Teléfono
        </span>
        <input
          type="tel"
          name="phone"
          placeholder="+57 300 000 0000"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.phone}</p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Contraseña
        </span>
        <div className="relative mt-1.5">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 pr-10 text-sm text-card-foreground outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.password}</p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Confirmar contraseña
        </span>
        <div className="relative mt-1.5">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="••••••••••"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 pr-10 text-sm text-card-foreground outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <EyeIcon open={showConfirmPassword} />
          </button>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.confirmPassword}</p>
        )}
      </label>

      <label className="mt-5 flex items-start gap-2.5">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formik.values.acceptTerms}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
        />
        <span className="text-xs text-muted-foreground">
          Acepto los{" "}
          <a href="#" className="font-bold text-accent hover:underline">
            Términos y condiciones
          </a>{" "}
          y la{" "}
          <a href="#" className="font-bold text-accent hover:underline">
            Política de privacidad
          </a>
          .
        </span>
      </label>
      {formik.touched.acceptTerms && formik.errors.acceptTerms && (
        <p className="mt-1 text-xs text-destructive">{formik.errors.acceptTerms}</p>
      )}

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
      >
        {formik.isSubmitting ? "Registrando..." : "Registrar empresa"}
      </button>
    </form>
  );
};

export default CompanyRegisterForm;
