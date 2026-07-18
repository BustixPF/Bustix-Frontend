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
  companyName: Yup.string().required("Nombre de la empresa obligatorio"),
  nit: Yup.string().required("NIT obligatorio"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Correo electrónico obligatorio"),
  phone: Yup.string().required("Teléfono obligatorio"),
  password: Yup.string()
    .min(8, "Mínimo 8 caracteres")
    .required("Contraseña obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
  acceptTerms: Yup.boolean().oneOf([true], "Debes aceptar los términos y condiciones"),
});
