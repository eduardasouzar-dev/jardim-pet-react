
import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:3001/api/produtos'

function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Não foi possível buscar os produtos.')
        }

        const data = await response.json()

        const formattedProducts = data.map((product) => ({
          id: product.id,
          name: product.nome,
          category: product.categoria,
          type: product.subcategoria || 'Outros',
          price: Number(product.preco),
          description: product.descricao || '',
          image: product.imagem || '',
          stock: product.estoque,
        }))

        setProducts(formattedProducts)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
        setError(
          'Não foi possível carregar os produtos. Verifique se o back-end está funcionando.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export default useProducts
