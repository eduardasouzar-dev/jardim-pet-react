
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('jardim-pet-cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('jardim-pet-cart', JSON.stringify(cartItems))
  }, [cartItems])

  function addToCart(product) {
    const existingItem = cartItems.find(
      (item) => item.id === product.id
    )

    const currentQuantity = existingItem?.quantity || 0

    if (currentQuantity >= product.stock) {
      setCartMessage(
        `Você atingiu o limite de estoque de ${product.name}.`
      )
      return
    }

    setCartItems((currentItems) => {
      const item = currentItems.find(
        (item) => item.id === product.id
      )

      if (item) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentItems, { ...product, quantity: 1 }]
    })

    setCartMessage(`${product.name} foi adicionado ao carrinho!`)
  }

  function clearCartMessage() {
    setCartMessage('')
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    )
  }

  function clearCart() {
    setCartItems([])
  }

  function updateQuantity(productId, quantity) {
    const item = cartItems.find(
      (item) => item.id === productId
    )

    if (!item) return

    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    if (quantity > item.stock) {
      setCartMessage(
        `Estoque disponível de ${item.name}: ${item.stock} unidade(s).`
      )
      return
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )

    setCartMessage('')
  }

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        cartMessage,
        clearCartMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
