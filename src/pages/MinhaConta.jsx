
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:3001/api'

function MinhaConta() {
  const { cliente, buscarPerfil, token } = useAuth()

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [pets, setPets] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [salvando, setSalvando] = useState(false)

  const [novoPet, setNovoPet] = useState({
    nome: '',
    especie: 'cachorro',
    raca: '',
    data_nascimento: '',
    observacoes: '',
  })

  async function buscarPets() {
    const response = await fetch(`${API_URL}/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.mensagem || 'Não foi possível carregar seus pets.')
    }

    setPets(data.pets || [])
  }

  async function buscarPedidos() {
    const response = await fetch(`${API_URL}/clientes/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.mensagem || 'Não foi possível carregar seus pedidos.')
    }

    setPedidos(data.pedidos || [])
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        await Promise.all([
          buscarPerfil(),
          buscarPets(),
          buscarPedidos(),
        ])
      } catch (error) {
        setErro(error.message)
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  function atualizarCampo(event) {
    const { name, value } = event.target

    setNovoPet((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  async function cadastrarPet(event) {
    event.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      const response = await fetch(`${API_URL}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoPet),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.mensagem || 'Não foi possível cadastrar o pet.')
      }

      await buscarPets()

      setNovoPet({
        nome: '',
        especie: 'cachorro',
        raca: '',
        data_nascimento: '',
        observacoes: '',
      })
    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  async function excluirPet(id) {
    if (!window.confirm('Tem certeza de que deseja excluir este pet?')) {
      return
    }

    setErro('')

    try {
      const response = await fetch(`${API_URL}/pets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.mensagem || 'Não foi possível excluir o pet.')
      }

      setPets((anteriores) =>
        anteriores.filter((pet) => pet.id !== id)
      )
    } catch (error) {
      setErro(error.message)
    }
  }

  function formatarData(data) {
    if (!data) return 'Não informada'

    const dataFormatada = new Date(data)

    return Number.isNaN(dataFormatada.getTime())
      ? 'Não informada'
      : dataFormatada.toLocaleDateString('pt-BR')
  }

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  if (carregando) {
    return (
      <main>
        <h1>Minha Conta</h1>
        <p>Carregando seus dados...</p>
      </main>
    )
  }

  if (erro && !cliente) {
    return (
      <main>
        <h1>Minha Conta</h1>
        <p>{erro}</p>
      </main>
    )
  }

  return (
    <main className="minha-conta">
      <h1>Minha Conta</h1>

      {erro && <p role="alert">{erro}</p>}

      <section className="dados-cliente">
        <h2>Meus dados</h2>

        <p><strong>Nome:</strong> {cliente?.nome}</p>
        <p><strong>E-mail:</strong> {cliente?.email}</p>
        <p>
          <strong>Cliente desde:</strong>{' '}
          {formatarData(cliente?.criado_em)}
        </p>
      </section>

      <section className="meus-pets">
        <h2>Meus pets</h2>

        {pets.length === 0 ? (
          <p>Você ainda não cadastrou nenhum pet.</p>
        ) : (
          <div className="lista-pets">
            {pets.map((pet) => (
              <article key={pet.id} className="pet-card">
                <h3>{pet.nome}</h3>
                <p><strong>Espécie:</strong> {pet.especie}</p>
                <p><strong>Raça:</strong> {pet.raca || 'Não informada'}</p>
                <p>
                  <strong>Nascimento:</strong>{' '}
                  {formatarData(pet.data_nascimento)}
                </p>

                {pet.observacoes && (
                  <p>
                    <strong>Observações:</strong> {pet.observacoes}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => excluirPet(pet.id)}
                >
                  Excluir pet
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="cadastro-pet">
        <h2>Cadastrar um pet</h2>

        <form onSubmit={cadastrarPet}>
          <div>
            <label htmlFor="nome">Nome do pet</label>
            <input
              id="nome"
              name="nome"
              value={novoPet.nome}
              onChange={atualizarCampo}
              required
            />
          </div>

          <div>
            <label htmlFor="especie">Espécie</label>
            <select
              id="especie"
              name="especie"
              value={novoPet.especie}
              onChange={atualizarCampo}
              required
            >
              <option value="cachorro">Cachorro</option>
              <option value="gato">Gato</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label htmlFor="raca">Raça</label>
            <input
              id="raca"
              name="raca"
              value={novoPet.raca}
              onChange={atualizarCampo}
            />
          </div>

          <div>
            <label htmlFor="data_nascimento">Data de nascimento</label>
            <input
              id="data_nascimento"
              name="data_nascimento"
              type="date"
              value={novoPet.data_nascimento}
              onChange={atualizarCampo}
            />
          </div>

          <div>
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={novoPet.observacoes}
              onChange={atualizarCampo}
            />
          </div>

          <button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Cadastrar pet'}
          </button>
        </form>
      </section>

      <section className="historico-pedidos">
        <h2>Meus pedidos</h2>

        {pedidos.length === 0 ? (
          <p>Você ainda não realizou pedidos nesta conta.</p>
        ) : (
          <div className="lista-pedidos">
            {pedidos.map((pedido) => (
              <article key={pedido.id} className="pedido-card">
                <h3>Pedido #{pedido.id}</h3>

                <p>
                  <strong>Data:</strong>{' '}
                  {formatarData(pedido.criado_em)}
                </p>

                <p>
                  <strong>Status:</strong> {pedido.status}
                </p>

                <p>
                  <strong>Total:</strong>{' '}
                  {formatarMoeda(pedido.valor_total)}
                </p>

                <h4>Produtos</h4>

                {pedido.itens.map((item) => (
                  <p key={item.id}>
                    {item.produto_nome || 'Produto indisponível'}
                    {' — '}
                    {item.quantidade} un.
                    {' — '}
                    {formatarMoeda(item.preco_unitario)}
                  </p>
                ))}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default MinhaConta
