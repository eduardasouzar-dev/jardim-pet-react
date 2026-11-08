
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const API_URL = 'http://localhost:3001/api'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('jardim-pet-token') || ''
  })

  const [cliente, setCliente] = useState(() => {
    try {
      const clienteSalvo = localStorage.getItem('jardim-pet-cliente')
      return clienteSalvo ? JSON.parse(clienteSalvo) : null
    } catch {
      return null
    }
  })

  async function cadastrar(dados) {
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.mensagem || 'Não foi possível realizar o cadastro.')
    }

    return data
  }

  async function login(email, senha) {
    const response = await fetch(`${API_URL}/clientes/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.mensagem || 'Não foi possível realizar o login.')
    }

    localStorage.setItem('jardim-pet-token', data.token)
    localStorage.setItem('jardim-pet-cliente', JSON.stringify(data.cliente))

    setToken(data.token)
    setCliente(data.cliente)

    return data
  }

  async function buscarPerfil() {
    if (!token) {
      throw new Error('Você precisa estar logado para consultar seu perfil.')
    }

    const response = await fetch(`${API_URL}/clientes/perfil`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.mensagem || 'Não foi possível buscar seu perfil.')
    }

    localStorage.setItem('jardim-pet-cliente', JSON.stringify(data.cliente))
    setCliente(data.cliente)

    return data.cliente
  }

  function logout() {
    localStorage.removeItem('jardim-pet-token')
    localStorage.removeItem('jardim-pet-cliente')

    setToken('')
    setCliente(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        cliente,
        autenticado: Boolean(token),
        cadastrar,
        login,
        buscarPerfil,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
