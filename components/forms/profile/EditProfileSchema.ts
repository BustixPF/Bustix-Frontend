import * as Yup from "yup";
import { editProfileFormValues } from "@/interfaces/profile.interface";
import { AuthUser } from "@/components/context/AuthContext";

export const buildEditProfileInitialValues = (user: AuthUser | null): editProfileFormValues => ({
  name: user?.name ?? "",
  email: user?.email ?? "",
  phone: user?.phone ? String(user.phone) : "",
  address: user?.address ?? "",
  password: "",
  confirmPassword: "",
});

const emptyToUndefined = (value: string) => (value ? value : undefined);

export const editProfileValidationSchema = Yup.object({
  name: Yup.string()
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
  address: Yup.string()
    .transform(emptyToUndefined)
    .min(3, "Mínimo 3 caracteres")
    .max(80, "Máximo 80 caracteres"),
  password: Yup.string()
    .transform(emptyToUndefined)
    .min(8, "Mínimo 8 caracteres")
    .max(15, "Máximo 15 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      "Debe incluir mayúscula, minúscula, número y símbolo"
    ),
  confirmPassword: Yup.string()
    .transform(emptyToUndefined)
    .when("password", {
      is: (value: string | undefined) => !!value,
      then: (schema) =>
        schema
          .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
          .required("Confirma la nueva contraseña"),
    }),
});
