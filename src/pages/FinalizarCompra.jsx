
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:3001/api'

function FinalizarCompra() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { token, cliente } = useAuth()
  const navigate = useNavigate()

  const [dados, setDados] = useState({
    nome: cliente?.nome || '',
    email: cliente?.email || '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  })

  const [enviando, setEnviando] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setDados((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }))
  }

  function formatPrice(price) {
    return Number(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio.')
      return
    }

    if (enviando) return

    setEnviando(true)

    try {
      const comprador = {
        nome: dados.nome.trim(),
        email: dados.email.trim(),
        telefone: dados.telefone.trim(),
        cep: dados.cep.trim(),
        endereco: dados.endereco.trim(),
        numero: dados.numero.trim(),
        complemento: dados.complemento.trim(),
        bairro: dados.bairro.trim(),
        cidade: dados.cidade.trim(),
        estado: dados.estado.trim().toUpperCase(),
      }

      const itens = cartItems.map((item) => ({
        produto_id: item.id,
        quantidade: item.quantity,
      }))

      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          comprador,
          itens,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.mensagem || 'Não foi possível registrar o pedido.'
        )
      }

      const pedidoRegistrado = data.pedido

      const pedido = {
        id: pedidoRegistrado.id,
        numero: pedidoRegistrado.id,
        nome: pedidoRegistrado.nome_cliente,
        nome_cliente: pedidoRegistrado.nome_cliente,
        email: pedidoRegistrado.email,
        telefone: comprador.telefone,
        itens: cartItems.map((item) => ({ ...item })),
        total: Number(pedidoRegistrado.valor_total),
        status: pedidoRegistrado.status,
        cep: comprador.cep,
        endereco: comprador.endereco,
        numeroEndereco: comprador.numero,
        complemento: comprador.complemento,
        bairro: comprador.bairro,
        cidade: comprador.cidade,
        estado: comprador.estado,
      }

      clearCart()

      navigate('/pedido-confirmado', {
        state: { pedido },
      })

    } catch (erro) {
      console.error('Erro ao finalizar compra:', erro)
      alert(erro.message || 'Ocorreu um erro ao finalizar a compra.')

    } finally {
      setEnviando(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <main>
        <h1>Finalizar compra</h1>

        <p>Seu carrinho está vazio.</p>

        <Link to="/mundo-pet">Ver produtos</Link>
      </main>
    )
  }

  return (
    <main>
      <h1>Finalizar compra</h1>

      <p>Preencha seus dados para continuar com o pedido.</p>

      {token && cliente ? (
        <p>
          Você está comprando como cliente cadastrado: {cliente.nome}.
        </p>
      ) : (
        <p>
          Você está comprando como visitante.
          Já possui cadastro? <Link to="/login">Faça login</Link>.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <h2>Seus dados</h2>

        <label htmlFor="nome">Nome completo</label>
        <input
          id="nome"
          name="nome"
          value={dados.nome}
          onChange={handleChange}
          required={!token}
        />

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          value={dados.email}
          onChange={handleChange}
          required={!token}
        />

        <label htmlFor="telefone">Telefone</label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          value={dados.telefone}
          onChange={handleChange}
          required
        />

        <h2>Endereço de entrega</h2>

        <label htmlFor="cep">CEP</label>
        <input
          id="cep"
          name="cep"
          value={dados.cep}
          onChange={handleChange}
          required
        />

        <label htmlFor="endereco">Rua ou avenida</label>
        <input
          id="endereco"
          name="endereco"
          value={dados.endereco}
          onChange={handleChange}
          required
        />

        <label htmlFor="numero">Número</label>
        <input
          id="numero"
          name="numero"
          value={dados.numero}
          onChange={handleChange}
          required
        />

        <label htmlFor="complemento">
          Complemento (opcional)
        </label>
        <input
          id="complemento"
          name="complemento"
          value={dados.complemento}
          onChange={handleChange}
        />

        <label htmlFor="bairro">Bairro</label>
        <input
          id="bairro"
          name="bairro"
          value={dados.bairro}
          onChange={handleChange}
          required
        />

        <label htmlFor="cidade">Cidade</label>
        <input
          id="cidade"
          name="cidade"
          value={dados.cidade}
          onChange={handleChange}
          required
        />

        <label htmlFor="estado">Estado (UF)</label>
        <input
          id="estado"
          name="estado"
          maxLength={2}
          value={dados.estado}
          onChange={handleChange}
          required
        />

        <h2>Resumo do pedido</h2>

        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} — {item.quantity} x{' '}
              {formatPrice(item.price)}
            </li>
          ))}
        </ul>

        <p>
          <strong>Total: {formatPrice(cartTotal)}</strong>
        </p>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Registrando pedido...' : 'Confirmar pedido'}
        </button>
      </form>

      <p>
        <Link to="/carrinho">Voltar ao carrinho</Link>
      </p>

      <p>
        Esta é uma demonstração de portfólio.
        Nenhum pagamento será realizado.
      </p>
    </main>
  )
}

export default FinalizarCompra
