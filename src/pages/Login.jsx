
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setErro('')
    setCarregando(true)

    try {
      await login(email, senha)
      navigate('/')
    } catch (error) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-container">
        <h1>Bem-vindo de volta!</h1>

        <p>
          Entre na sua conta para continuar no Jardim Pet.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          {erro && (
            <p className="login-error">{erro}</p>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p>
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro">Criar conta</Link>
        </p>
      </section>
    </main>
  )
}

export default Login
