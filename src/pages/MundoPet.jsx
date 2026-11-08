
import { useState } from 'react'
import useProducts from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import './MundoPet.css'

function MundoPet() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('Todos')

  const { products, loading, error } = useProducts()

  const petProducts = products.filter((product) => {
    const matchesCategory = product.category === 'pet'

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
        .filter((product) => product.category === 'pet')
        .map((product) => product.type)
    ),
  ]

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
        ) : petProducts.length > 0 ? (
          <div className="product-grid">
            {petProducts.map((product) => (
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

export default MundoPet
