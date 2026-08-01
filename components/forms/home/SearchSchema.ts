import * as Yup from "yup";
import { searchFormValues } from "@/interfaces/search.interface";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const searchInitialValues: searchFormValues = {
  origin: "",
  destination: "",
  departureDate: "",
  returnDate: "",
};

export const searchValidationSchema = Yup.object({
  origin: Yup.string().max(100, "Máximo 100 caracteres").required("Ingresa una ruta de origen"),
  destination: Yup.string()
    .max(100, "Máximo 100 caracteres")
    .required("Ingresa una ruta de destino")
    .notOneOf([Yup.ref("origin")], "El destino debe ser distinto al origen"),
  departureDate: Yup.string()
    .required("Elige la fecha de ida")

    .test(
      "not-in-past",
      "La fecha de ida no puede ser anterior a hoy",
      (value) => !value || value >= todayISO()
    ),
  returnDate: Yup.string().notRequired(),
});