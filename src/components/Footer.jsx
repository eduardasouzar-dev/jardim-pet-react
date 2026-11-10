import { Link } from 'react-router-dom'
import './Footer.css'

function ArrowRightIcon() {
  return (
    <svg
      className="footer-arrow"
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

function ArrowUpIcon() {
  return (
    <svg
      className="footer-arrow footer-arrow-up"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 19V5M6 11l6-6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Footer() {
  function handleBackToTop() {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* Marca e apresentação */}
        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo"
            aria-label="Jardim Pet - Início"
          >
            <span className="brand-jardim">Jardim</span>
            <span className="brand-pet">Pet</span>
            <span className="brand-period">.</span>
          </Link>

          <p className="footer-tagline">
            Um espaço para cuidar de quem você ama
            e cultivar a natureza.
          </p>

          <div className="footer-cta">
            <Link to="/servicos" className="footer-cta-button">
              Conheça nossos serviços
              <ArrowRightIcon />
            </Link>
          </div>
        </div>

        {/* Navegação */}
        <div className="footer-links">
          <h2 id="footer-explore">Explore</h2>

          <nav aria-labelledby="footer-explore">
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/mundo-pet">Mundo Pet</Link></li>
              <li><Link to="/nosso-jardim">Nosso Jardim</Link></li>
              <li><Link to="/servicos">Serviços</Link></li>
            </ul>
          </nav>
        </div>

        {/* Institucional */}
        <div className="footer-links">
          <h2 id="footer-institucional">Institucional</h2>

          <nav aria-labelledby="footer-institucional">
            <ul>
              <li><Link to="/sobre">Sobre nós</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </nav>
        </div>

      </div>

      {/* Informações finais */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Jardim Pet.
          Projeto fictício para portfólio.
        </p>

        <p>
          Desenvolvido por{' '}
          <a
            href="https://github.com/eduardasouzar-dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Meu GitHub (abre em uma nova aba)"
          >
            Meu GitHub
          </a>
        </p>

        <button
          type="button"
          className="footer-back-top"
          onClick={handleBackToTop}
        >
          Voltar ao topo
          <ArrowUpIcon />
        </button>
      </div>

    </footer>
  )
}

export default Footer
