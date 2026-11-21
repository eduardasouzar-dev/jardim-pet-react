
import { useState } from 'react'
import useProducts from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import './MundoPet.css'

function MundoPet() {
  const [search, setSearch] = useState('')

  const { products, loading, error } = useProducts()

  const sections = [
    'Alimentação',
    'Roupas e acessórios',
    'Brinquedos',
    'Conforto e descanso',
  ]

  const petProducts = products.filter(
    (product) => product.category === 'pet'
  )

  const filteredProducts = petProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="catalog-page">
      <section className="catalog-intro">
        <span className="catalog-eyebrow">UM MUNDO DE CUIDADOS</span>

        <h1>Mundo Pet</h1>

        <p>
          Encontre produtos para deixar a rotina do seu
          companheiro ainda mais especial.
        </p>
      </section>

      <section className="catalog-section">
        <div className="catalog-toolbar">
          <h2>Nossos produtos</h2>

          <input
            type="search"
            placeholder="Buscar produto..."
            aria-label="Buscar produto"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p>Carregando produtos...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          sections.map((section) => {
            const sectionProducts = filteredProducts.filter(
              (product) => product.type === section
            )

            if (sectionProducts.length === 0) {
              return null
            }

            return (
              <section className="catalog-category" key={section}>
                <div className="catalog-category-header">
                  <h2>{section}</h2>
                  <span>{sectionProducts.length} produtos</span>
                </div>

                <div className="product-grid">
                  {sectionProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              </section>
            )
          })
        )}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <p className="catalog-empty">
              Nenhum produto encontrado. Tente outra busca.
            </p>
          )}
      </section>
    </main>
  )
}

export default MundoPet
