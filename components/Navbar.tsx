"use client";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/context/AuthContext'

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
        <Link href="/#como-funciona" className="text-sm font-bold text-foreground ">
           Como funciona
        </Link>

        {user ? (
          <>
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
            <Link href="/Auth/login" className="navbar-link">
              Iniciar sesión
            </Link>

            <Link
              href="/Auth/register"
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