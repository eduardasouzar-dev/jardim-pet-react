
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Carrinho.css'

function Carrinho() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart()

  function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <span className="cart-label">JARDIM PET</span>

        <h1>Meu carrinho</h1>

        <p className="cart-intro">
          Confira seus produtos e organize sua seleção.
        </p>

        {cartItems.length === 0 ? (
          <section className="cart-empty">
            <h2>Seu carrinho está vazio</h2>

            <p>
              Que tal explorar nossos produtos para pets e plantas?
            </p>

            <Link to="/mundo-pet" className="cart-continue-button">
              Explorar produtos
            </Link>
          </section>
        ) : (
          <div className="cart-content">
            <section className="cart-items">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <span className="cart-item-category">
                      {item.category === 'pet'
                        ? 'Mundo Pet'
                        : 'Nosso Jardim'}
                    </span>

                    <h2>{item.name}</h2>

                    <p>{formatPrice(item.price)} cada</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-quantity">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <strong>
                      {formatPrice(item.price * item.quantity)}
                    </strong>

                    <button
                      className="cart-remove-button"
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Resumo do pedido</h2>

              <div className="cart-summary-line">
                <span>Subtotal</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <div className="cart-summary-total">
                <span>Total</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <p>
                Esta é uma demonstração de portfólio. Nenhum pagamento
                será realizado.
              </p>

              <Link
                to="/finalizar-compra"
                className="cart-continue-button"
              >
                Finalizar compra
              </Link>
            </aside>
          </div>
        )}

        <Link to="/" className="cart-back-link">
          ← Voltar para o início
        </Link>
      </div>
    </main>
  )
}

export default Carrinho
