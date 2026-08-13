"use client";
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/context/AuthContext'
import { getDashboardPathForRole, fetchMyTickets, fetchSuperAdminPendingSummary } from '@/lib/api'
import { SWR_KEYS } from '@/lib/swrKeys'
import MobileDrawer from '@/components/MobileDrawer'
import LogoutConfirmModal from '@/components/LogoutConfirmModal'
import NotificationsDropdown from '@/components/NotificationsDropdown'
import SuperAdminNotificationsDropdown from '@/components/SuperAdminNotificationsDropdown'

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
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
  const NOTIFICATIONS_LAST_SEEN_KEY = 'bustix_notifications_last_seen'

  const isSuperAdmin = user?.role === 'superAdmin'
  // El admin de empresa no compra tiquetes (el dropdown de cliente no le
  // sirve) y todavia no hay forma de avisarle sobre aprobaciones de ruta/
  // horario - se le oculta la campana entera hasta que eso exista.
  const isCompanyAdmin = user?.role === 'admin'

  // El superAdmin no compra tiquetes - para el, "no leido" es que haya
  // solicitudes pendientes, no una compra nueva. Misma clave que usan las
  // cards del dashboard, asi que al aprobar/rechazar algo ahi la campanita
  // se actualiza sola, sin recargar la pagina.
  const { data: pendingSummary } = useSWR(
    isSuperAdmin ? SWR_KEYS.superAdminPendingSummary : null,
    fetchSuperAdminPendingSummary
  )
  const hasUnread = isSuperAdmin
    ? Boolean(pendingSummary && pendingSummary.companies + pendingSummary.routes + pendingSummary.schedules > 0)
    : hasUnreadNotifications

  useEffect(() => {
    if (!user || isCompanyAdmin || isSuperAdmin) return
    let cancelled = false

    fetchMyTickets().then((tickets) => {
      if (cancelled) return
      const latest = tickets
        .map((ticket) => ticket.purchaseDate)
        .sort()
        .at(-1)
      if (!latest) {
        setHasUnreadNotifications(false)
        return
      }
      const lastSeen = window.localStorage.getItem(NOTIFICATIONS_LAST_SEEN_KEY)
      setHasUnreadNotifications(!lastSeen || latest > lastSeen)
    })
    return () => {
      cancelled = true
    }
  }, [user, isSuperAdmin, isCompanyAdmin])

  const handleToggleNotifications = () => {
    setIsNotificationsOpen((prev) => {
      const next = !prev
      // El indicador del superAdmin refleja si sigue habiendo pendientes,
      // no se "marca como leido" al abrir el panel.
      if (next && !isSuperAdmin) {
        fetchMyTickets().then((tickets) => {
          const latest = tickets
            .map((ticket) => ticket.purchaseDate)
            .sort()
            .at(-1)
          if (latest) {
            window.localStorage.setItem(NOTIFICATIONS_LAST_SEEN_KEY, latest)
          }
        })
        setHasUnreadNotifications(false)
      }
      return next
    })
  }


  useEffect(() => {
    if (!isNotificationsOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNotificationsOpen])

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
          {!isCompanyAdmin && (
            <div ref={notificationsRef} className="relative">
              <button
                type="button"
                aria-label="Notificaciones"
                aria-expanded={isNotificationsOpen}
                onClick={handleToggleNotifications}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <BellIcon />
                {user && hasUnread && (
                  <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-accent" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-full z-50 mt-2">
                  {isSuperAdmin ? <SuperAdminNotificationsDropdown /> : <NotificationsDropdown />}
                </div>
              )}
            </div>
          )}

          <Link
            href={getDashboardPathForRole(user.role, user.companyId) ?? '/'}
            onClick={closeMenu}
            className="navbar-link"
          >
            Hola, {user.name}
          </Link>
          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(true)}
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

  // El drawer mobile es vertical y de ancho fijo (260px) - reusar "links" tal
  // cual (pensado para un nav horizontal compacto) dejaba la campanita como
  // un circulo huerfano sin relacion visual con el resto. Cada item aca es
  // una fila de ancho completo, consistente entre si.
  const mobileMenuItemClass =
    "rounded-lg px-3 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-card"

  const mobileMenu = (
    <div className="flex flex-col gap-1">
      <Link href="/" onClick={closeMenu} className={mobileMenuItemClass}>
        Inicio
      </Link>
      {!user && (
        <Link href="/#como-funciona" onClick={closeMenu} className={mobileMenuItemClass}>
          Como funciona
        </Link>
      )}

      {user ? (
        <>
          {!isCompanyAdmin && (
            <div>
              <button
                type="button"
                aria-label="Notificaciones"
                aria-expanded={isNotificationsOpen}
                onClick={handleToggleNotifications}
                className={`flex w-full items-center justify-between ${mobileMenuItemClass}`}
              >
                <span className="flex items-center gap-2">
                  <BellIcon />
                  Notificaciones
                </span>
                {hasUnread && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="mt-2 px-1 [&>div]:w-full">
                  {isSuperAdmin ? <SuperAdminNotificationsDropdown /> : <NotificationsDropdown />}
                </div>
              )}
            </div>
          )}

          <Link
            href={getDashboardPathForRole(user.role, user.companyId) ?? '/'}
            onClick={closeMenu}
            className={mobileMenuItemClass}
          >
            Hola, {user.name}
          </Link>

          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="mt-2 rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <Link href="/auth/login" onClick={closeMenu} className={mobileMenuItemClass}>
            Iniciar sesión
          </Link>

          <Link
            href="/auth/register"
            onClick={closeMenu}
            className="mt-2 rounded-full bg-primary py-2.5 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Registrarse
          </Link>
        </>
      )}
    </div>
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
        {mobileMenu}
      </MobileDrawer>

      {isLogoutConfirmOpen && (
        <LogoutConfirmModal
          onConfirm={() => {
            setIsLogoutConfirmOpen(false)
            handleLogout()
          }}
          onClose={() => setIsLogoutConfirmOpen(false)}
        />
      )}
    </nav>
  )
}

export default Navbar;