"use client";
import { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import { loginInitialValues, loginValidationSchema } from "@/components/forms/login/LoginSchema";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: () => {
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="mt-6">
      <label className="block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Correo electrónico
        </span>
        <input
          type="email"
          name="email"
          placeholder="tú@correo.com"
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

            {showPassword ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M17.94 17.94A10.97 10.97 0 0112 20c-5 0-9.27-3.11-11-7 1.08-2.23 2.95-4.09 5.28-5.28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.password}</p>
        )}
      </label>

      <div className="mt-2 text-right">
        <Link href="/auth/forgot-password" className="text-xs font-semibold text-accent hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Iniciar sesión
      </button>
    </form>
  );
};

export default LoginForm;