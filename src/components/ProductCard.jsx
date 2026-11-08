
import { useState } from 'react'
import ProductModal from './ProductModal'
import './ProductCard.css'

function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <article className="product-card">
        <button
          className="product-card-open"
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label={`Ver detalhes de ${product.name}`}
        >
          <div className="product-card-image">
            <span>
              {product.category === 'pet' ? 'Mundo Pet' : 'Nosso Jardim'}
            </span>
          </div>

          <div className="product-card-content">
            <p className="product-card-type">{product.type}</p>

            <h2>{product.name}</h2>

            <p className="product-card-description">
              {product.description}
            </p>

            <p className="product-card-price">
              {product.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>

            <span className="product-card-details">
              Ver detalhes do produto →
            </span>
          </div>
        </button>
      </article>

      {isModalOpen && (
        <ProductModal
          product={product}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}

export default ProductCard
