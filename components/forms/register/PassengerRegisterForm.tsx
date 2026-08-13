"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import EyeIcon from "@/components/forms/register/EyeIcon";
import TermsModal from "@/components/forms/register/TermsModal";
import PrivacyModal from "@/components/forms/register/PrivacyModal";
import { api, fetchCurrentUser, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import {
  passengerRegisterInitialValues,
  passengerRegisterValidationSchema,
} from "@/components/forms/register/PassengerRegisterSchema";

// Mismo ícono que antes vivía en app/auth/login/page.tsx — se mueve aquí
// junto con el botón de Google, ya no se usa en el login.
const GoogleLogo = () => (
  <svg
    className="h-4 w-4 grayscale transition-all duration-200 group-hover:grayscale-0"
    viewBox="0 0 48 48"
    aria-hidden
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

// Misma llamada que antes disparaba el login con Google.
const handleGoogleRegister = () => {
  // Ruta relativa: pasa por el rewrite de next.config.ts (mismo origen que
  // el navegador), no directo a Railway — así la cookie queda same-site.
  window.location.href = "/api/auth/google";
};

const PassengerRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: passengerRegisterInitialValues,
    validationSchema: passengerRegisterValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // 1. Registro del usuario en Backend
        const { data: signUpData } = await api.post("/auth/signup", {
          name: values.fullName,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          dni: Number(values.dni),
          phone: Number(values.phone),
        });

        // 2. Autenticación inmediata (El Backend asigna la Cookie HttpOnly)
        await api.post("/auth/signin", {
          email: values.email,
          password: values.password,
        });

        // 3. Trae los datos reales del perfil desde el Backend
        const profile = await fetchCurrentUser();
        if (!profile) {
          toast.error("No se pudo iniciar sesión", {
            description: "Tu cuenta se creó, intenta iniciar sesión de nuevo",
          });
          return;
        }

        login(profile);
        toast.success("Cuenta creada", { description: signUpData.message });
        router.push("/cliente/dashboard");
      } catch (error) {
        toast.error("No se pudo crear la cuenta", {
          description: getApiErrorMessage(
            error,
            "Intenta de nuevo en unos minutos"
          ),
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
    <form onSubmit={formik.handleSubmit} noValidate className="mt-4">
      <label className="block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Nombre completo
        </span>
        <input
          type="text"
          name="fullName"
          autoComplete="name"
          placeholder="Jose Avendaño"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <p className="mt-1 text-xs text-destructive">
            {formik.errors.fullName}
          </p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          DNI
        </span>
        <input
          type="text"
          name="dni"
          placeholder="40123456"
          value={formik.values.dni}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.dni && formik.errors.dni && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.dni}</p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Correo electrónico
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="tú@correo.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="mt-1 text-xs text-destructive">
            {formik.errors.email}
          </p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Teléfono
        </span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="300 000 0000"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="mt-1 text-xs text-destructive">
            {formik.errors.phone}
          </p>
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
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="mt-1 text-xs text-destructive">
            {formik.errors.password}
          </p>
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
            aria-label={
              showConfirmPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <EyeIcon open={showConfirmPassword} />
          </button>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="mt-1 text-xs text-destructive">
            {formik.errors.confirmPassword}
          </p>
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
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsTermsOpen(true);
            }}
            className="font-bold text-accent underline-offset-2 hover:underline"
          >
            Términos y condiciones
          </button>{" "}
          y la{" "}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsPrivacyOpen(true);
            }}
            className="font-bold text-accent underline-offset-2 hover:underline"
          >
            Política de privacidad
          </button>
          .
        </span>
      </label>
      {formik.touched.acceptTerms && formik.errors.acceptTerms && (
        <p className="mt-1 text-xs text-destructive">
          {formik.errors.acceptTerms}
        </p>
      )}

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
      >
        {formik.isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      {/* Separador visual */}
      <div className="mt-6 flex items-center gap-2" aria-hidden="true">
        <span className="h-2 w-2 rounded-full border border-border bg-card" />
        <span className="h-px flex-1 border-t border-dashed border-border" />
        <span className="h-2 w-2 rounded-full border border-border bg-card" />
      </div>

      {/* Botón Google OAuth (movido desde la pantalla de inicio de sesión) */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="group flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-card-foreground transition-colors hover:border-primary cursor-pointer"
        >
          <GoogleLogo />
          Google
        </button>
      </div>
    </form>

    <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
};

export default PassengerRegisterForm;