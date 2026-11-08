
import { useState } from 'react'
import useProducts from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import './NossoJardim.css'

function NossoJardim() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('Todos')

  const { products, loading, error } = useProducts()

  const gardenProducts = products.filter((product) => {
    const matchesCategory = product.category === 'jardim'

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesType =
      selectedType === 'Todos' || product.type === selectedType

    return matchesCategory && matchesSearch && matchesType
  })

  const types = [
    'Todos',
    ...new Set(
      products
        .filter((product) => product.category === 'jardim')
        .map((product) => product.type)
    ),
  ]

  return (
    <main className="catalog-page">
      <section className="garden-intro">
        <span className="catalog-eyebrow">
          CULTIVE SEU CANTINHO
        </span>

        <h1>Nosso Jardim</h1>

        <p>
          Plantas, vasos e pequenos detalhes para trazer
          mais natureza e vida para o seu dia a dia.
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

        {!loading && !error && (
          <div className="catalog-filters" aria-label="Filtrar por categoria">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                className={
                  selectedType === type
                    ? 'filter-button active'
                    : 'filter-button'
                }
                onClick={() => setSelectedType(type)}
                aria-pressed={selectedType === type}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p>Carregando produtos...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : gardenProducts.length > 0 ? (
          <div className="product-grid">
            {gardenProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="catalog-empty">
            Nenhum produto encontrado. Tente outra busca ou categoria.
          </p>
        )}
      </section>
    </main>
  )
}

export default NossoJardim
