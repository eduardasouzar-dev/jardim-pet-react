
import { useCart } from '../context/CartContext'
import './ProductModal.css'

function ProductModal({ product, onClose }) {
  const { addToCart } = useCart()

  if (!product) {
    return null
  }

  function handleAddToCart() {
    addToCart(product)
    onClose()
  }

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="product-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes do produto"
        >
          ×
        </button>

        <span className="product-modal-category">
          {product.category === 'pet' ? 'Mundo Pet' : 'Nosso Jardim'}
        </span>

        <h2 id="product-modal-title">{product.name}</h2>

        <p className="product-modal-type">{product.type}</p>

        <p className="product-modal-description">
          {product.description}
        </p>

        <p className="product-modal-price">
          {product.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>

        <button
          className="product-modal-action"
          type="button"
          onClick={handleAddToCart}
        >
          Adicionar ao carrinho
        </button>
      </section>
    </div>
  )
}

export default ProductModal
