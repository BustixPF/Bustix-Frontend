import * as Yup from "yup";
import { searchFormValues } from "@/interfaces/search.interfaces";

export const searchInitialValues: searchFormValues = {
  origin: "Medellín (Ant.)",
  destination: "Bogotá (D.C.)",
  departureDate: "",
  returnDate: "",
};

export const searchValidationSchema = Yup.object({
  origin: Yup.string().required("Elige un origen"),
  destination: Yup.string()
    .required("Elige un destino")
    .notOneOf([Yup.ref("origin")], "El destino debe ser distinto al origen"),
  departureDate: Yup.string().required("Elige la fecha de ida"),
  returnDate: Yup.string().notRequired(),
});