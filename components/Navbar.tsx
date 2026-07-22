"use client";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/context/AuthContext'

const BellIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const Navbar = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
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