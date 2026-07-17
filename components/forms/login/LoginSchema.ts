import * as Yup from "yup";
import { loginFormValues } from "@/interfaces/login.interface";

export const loginInitialValues: loginFormValues = {
  email: "",
  password: "",
};

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Correo electrónico obligatorio"),
  password: Yup.string().required("Contraseña obligatoria"),
});