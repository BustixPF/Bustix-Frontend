import * as Yup from "yup";
import { passengerRegisterFormValues } from "@/interfaces/register.interface";

export const passengerRegisterInitialValues: passengerRegisterFormValues = {
  fullName: "",
  dni: "",
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
  dni: Yup.string()
    .matches(/^[0-9]+$/, "El DNI solo puede contener números")
    .min(6, "Mínimo 6 dígitos")
    .max(10, "Máximo 10 dígitos")
    .required("DNI obligatorio"),
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
