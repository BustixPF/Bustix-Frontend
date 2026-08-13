"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import EyeIcon from "@/components/forms/register/EyeIcon";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import {
  changePasswordInitialValues,
  changePasswordValidationSchema,
} from "@/components/forms/profile/ChangePasswordSchema";

const ChangePasswordForm = () => {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: changePasswordInitialValues,
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!user) return;
      try {
        await api.patch(`/users/${user.id}`, { password: values.password });
        toast.success("Contraseña actualizada");
        resetForm();
      } catch (error) {
        toast.error("No se pudo actualizar la contraseña", {
          description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!user) return null;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="mx-auto mt-6 max-w-lg">
      <label className="block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Nueva contraseña
        </span>
        <div className="relative mt-1.5">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
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
          Confirmar nueva contraseña
        </span>
        <div className="relative mt-1.5">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            autoComplete="new-password"
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

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {formik.isSubmitting ? "Guardando..." : "Actualizar contraseña"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
