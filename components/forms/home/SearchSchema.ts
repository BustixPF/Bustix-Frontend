import * as Yup from "yup";
import { searchFormValues } from "@/interfaces/search.interface";

export const searchInitialValues: searchFormValues = {
  origin: "Medellín (Ant.)",
  destination: "Cali (Valle)",
  departureDate: "",
  returnDate: "",
};

export const searchValidationSchema = Yup.object({
  origin: Yup.string().max(100, "Máximo 100 caracteres").required("Elige un origen"),
  destination: Yup.string()
    .max(100, "Máximo 100 caracteres")
    .required("Elige un destino")
    .notOneOf([Yup.ref("origin")], "El destino debe ser distinto al origen"),
  departureDate: Yup.string().required("Elige la fecha de ida"),
  returnDate: Yup.string().notRequired(),
});