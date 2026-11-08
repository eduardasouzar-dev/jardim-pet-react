
const jwt = require("jsonwebtoken");

function autenticarAdministrador(req, res, next) {
  try {
    // Obtém o token enviado pelo administrador
    const autorizacao = req.headers.authorization;

    if (!autorizacao) {
      return res.status(401).json({
        mensagem: "Acesso não autorizado. Faça login como administrador.",
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
    const dadosAdministrador = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Confirma se o token pertence a um administrador
    if (dadosAdministrador.tipo !== "administrador") {
      return res.status(403).json({
        mensagem: "Acesso permitido somente para administradores.",
      });
    }

    // Disponibiliza os dados do administrador para a rota
    req.administrador = dadosAdministrador;

    next();

  } catch (erro) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}

module.exports = autenticarAdministrador;
