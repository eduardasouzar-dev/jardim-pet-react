
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Header.css'

function BotanicalBranch() {
  return (
    <svg
      className="brand-branch"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M9 54C24 43 37 28 51 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 43C7 43 5 32 7 24C17 24 24 30 18 43Z"
        fill="currentColor"
      />
      <path
        d="M30 31C21 22 26 12 33 7C41 15 41 25 30 31Z"
        fill="currentColor"
      />
      <path
        d="M39 21C39 10 49 6 57 8C57 18 51 26 39 21Z"
        fill="currentColor"
      />
      <path
        d="M23 39L17 29M34 28L32 16M44 19L52 12"
        stroke="#F8F3E8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

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

function Header() {
  const { cartCount } = useCart()
  const { cliente, autenticado, logout } = useAuth()
  const { pathname } = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bumpKey, setBumpKey] = useState(0)

  const headerRef = useRef(null)
  const lastCount = useRef(cartCount)

  const inicial = cliente?.nome?.trim()?.charAt(0)?.toUpperCase() || ''

  const cartLabel = `Carrinho com ${cartCount} ${
    cartCount === 1 ? 'item' : 'itens'
  }`

  // Identifica a rolagem da página
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
    }

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Fecha o menu ao navegar entre páginas
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Fecha o menu com Escape ou clique fora do cabeçalho
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

  // Anima o contador quando a quantidade de itens muda
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

        {/* Marca */}
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
              <span className="brand-period">.</span>
            </span>

            <BotanicalBranch />
          </span>

          <span className="brand-kicker">
            PET <span>&</span> JARDIM
          </span>
        </NavLink>

        {/* Navegação */}
        <nav
          id="header-navigation"
          className="header-navigation"
          aria-label="Navegação principal"
        >
          <NavLink to="/" end>
            Início
          </NavLink>

          <NavLink to="/mundo-pet">
            Mundo Pet
          </NavLink>

          <NavLink to="/nosso-jardim">
            Nosso Jardim
          </NavLink>

          <NavLink to="/servicos">
            Serviços
          </NavLink>
        </nav>

        {/* Carrinho e conta */}
        <div className="header-actions">

          <NavLink
            to="/carrinho"
            className="header-cart"
            aria-label={cartLabel}
          >
            <span className="cart-icon">
              <CartIcon />

              <span
                key={bumpKey}
                className={`cart-count${cartCount === 0 ? ' is-empty' : ''}${
                  bumpKey > 0 ? ' is-bump' : ''
                }`}
                aria-hidden="true"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </span>

            <span className="cart-label">Carrinho</span>
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
              <NavLink to="/login" className="header-login">
                Entrar
              </NavLink>

              <NavLink to="/cadastro" className="header-register">
                Criar conta
                <span aria-hidden="true">↗</span>
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
