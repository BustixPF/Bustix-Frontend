import * as Yup from "yup";
import type { Company } from "@/lib/api";

export interface EditCompanyFormValues {
  name: string;
  nit: string;
  email: string;
  phone: string;
}

export const buildEditCompanyInitialValues = (company: Company | null): EditCompanyFormValues => ({
  name: company?.name ?? "",
  nit: company?.nit ?? "",
  email: company?.email ?? "",
  phone: company?.phone ?? "",
});

// El NIT no se valida porque se muestra de solo lectura - el back rechaza
// (IsNumberString) el mismo formato con guion que ya tienen guardado todas
// las empresas reales (ej. "902555667-7"), asi que no se puede reenviar tal
// cual sin que la actualizacion falle. Se deja afuera del payload de submit.
export const editCompanyValidationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[\p{L}\p{N}\s.-]+$/u, "El nombre solo puede contener letras, números, puntos y guiones")
    .min(3, "Mínimo 3 caracteres")
    .max(150, "Máximo 150 caracteres")
    .required("Nombre de la empresa obligatorio"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .max(50, "Máximo 50 caracteres")
    .required("Correo electrónico obligatorio"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "El teléfono solo puede contener números")
    .min(7, "Mínimo 7 dígitos")
    .max(15, "Máximo 15 dígitos")
    .required("Teléfono obligatorio"),
});
