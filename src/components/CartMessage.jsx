
import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import './CartMessage.css'

function CartMessage() {
  const { cartMessage, clearCartMessage } = useCart()

  useEffect(() => {
    if (!cartMessage) {
      return
    }

    const timeout = setTimeout(() => {
      clearCartMessage()
    }, 3000)

    return () => clearTimeout(timeout)
  }, [cartMessage, clearCartMessage])

  if (!cartMessage) {
    return null
  }

  return (
    <div className="cart-message" role="status">
      <span className="cart-message-icon">✓</span>
      <span>{cartMessage}</span>

      <button
        type="button"
        className="cart-message-close"
        onClick={clearCartMessage}
        aria-label="Fechar mensagem"
      >
        ×
      </button>
    </div>
  )
}

export default CartMessage
