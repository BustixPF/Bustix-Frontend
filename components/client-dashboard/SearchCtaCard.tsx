import Link from "next/link";

const SearchCtaCard = () => {
  return (
    <div className="rounded-2xl bg-secondary p-8 text-secondary-foreground">
      <h2 className="font-display text-xl leading-tight whitespace-nowrap">
        ¿A dónde vas hoy?
      </h2>
      <p className="mt-4 text-sm text-secondary-foreground/80">
        Compara precios y horarios de más de 60 empresas.
      </p>
      <Link
        href="/#rutas-populares"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:brightness-95"
      >
        Buscar buses →
      </Link>
    </div>
  );
};

export default SearchCtaCard;
