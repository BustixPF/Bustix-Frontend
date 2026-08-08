"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchCompanies,
  approveCompany,
  rejectCompany,
  getApiErrorMessage,
  type Company,
} from "@/lib/api";
import RejectCompanyModal from "./RejectCompanyModal";

const DocumentIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

const CompanyRequestsCard = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Company | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const all = await fetchCompanies();
      if (!cancelled) {
        setCompanies(all.filter((company) => company.status === "pending"));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleApprove = async (company: Company) => {
    setPendingActionId(company.id);
    try {
      await approveCompany(company.id);
      setCompanies((prev) => (prev ?? []).filter((c) => c.id !== company.id));
      toast.success(`${company.name} fue aprobada`);
    } catch (error) {
      toast.error("No se pudo aprobar la empresa", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setPendingActionId(null);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setPendingActionId(rejectTarget.id);
    try {
      await rejectCompany(rejectTarget.id, reason || undefined);
      setCompanies((prev) => (prev ?? []).filter((c) => c.id !== rejectTarget.id));
      toast.success(`${rejectTarget.name} fue rechazada`);
      setRejectTarget(null);
    } catch (error) {
      toast.error("No se pudo rechazar la empresa", {
        description: getApiErrorMessage(error, "Intenta de nuevo en unos minutos"),
      });
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg text-card-foreground">Solicitudes de empresa</h3>
        {companies !== null && companies.length > 0 && (
          <span className="font-mono-label text-xs text-muted-foreground">
            {companies.length} pendiente{companies.length === 1 ? "" : "s"}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Empresas esperando aprobación para operar en la plataforma.
      </p>

      {companies === null ? (
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No hay solicitudes pendientes.</p>
      ) : (
        <div className="mt-4 flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1">
          {companies.map((company) => (
            <div key={company.id} className="rounded-xl border border-border p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base text-card-foreground">{company.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    NIT {company.nit} · {company.email}
                    {company.phone ? ` · ${company.phone}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(company)}
                    disabled={pendingActionId === company.id}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
                  >
                    {pendingActionId === company.id ? "..." : "Aprobar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectTarget(company)}
                    disabled={pendingActionId === company.id}
                    className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-card-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
                  >
                    Rechazar
                  </button>
                </div>
              </div>

              <div className="mt-3 border-t border-border pt-3">
                <p className="font-mono-label text-[10.5px] uppercase text-muted-foreground">
                  Documentos cargados
                </p>
                {!company.documents || company.documents.length === 0 ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Esta empresa no cargó documentos.
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {company.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-card-foreground transition-colors hover:border-primary"
                      >
                        <DocumentIcon />
                        {doc.filename}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectTarget && (
        <RejectCompanyModal
          companyName={rejectTarget.name}
          isSubmitting={pendingActionId === rejectTarget.id}
          onConfirm={handleReject}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
};

export default CompanyRequestsCard;
