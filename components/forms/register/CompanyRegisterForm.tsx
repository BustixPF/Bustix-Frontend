"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import EyeIcon from "@/components/forms/register/EyeIcon";
import { api, getApiErrorMessage, uploadCompanyDocument } from "@/lib/api";
import {
  companyRegisterInitialValues,
  companyRegisterValidationSchema,
} from "@/components/forms/register/CompanyRegisterSchema";

type FileStatus = "pending" | "uploading" | "success" | "error";

interface FileEntry {
  file: File;
  status: FileStatus;
  error?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const CompanyRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const finish = () => {
    toast.success("Empresa registrada", {
      description: "Te contactaremos para habilitar el acceso a tu cuenta.",
    });
    router.push("/");
  };

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (!selected || selected.length === 0) return;
    const newEntries: FileEntry[] = Array.from(selected).map((file) => ({
      file,
      status: "pending",
    }));
    event.target.value = "";
    setFiles((prev) => [...prev, ...newEntries]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadOne = async (index: number) => {
    if (!companyId) return;
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "uploading" } : f)));
    try {
      await uploadCompanyDocument(companyId, files[index].file);
      setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "success" } : f)));
    } catch (error) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: "error", error: getApiErrorMessage(error, "Error al subir") }
            : f
        )
      );
    }
  };

  const handleUploadAllAndFinish = async () => {
    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "success") {
        await uploadOne(i);
      }
    }
    setIsUploading(false);
    finish();
  };

  const formik = useFormik({
    initialValues: companyRegisterInitialValues,
    validationSchema: companyRegisterValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await api.post("/companies", {
          name: values.companyName,
          nit: values.nit,
          email: values.email,
          phone: values.phone,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        setCompanyId(data.id);
        setStep(2);
      } catch (error) {
        toast.error("No se pudo registrar la empresa", {
          description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="mt-4">
      {step === 1 && (
      <>
      <label className="block">
        <span className="font-mono-label text-xs uppercase text-muted-foreground">
          Nombre de la empresa
        </span>
        <input
          type="text"
          name="companyName"
          autoComplete="organization"
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
          autoComplete="email"
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
          autoComplete="tel"
          placeholder="300 000 0000"
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
      </>
      )}

      {step === 2 && (
        <div>
          <p className="font-mono-label text-xs uppercase text-muted-foreground">
            Sube tus documentos (opcional)
          </p>
          <p className="text-xs text-muted-foreground">
            Cámara de comercio, RUT u otro documento que respalde tu empresa. Puedes omitir este paso y subirlos más adelante.
          </p>

          <input
            type="file"
            multiple
            onChange={handleFilesSelected}
            className="mt-3 w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-card-foreground outline-none focus:border-primary"
          />

          {files.length > 0 && (
            <ul className="mt-3 flex flex-col gap-2">
              {files.map((entry, index) => (
                <li
                  key={`${entry.file.name}-${index}`}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm"
                >
                  <span className="min-w-0 truncate text-card-foreground">
                    {entry.file.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(entry.file.size)})
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center gap-2">
                    {entry.status === "pending" && (
                      <>
                        <span className="text-xs text-muted-foreground">Pendiente</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          aria-label="Quitar archivo"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </button>
                      </>
                    )}
                    {entry.status === "uploading" && (
                      <span className="text-xs text-muted-foreground">Subiendo…</span>
                    )}
                    {entry.status === "success" && (
                      <span className="text-xs font-semibold text-primary">✓ Subido</span>
                    )}
                    {entry.status === "error" && (
                      <>
                        <span className="text-xs text-destructive">{entry.error ?? "Error"}</span>
                        <button
                          type="button"
                          onClick={() => uploadOne(index)}
                          className="text-xs font-semibold text-accent hover:underline"
                        >
                          Reintentar
                        </button>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={finish}
              disabled={isUploading}
              className="flex-1 rounded-full border border-border py-3 text-sm font-semibold text-card-foreground transition-colors hover:border-primary disabled:opacity-60"
            >
              Continuar sin documentos
            </button>
            <button
              type="button"
              onClick={handleUploadAllAndFinish}
              disabled={isUploading}
              className="flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
            >
              {isUploading ? "Subiendo..." : "Subir y finalizar"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default CompanyRegisterForm;
