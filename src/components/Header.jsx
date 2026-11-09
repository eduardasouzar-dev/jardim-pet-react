import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Header.css'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4H5L7.5 16H19L21 8H6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.3" fill="currentColor" />
      <circle cx="18" cy="20" r="1.3" fill="currentColor" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="8.5"
        r="3.6"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4.5 20c0.8-3.8 3.9-6 7.5-6s6.7 2.2 7.5 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      className="btn-arrow"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LeafMark() {
  return (
    <svg
      className="brand-leaf"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="leaf-blade"
        d="M3.5 20.5C3.5 11 9 3.5 20.5 3.5C20.5 14 14.5 20.5 3.5 20.5Z"
      />
      <path className="leaf-vein" d="M3.5 20.5L14 10" />
    </svg>
  )
}

function Header() {
  const { cartCount } = useCart()
  const { cliente, autenticado, logout } = useAuth()
  const { pathname } = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bumpKey, setBumpKey] = useState(0)

  const headerRef = useRef(null)
  const lastCount = useRef(cartCount)

  const inicial =
    cliente?.nome?.trim()?.charAt(0)?.toUpperCase() || ''

  const cartLabel = `Carrinho com ${cartCount} ${
    cartCount === 1 ? 'item' : 'itens'
  }`

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  useEffect(() => {
    if (lastCount.current === cartCount) return

    lastCount.current = cartCount
    setBumpKey((key) => key + 1)
  }, [cartCount])

  const headerClass = [
    'site-header',
    scrolled ? 'is-scrolled' : '',
    menuOpen ? 'is-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header ref={headerRef} className={headerClass}>
      <div className="header-bar">

        {/* Identidade da marca */}
        <NavLink
          to="/"
          end
          className="header-brand"
          aria-label="Jardim Pet - Início"
        >
          <span className="brand-composition">
            <span className="brand-name">
              <span className="brand-jardim">Jardim</span>
              <span className="brand-pet">Pet</span>
              <LeafMark />
            </span>
          </span>

          <span className="brand-kicker">
            Petshop <span>&</span> Jardinagem
          </span>
        </NavLink>

        {/* Navegação principal */}
        <nav
          id="header-navigation"
          className="header-navigation"
          aria-label="Navegação principal"
        >
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/mundo-pet">Mundo Pet</NavLink>
          <NavLink to="/nosso-jardim">Nosso Jardim</NavLink>
          <NavLink to="/servicos">Serviços</NavLink>

          {/* Só aparece no menu mobile (ver CSS) */}
          {!autenticado && (
            <NavLink to="/cadastro" className="nav-cta">
              Criar conta
              <ArrowIcon />
            </NavLink>
          )}
        </nav>

        {/* Ações da loja */}
        <div className="header-actions">

          <NavLink
            to="/carrinho"
            className="header-cart"
            aria-label={cartLabel}
          >
            <span className="cart-icon">
              <CartIcon />

              {cartCount > 0 && (
                <span
                  key={bumpKey}
                  className={`cart-count${bumpKey > 0 ? ' is-bump' : ''}`}
                  aria-hidden="true"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>

            <span className="cart-label">Sacola</span>
          </NavLink>

          <span
            className="header-action-divider"
            aria-hidden="true"
          />

          {autenticado ? (
            <div className="header-user">
              <span
                className="header-greeting"
                title={cliente?.nome}
              >
                {inicial && (
                  <span className="user-avatar" aria-hidden="true">
                    {inicial}
                  </span>
                )}

                <span className="greeting-text">
                  Olá, <strong>{cliente?.nome}</strong>
                </span>
              </span>

              <button
                type="button"
                className="header-logout"
                onClick={() => logout()}
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="header-account">
              <NavLink
                to="/login"
                className="header-login"
                aria-label="Entrar"
              >
                <span className="login-icon" aria-hidden="true">
                  <UserIcon />
                </span>
                <span className="login-text">Entrar</span>
              </NavLink>

              <NavLink to="/cadastro" className="header-register">
                Criar conta
                <ArrowIcon />
              </NavLink>
            </div>
          )}
        </div>

        {/* Menu responsivo */}
        <button
          type="button"
          className="header-toggle"
          aria-expanded={menuOpen}
          aria-controls="header-navigation"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="toggle-line" />
          <span className="toggle-line" />
        </button>
      </div>
    </header>
  )
}

export default Header
