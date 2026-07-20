"use client";
import { useState } from "react";
import PassengerRegisterForm from "@/components/forms/register/PassengerRegisterForm";
import CompanyRegisterForm from "@/components/forms/register/CompanyRegisterForm";

type RegisterRole = "pasajero" | "empresa";

const RegisterRoleSwitcher = () => {
  const [role, setRole] = useState<RegisterRole>("pasajero");

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("pasajero")}
          aria-pressed={role === "pasajero"}
          className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            role === "pasajero"
              ? "bg-primary text-primary-foreground"
              : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"
          }`}
        >
          Pasajero
        </button>
        <button
          type="button"
          onClick={() => setRole("empresa")}
          aria-pressed={role === "empresa"}
          className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            role === "empresa"
              ? "bg-primary text-primary-foreground"
              : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"
          }`}
        >
          Empresa de transporte
        </button>
      </div>

      <div className="grid" key={role}>
        <div className={`[grid-area:1/1] ${role === "pasajero" ? "" : "invisible"}`}>
          <PassengerRegisterForm />
        </div>
        <div className={`[grid-area:1/1] ${role === "empresa" ? "" : "invisible"}`}>
          <CompanyRegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterRoleSwitcher;
