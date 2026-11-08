
import { Link, useLocation } from 'react-router-dom'

function PedidoConfirmado() {
  const location = useLocation()
  const pedido = location.state?.pedido

  function formatPrice(price) {
    return Number(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  if (!pedido) {
    return (
      <main>
        <h1>Confirmação de pedido</h1>

        <p>
          Não encontramos os dados de um pedido nesta página.
        </p>

        <Link to="/mundo-pet">Explorar produtos</Link>
      </main>
    )
  }

  return (
    <main>
      <h1>Pedido recebido!</h1>

      <p>
        Obrigada pela sua compra no Jardim Pet,{' '}
        {pedido.nome_cliente}!
      </p>

      <p>
        Número do pedido: <strong>{pedido.id}</strong>
      </p>

      <p>
        Status: <strong>{pedido.status}</strong>
      </p>

      <h2>Resumo do pedido</h2>

      <ul>
        {pedido.itens.map((item) => (
          <li key={item.id}>
            {item.name} — {item.quantity} unidade(s)
            <br />
            Valor unitário: {formatPrice(item.price)}
          </li>
        ))}
      </ul>

      <p>
        <strong>
          Total: {formatPrice(pedido.total)}
        </strong>
      </p>

      <h2>Endereço de entrega</h2>

      <p>
        {pedido.endereco}, {pedido.numeroEndereco}
        {pedido.complemento
          ? ` - ${pedido.complemento}`
          : ''}
      </p>

      <p>
        Bairro: {pedido.bairro}
      </p>

      <p>
        {pedido.cidade} - {pedido.estado}
      </p>

      <p>
        CEP: {pedido.cep}
      </p>

      <p>
        Esta é uma demonstração de portfólio.
        Nenhum pagamento será realizado.
      </p>

      <Link to="/">Voltar para o início</Link>
    </main>
  )
}

export default PedidoConfirmado
