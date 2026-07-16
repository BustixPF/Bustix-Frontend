export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-text">
      <section className="w-full max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Bustix
        </p>
        <h1 className="font-headline text-4xl text-text sm:text-6xl">
          Frontend listo para empezar.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
          Esta base usa Next.js, TypeScript, Tailwind CSS, ESLint y una
          estructura similar al proyecto de M4.
        </p>
      </section>
    </main>
  );
}
