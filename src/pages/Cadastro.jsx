
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Cadastro() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
  })

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setDados((dadosAnteriores) => ({
      ...dadosAnteriores,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setErro('')
    setCarregando(true)

    try {
      await cadastrar(dados)

      navigate('/login', {
        state: {
          mensagem: 'Cadastro realizado com sucesso! Faça seu login.',
        },
      })
    } catch (error) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-container">
        <h1>Crie sua conta!</h1>

        <p>
          Faça parte do Jardim Pet e aproveite nossas novidades.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={dados.nome}
              onChange={handleChange}
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={dados.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              value={dados.senha}
              onChange={handleChange}
              placeholder="Crie uma senha"
              minLength={8}
              required
            />
          </div>

          {erro && (
            <p className="cadastro-error">{erro}</p>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Criar minha conta'}
          </button>
        </form>

        <p>
          Já tem uma conta?{' '}
          <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  )
}

export default Cadastro
