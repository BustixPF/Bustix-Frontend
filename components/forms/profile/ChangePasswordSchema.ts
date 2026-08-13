import * as Yup from "yup";

export interface ChangePasswordFormValues {
  password: string;
  confirmPassword: string;
}

export const changePasswordInitialValues: ChangePasswordFormValues = {
  password: "",
  confirmPassword: "",
};

export const changePasswordValidationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Mínimo 8 caracteres")
    .max(15, "Máximo 15 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      "Debe incluir mayúscula, minúscula, número y símbolo"
    )
    .required("Nueva contraseña obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma la nueva contraseña"),
});
