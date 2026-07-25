"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ResultadosViajes from "@/components/viajes/page";

const todayISO = () => new Date().toISOString().slice(0, 10);

const ViajesPageContent = () => {
  const searchParams = useSearchParams();

  const origin = searchParams.get("origen") ?? "Medellín (Ant.)";
  const destination = searchParams.get("destino") ?? "Bogotá (D.C.)";
  const dateISO = searchParams.get("fecha") ?? todayISO();
  const passengers = Number(searchParams.get("pasajeros")) || 1;

  return (
    <ResultadosViajes
      origin={origin}
      destination={destination}
      dateISO={dateISO}
      passengers={passengers}
    />
  );
};

export default function ViajesPage() {
  return (
    <Suspense fallback={null}>
      <ViajesPageContent />
    </Suspense>
  );
}