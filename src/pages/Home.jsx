
import { Link } from 'react-router-dom'
import './Home.css'

function ArrowIcon() {
  return (
    <svg
      className="home-arrow"
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

function Home() {
  return (
    <main className="home">
      {/* HERO PRINCIPAL */}
      <section className="hero">
        <div className="hero-visual">
          <div className="hero-photo hero-photo-pet">
            <img
              className="hero-image"
              src="/images/jardim-pet-hero-direita-v2.jpg"
              alt="Cachorro caramelo em um ambiente acolhedor cercado por plantas"
              decoding="async"
            />
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
              <ArrowIcon />
            </Link>

            <Link to="/nosso-jardim" className="hero-secondary-link">
              Conheça nosso Jardim
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* SEGUNDA SEÇÃO — NOSSO JARDIM */}
      <section className="home-intro">
        <div className="home-intro-media">
          <div className="home-intro-image-wrap home-intro-image-main">
            <img
              className="home-intro-image"
              src="/images/home-jardim-2.jpg"
              alt="Planta em um ambiente residencial iluminado"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="home-intro-image-wrap home-intro-image-secondary">
            <img
              className="home-intro-image"
              src="/images/hero-2.jpg"
              alt="Folhagem de Monstera em destaque"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="home-intro-content">
          <span className="home-intro-label">
            Nosso Jardim
          </span>

          <h2>
            A natureza
            <br />
            transforma
            <br />
            <em>os espaços.</em>
          </h2>

          <p>
            Plantas têm o poder de transformar ambientes
            e trazer mais vida para a rotina. Descubra
            espécies e detalhes que aproximam a natureza
            da sua casa.
          </p>

          <Link
            to="/nosso-jardim"
            className="home-intro-cta"
          >
            Conheça nosso Jardim
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home
