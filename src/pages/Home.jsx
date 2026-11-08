import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-visual">
          <img
            className="hero-image"
            src="/images/jardim-pet-hero-direita-v2.jpg"
            alt="Cachorro caramelo em um ambiente acolhedor cercado por plantas"
            decoding="async"
          />

          <div className="hero-image-caption">
            <span className="caption-dot" />
            <span>Bem-estar que começa em casa.</span>
          </div>
        </div>

        <div className="hero-content">
          <span className="hero-eyebrow">Pet &amp; Jardim</span>

          <h1>
            Dois mundos
            <br />
            que combinam
            <br />
            <em className="hero-title-highlight">
              com você.
              <svg
                className="title-leaf"
                viewBox="0 0 32 32"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M7 29C9 20 14 12 23 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  fill="currentColor"
                  d="M11.2 19.4C6.5 18.6 4.6 14 6 10c4.6.4 7.4 4 5.2 9.4Z"
                />
                <path
                  fill="currentColor"
                  d="M15.4 13.6c.6-4.9 4.2-7.7 8.4-7.6.6 4.8-2.2 8.2-8.4 7.6Z"
                />
                <path
                  fill="currentColor"
                  d="M13.2 21.2c4.2-1.6 8.4-.4 10.6 3.4-3.4 3.2-8.2 2.6-10.6-3.4Z"
                />
              </svg>
            </em>
          </h1>

          <p className="hero-description">
            Produtos para o cuidado dos pets e uma seleção
            especial para quem gosta de trazer a natureza
            para perto. Tudo reunido em um só lugar.
          </p>

          <div className="hero-actions">
            <Link to="/mundo-pet" className="hero-button">
              Explore o Mundo Pet
              <span aria-hidden="true">↗</span>
            </Link>

            <Link to="/nosso-jardim" className="hero-secondary-link">
              Conheça nosso Jardim
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="hero-signature">
            <span className="hero-signature-symbol" aria-hidden="true">✳</span>
            <span>Cuidado que faz parte de todos os dias.</span>
          </div>
        </div>
      </section>

      <section className="home-intro">
        <div className="home-intro-heading">
          <span className="home-intro-label">
            Descubra nossos universos
          </span>

          <h2>
            Um mundo de
            <br />
            cuidados e
            <br />
            <em>boas escolhas.</em>
          </h2>
        </div>

        <div className="home-intro-content">
          <p>
            Cada casa tem sua própria história, seus hábitos
            e detalhes que a tornam única. Os animais que
            fazem parte da família e as plantas que compõem
            nossos ambientes ajudam a contar essa história.
          </p>

          <p>
            No Jardim Pet, você encontra produtos para a
            rotina dos seus animais e opções para trazer
            mais personalidade aos seus espaços. Tudo
            reunido para tornar suas escolhas mais práticas
            e agradáveis.
          </p>

          <div className="home-intro-links">
            <Link to="/mundo-pet">
              <span>01</span>
              Mundo Pet
              <span aria-hidden="true">↗</span>
            </Link>

            <Link to="/nosso-jardim">
              <span>02</span>
              Nosso Jardim
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
