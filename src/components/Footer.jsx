
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
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

          <p>
            Um espaço para cuidar de quem você ama
            e cultivar a natureza.
          </p>

          <div className="footer-cta">
            <Link to="/servicos" className="footer-cta-button">
              Conheça nossos serviços
              <span aria-hidden="true">→</span>
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
          >
            Meu GitHub
          </a>
        </p>

        <a href="#root" className="footer-back-top">
          Voltar ao topo ↑
        </a>
      </div>

    </footer>
  )
}

export default Footer
