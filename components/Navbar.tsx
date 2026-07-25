"use client";
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/context/AuthContext'

const BellIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const BOOKING_STEPS = [
  { step: 1, label: 'Buscar' },
  { step: 2, label: 'Elegir asiento' },
  { step: 3, label: 'Pagar' },
]

const BookingStepper = ({ activeStep }: { activeStep: number }) => (
  <nav className="bustix-dark flex items-center justify-between bg-background px-8 py-4">
    <Link href="/" className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
      <span className="font-display text-2xl text-foreground">BusTix</span>
    </Link>

    <ol className="flex items-center gap-3">
      {BOOKING_STEPS.map(({ step, label }, index) => {
        const isActive = step === activeStep
        const isLast = index === BOOKING_STEPS.length - 1
        return (
          <li key={step} className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground'
                }`}
              >
                {step}
              </span>
              <span
                className={`font-mono-label text-xs uppercase ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </span>
            {!isLast && <span className="h-px w-8 bg-border" />}
          </li>
        )
      })}
    </ol>
  </nav>
)

const Navbar = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (pathname?.startsWith('/viajes')) {

    return <BookingStepper activeStep={1} />
  }

  return (
    <nav className="bustix-dark flex items-center justify-between bg-background px-8 py-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <Link href="/" className="font-display text-2xl text-foreground">
          BusTix
        </Link>
      </div>
      <ul className="flex items-center gap-3">
        <Link href="/" className="text-sm font-bold text-foreground mr-5">
           Inicio
        </Link>
        {!user && (
          <Link href="/#como-funciona" className="text-sm font-bold text-foreground ">
             Como funciona
          </Link>
        )}

        {/* TODO: quitar este acceso directo cuando exista login real de empresas */}
        <Link href="/empresa/dashboard" className="navbar-link">
          Dashboard Empresa
        </Link>

        {/* TODO: quitar este acceso directo cuando haya un flujo real para llegar a /viajes */}
        <Link href="/viajes" className="navbar-link">
          Viajes
        </Link>

        {user ? (
          <>
            <button
              type="button"
              aria-label="Notificaciones"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <BellIcon />
              <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-accent" />
            </button>

            <Link href="/cliente/dashboard" className="navbar-link">
              Hola, {user.name}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="navbar-link">
              Iniciar sesión
            </Link>

            <Link
              href="/auth/register"
              className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Registrarse
            </Link>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar