"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import EyeIcon from "@/components/forms/register/EyeIcon";
import { api, getApiErrorMessage, uploadProfilePicture } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import { getInitials } from "@/lib/user";
import {
  buildEditProfileInitialValues,
  editProfileValidationSchema,
} from "@/components/forms/profile/EditProfileSchema";

const EditProfileForm = () => {
  const { user, login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePictureSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;

    setIsUploadingPicture(true);
    try {
      const { profilePicture } = await uploadProfilePicture(user.id, file);
      login({ ...user, profilePicture });
      toast.success("Foto de perfil actualizada");
    } catch (error) {
      toast.error("No se pudo subir la foto", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const formik = useFormik({
    initialValues: buildEditProfileInitialValues(user),
    validationSchema: editProfileValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!user) return;
      try {
        const payload: Record<string, unknown> = {
          name: values.name,
          email: values.email,
          phone: Number(values.phone),
        };
        if (values.address.trim()) payload.address = values.address.trim();
        if (values.password) payload.password = values.password;

        const { data } = await api.patch(`/users/${user.id}`, payload);
        login({ ...user, ...data });
        toast.success("Perfil actualizado", {
          description: "Tus datos se guardaron correctamente.",
        });
        router.push("/cliente/dashboard");
      } catch (error) {
        toast.error("No se pudo actualizar el perfil", {
          description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!user) return null;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="mt-6 max-w-lg">
      <div className="flex items-center gap-4">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xl font-bold text-secondary-foreground">
          {user.profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.profilePicture} alt="" className="h-full w-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </span>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePictureSelected}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPicture}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground transition-colors hover:border-primary disabled:opacity-60"
          >
            {isUploadingPicture ? "Subiendo..." : "Cambiar foto"}
          </button>
          <p className="mt-1.5 text-xs text-muted-foreground">JPG o PNG, opcional.</p>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6" />

      <label className="block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Nombre completo
        </span>
        <input
          type="text"
          name="name"
          autoComplete="name"
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
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          DNI
        </span>
        <input
          type="text"
          value={user.dni ?? ""}
          disabled
          className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground outline-none"
        />
        <p className="mt-1 text-xs text-muted-foreground">El DNI no se puede modificar.</p>
      </label>

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Correo electrónico
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
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Teléfono
        </span>
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

      <label className="mt-4 block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Dirección
        </span>
        <input
          type="text"
          name="address"
          autoComplete="street-address"
          placeholder="Opcional"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1.5 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
        />
        {formik.touched.address && formik.errors.address && (
          <p className="mt-1 text-xs text-destructive">{formik.errors.address}</p>
        )}
      </label>

      <div className="mt-6 border-t border-border pt-6">
        <p className="text-sm font-bold text-card-foreground">Cambiar contraseña</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Deja estos campos en blanco si no quieres cambiarla.
        </p>

        <label className="mt-4 block">
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
      </div>

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

export default EditProfileForm;
