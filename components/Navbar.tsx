"use client";
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/context/AuthContext'
import { getDashboardPathForRole } from '@/lib/api'
import MobileDrawer from '@/components/MobileDrawer'

const BellIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const HamburgerIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </svg>
)

const BOOKING_STEPS = [
  { step: 1, label: 'Buscar' },
  { step: 2, label: 'Elegir asiento' },
  { step: 3, label: 'Pagar' },
]

const BookingStepper = ({ activeStep }: { activeStep: number }) => (
  <nav className="bustix-dark flex items-center justify-between bg-background px-4 py-4 sm:px-8">
    <Link href="/" className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
      <span className="font-display text-2xl text-foreground">BusTix</span>
    </Link>

    <ol className="flex items-center gap-2 sm:gap-3">
      {BOOKING_STEPS.map(({ step, label }, index) => {
        const isActive = step === activeStep
        const isLast = index === BOOKING_STEPS.length - 1
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-3">
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
                className={`hidden font-mono-label text-xs uppercase sm:inline ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </span>
            {!isLast && <span className="h-px w-5 bg-border sm:w-8" />}
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    closeMenu()
    logout()
    router.push('/')
  }

  if (pathname?.startsWith('/viajes')) {
    const activeStep = pathname.includes('/pagar') ? 3 : pathname.includes('/asiento') ? 2 : 1
    return <BookingStepper activeStep={activeStep} />
  }

  const links = (
    <>
      <Link href="/" onClick={closeMenu} className="text-sm font-bold text-foreground mr-5">
         Inicio
      </Link>
      {!user && (
        <Link href="/#como-funciona" onClick={closeMenu} className="text-sm font-bold text-foreground ">
           Como funciona
        </Link>
      )}


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

          <Link
            href={getDashboardPathForRole(user.role, user.companyId) ?? '/'}
            onClick={closeMenu}
            className="navbar-link"
          >
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
          <Link href="/auth/login" onClick={closeMenu} className="navbar-link">
            Iniciar sesión
          </Link>

          <Link
            href="/auth/register"
            onClick={closeMenu}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Registrarse
          </Link>
        </>
      )}
    </>
  )

  return (
    <nav className="bustix-dark flex items-center justify-between bg-background px-4 py-4 sm:px-8">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <Link href="/" className="font-display text-2xl text-foreground">
          BusTix
        </Link>
      </div>

      <ul className="hidden items-center gap-3 lg:flex">{links}</ul>

      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Abrir menú"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground lg:hidden"
      >
        <HamburgerIcon />
      </button>

      <MobileDrawer isOpen={isMenuOpen} onClose={closeMenu}>
        <ul className="flex flex-col gap-3">{links}</ul>
      </MobileDrawer>
    </nav>
  )
}

export default Navbar
