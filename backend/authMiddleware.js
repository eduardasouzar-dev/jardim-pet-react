const jwt = require("jsonwebtoken");

function autenticarCliente(req, res, next) {
  try {
    // Obtém o token enviado pelo cliente
    const autorizacao = req.headers.authorization;

    if (!autorizacao) {
      return res.status(401).json({
        mensagem: "Acesso não autorizado. Faça login.",
      });
    }

    // Verifica o formato Bearer do token
    const partes = autorizacao.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        mensagem: "Formato de token inválido.",
      });
    }

    const token = partes[1];

    // Verifica se o token é válido
    const dadosCliente = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Disponibiliza os dados do cliente para a rota
    req.cliente = dadosCliente;

    next();

  } catch (erro) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}

module.exports = autenticarCliente;