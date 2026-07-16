const Footer = () => {
  return (
    <footer className="bustix-dark bg-background px-8 py-10 text-foreground">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="font-display text-2xl text-foreground">BusTix</span>
        </div>
        <p className="mt-3 max-w-md text-muted-foreground">
          La forma más fácil de comparar y comprar pasajes de bus, todo en un
          solo lugar.
        </p>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2026 BusTix. Todos los derechos reservados.
          </p>
          <p className="font-mono-label text-sm text-muted-foreground">
            Hecho por estudiantes de SoyHenry
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
