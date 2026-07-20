import * as Yup from "yup";
import { passengerRegisterFormValues } from "@/interfaces/register.interface";

export const passengerRegisterInitialValues: passengerRegisterFormValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export const passengerRegisterValidationSchema = Yup.object({
  fullName: Yup.string()
    .matches(/^[\p{L}\s]+$/u, "El nombre solo puede contener letras")
    .min(3, "Mínimo 3 caracteres")
    .max(100, "Máximo 100 caracteres")
    .required("Nombre completo obligatorio"),
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
    .max(50, "Máximo 50 caracteres")
    .required("Contraseña obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
  acceptTerms: Yup.boolean().oneOf([true], "Debes aceptar los términos y condiciones"),
});
