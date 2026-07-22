import * as Yup from "yup";
import { companyRegisterFormValues } from "@/interfaces/register.interface";

export const companyRegisterInitialValues: companyRegisterFormValues = {
  companyName: "",
  nit: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export const companyRegisterValidationSchema = Yup.object({
  companyName: Yup.string()
    .matches(/^[\p{L}\p{N}\s.-]+$/u, "El nombre solo puede contener letras, números, puntos y guiones")
    .min(3, "Mínimo 3 caracteres")
    .max(150, "Máximo 150 caracteres")
    .required("Nombre de la empresa obligatorio"),
  nit: Yup.string()
    .matches(/^(\d{1,3}(\.\d{3}){0,3}|\d{4,10})(-\d)?$/, "Formato de NIT inválido (solo números, puntos y guión)")
    .min(8, "Mínimo 8 caracteres")
    .max(17, "Máximo 17 caracteres")
    .required("NIT obligatorio"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .max(50, "Máximo 50 caracteres")
    .required("Correo electrónico obligatorio"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "El teléfono solo puede contener números")
    .min(7, "Mínimo 7 dígitos")
    .max(15, "Máximo 15 dígitos")
    .required("Teléfono obligatorio"),
  password: Yup.string()
    .min(8, "Mínimo 8 caracteres")
    .max(15, "Máximo 15 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      "Debe incluir mayúscula, minúscula, número y símbolo"
    )
    .required("Contraseña obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
  acceptTerms: Yup.boolean().oneOf([true], "Debes aceptar los términos y condiciones"),
});
