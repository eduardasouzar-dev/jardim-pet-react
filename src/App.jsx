
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import CartMessage from './components/CartMessage'

import Home from './pages/Home'
import MundoPet from './pages/MundoPet'
import NossoJardim from './pages/NossoJardim'
import Carrinho from './pages/Carrinho'
import FinalizarCompra from './pages/FinalizarCompra'
import PedidoConfirmado from './pages/PedidoConfirmado'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import MinhaConta from './pages/MinhaConta'

function Servicos() {
  return (
    <main>
      <h1>Serviços</h1>
      <p>Conheça os serviços do Jardim Pet.</p>
    </main>
  )
}

function App() {
  return (
    <>
      <Header />

      <CartMessage />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mundo-pet" element={<MundoPet />} />
        <Route path="/nosso-jardim" element={<NossoJardim />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/carrinho" element={<Carrinho />} />

        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/minha-conta" element={<MinhaConta />} />

        <Route
          path="/finalizar-compra"
          element={<FinalizarCompra />}
        />

        <Route
          path="/pedido-confirmado"
          element={<PedidoConfirmado />}
        />
      </Routes>

      <Footer />
    </>
  )
}

export default App
