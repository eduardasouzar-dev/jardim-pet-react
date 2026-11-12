require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const autenticarCliente = require("./authMiddleware");
const autenticarAdministrador = require("./autenticarAdministrador");

const app = express();
const PORT = 3001;

// Permite que o React acesse o back-end
app.use(cors());

// Permite receber e interpretar dados em JSON
app.use(express.json());

// Configuração da conexão com o MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Identifica o cliente quando estiver logado,
// mas também permite compras como visitante.
function identificarClienteOpcional(req, res, next) {
  const autorizacao = req.headers.authorization;

  // Se não houver token, continua como visitante
  if (!autorizacao) {
    req.cliente = null;
    return next();
  }

  const partes = autorizacao.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({
      mensagem: "Formato de token inválido.",
    });
  }

  try {
    const token = partes[1];
    const dadosCliente = jwt.verify(token, process.env.JWT_SECRET);

    req.cliente = dadosCliente;
    return next();
  } catch (erro) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}

// ==========================================
// ROTA 1 - TESTAR O SERVIDOR
// GET /api/status
// ==========================================

app.get("/api/status", (req, res) => {
  return res.status(200).json({
    mensagem: "Back-end do Jardim Pet funcionando!",
    status: "online",
  });
});

// ==========================================
// ROTA 2 - TESTAR CONEXÃO COM O MYSQL
// GET /api/banco
// ==========================================

app.get("/api/banco", async (req, res) => {
  try {
    const [resultado] = await pool.query(
      "SELECT DATABASE() AS banco, VERSION() AS versao"
    );

    return res.status(200).json({
      mensagem: "Conexão com o MySQL funcionando!",
      banco: resultado[0].banco,
      versao: resultado[0].versao,
    });
  } catch (erro) {
    console.error("Erro ao conectar ao MySQL:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível conectar ao banco de dados.",
    });
  }
});

// ==========================================
// ROTA 3 - BUSCAR PRODUTOS
// GET /api/produtos
// ==========================================

app.get("/api/produtos", async (req, res) => {
  try {
    const [produtos] = await pool.query(
      `SELECT
        id,
        nome,
        descricao,
        preco,
        categoria,
        subcategoria,
        estoque,
        imagem
       FROM produtos
       WHERE ativo = TRUE
       ORDER BY id`
    );

    return res.status(200).json(produtos);
  } catch (erro) {
    console.error("Erro ao buscar produtos:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível buscar os produtos.",
    });
  }
});

// ==========================================
// BUSCAR UM PRODUTO PELO ID
// GET /api/produtos/:id
// ==========================================

app.get("/api/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Informe um ID de produto válido.",
      });
    }

    const [produtos] = await pool.execute(
      `SELECT
        id,
        nome,
        descricao,
        preco,
        categoria,
        subcategoria,
        estoque,
        imagem
       FROM produtos
       WHERE id = ? AND ativo = TRUE`,
      [id]
    );

    if (produtos.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado.",
      });
    }

    return res.status(200).json(produtos[0]);
  } catch (erro) {
    console.error("Erro ao buscar produto:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível buscar o produto.",
    });
  }
});

// ==========================================
// ROTA 4 - CADASTRAR PRODUTO
// POST /api/produtos
// ==========================================

app.post("/api/produtos", async (req, res) => {
  try {
    const {
      nome,
      descricao,
      preco,
      categoria,
      subcategoria,
      estoque,
      imagem,
    } = req.body;

    // Valida os campos obrigatórios
    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      !["pet", "jardim"].includes(categoria) ||
      preco === undefined ||
      preco === null ||
      preco === "" ||
      !Number.isFinite(Number(preco)) ||
      Number(preco) <= 0
    ) {
      return res.status(400).json({
        mensagem:
          "Informe um nome, uma categoria válida (pet ou jardim) e um preço maior que zero.",
      });
    }

    // Valida a subcategoria, quando informada
    if (
      subcategoria !== undefined &&
      subcategoria !== null &&
      typeof subcategoria !== "string"
    ) {
      return res.status(400).json({
        mensagem: "A subcategoria deve ser um texto.",
      });
    }

    const subcategoriaNormalizada =
      typeof subcategoria === "string" && subcategoria.trim()
        ? subcategoria.trim()
        : null;

    // Valida o estoque
    const quantidadeEstoque = Number(estoque ?? 0);

    if (
      !Number.isInteger(quantidadeEstoque) ||
      quantidadeEstoque < 0
    ) {
      return res.status(400).json({
        mensagem:
          "O estoque deve ser um número inteiro igual ou maior que zero.",
      });
    }

    // Insere o produto no banco de dados
    const [resultado] = await pool.execute(
      `INSERT INTO produtos
        (nome, descricao, preco, categoria, subcategoria, estoque, imagem)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nome.trim(),
        typeof descricao === "string" && descricao.trim()
          ? descricao.trim()
          : null,
        Number(preco),
        categoria,
        subcategoriaNormalizada,
        quantidadeEstoque,
        typeof imagem === "string" && imagem.trim()
          ? imagem.trim()
          : null,
      ]
    );

    return res.status(201).json({
      mensagem: "Produto cadastrado com sucesso!",
      produto: {
        id: resultado.insertId,
        nome: nome.trim(),
        descricao:
          typeof descricao === "string" && descricao.trim()
            ? descricao.trim()
            : null,
        preco: Number(preco).toFixed(2),
        categoria,
        subcategoria: subcategoriaNormalizada,
        estoque: quantidadeEstoque,
        imagem:
          typeof imagem === "string" && imagem.trim()
            ? imagem.trim()
            : null,
      },
    });
  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível cadastrar o produto.",
    });
  }
});

// ==========================================
// CADASTRAR CLIENTE
// POST /api/clientes
// ==========================================

app.post("/api/clientes", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof senha !== "string" ||
      senha.length < 8
    ) {
      return res.status(400).json({
        mensagem:
          "Informe nome, e-mail e uma senha com pelo menos 8 caracteres.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const [clientesExistentes] = await pool.execute(
      "SELECT id FROM clientes WHERE email = ?",
      [emailNormalizado]
    );

    if (clientesExistentes.length > 0) {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado.",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [resultado] = await pool.execute(
      `INSERT INTO clientes (nome, email, senha)
       VALUES (?, ?, ?)`,
      [nome.trim(), emailNormalizado, senhaHash]
    );

    return res.status(201).json({
      mensagem: "Cliente cadastrado com sucesso!",
      cliente: {
        id: resultado.insertId,
        nome: nome.trim(),
        email: emailNormalizado,
      },
    });
  } catch (erro) {
    console.error("Erro ao cadastrar cliente:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível cadastrar o cliente.",
    });
  }
});

// ==========================================
// LOGIN DE CLIENTE
// POST /api/clientes/login
// ==========================================

app.post("/api/clientes/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof senha !== "string" ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: "Informe seu e-mail e sua senha.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const [clientes] = await pool.execute(
      `SELECT id, nome, email, senha
       FROM clientes
       WHERE email = ?`,
      [emailNormalizado]
    );

    if (clientes.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const cliente = clientes[0];

    const senhaCorreta = await bcrypt.compare(
      senha,
      cliente.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      {
        id: cliente.id,
        email: cliente.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      },
    });
  } catch (erro) {
    console.error("Erro ao realizar login:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível realizar o login.",
    });
  }
});

// ==========================================
// LOGIN DE ADMINISTRADOR
// POST /api/administradores/login
// ==========================================

app.post("/api/administradores/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof senha !== "string" ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: "Informe seu e-mail e sua senha.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const [administradores] = await pool.execute(
      `SELECT id, nome, email, senha
       FROM administradores
       WHERE email = ?`,
      [emailNormalizado]
    );

    if (administradores.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const administrador = administradores[0];

    const senhaCorreta = await bcrypt.compare(
      senha,
      administrador.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      {
        id: administrador.id,
        email: administrador.email,
        tipo: "administrador",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({
      mensagem: "Login administrativo realizado com sucesso!",
      token,
      administrador: {
        id: administrador.id,
        nome: administrador.nome,
        email: administrador.email,
      },
    });
  } catch (erro) {
    console.error("Erro ao realizar login administrativo:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível realizar o login administrativo.",
    });
  }
});

// ==========================================
// PERFIL DO CLIENTE
// GET /api/clientes/perfil
// ==========================================

app.get("/api/clientes/perfil", autenticarCliente, async (req, res) => {
  try {
    const [clientes] = await pool.execute(
      `SELECT id, nome, email, criado_em
       FROM clientes
       WHERE id = ?`,
      [req.cliente.id]
    );

    if (clientes.length === 0) {
      return res.status(404).json({
        mensagem: "Cliente não encontrado.",
      });
    }

    return res.status(200).json({
      mensagem: "Acesso autorizado!",
      cliente: clientes[0],
    });
  } catch (erro) {
    console.error("Erro ao buscar perfil:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível buscar o perfil.",
    });
  }
});

// ==========================================
// CADASTRAR PET
// POST /api/pets
// ==========================================

app.post("/api/pets", autenticarCliente, async (req, res) => {
  try {
    const {
      nome,
      especie,
      raca,
      data_nascimento,
      observacoes,
    } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      !["cachorro", "gato", "outro"].includes(especie)
    ) {
      return res.status(400).json({
        mensagem: "Informe o nome e uma espécie válida para o pet.",
      });
    }

    if (
      raca !== undefined &&
      raca !== null &&
      typeof raca !== "string"
    ) {
      return res.status(400).json({
        mensagem: "A raça deve ser um texto.",
      });
    }

    if (
      observacoes !== undefined &&
      observacoes !== null &&
      typeof observacoes !== "string"
    ) {
      return res.status(400).json({
        mensagem: "As observações devem ser um texto.",
      });
    }

    const [resultado] = await pool.execute(
      `INSERT INTO pets
       (cliente_id, nome, especie, raca, data_nascimento, observacoes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.cliente.id,
        nome.trim(),
        especie,
        raca?.trim() || null,
        data_nascimento || null,
        observacoes?.trim() || null,
      ]
    );

    return res.status(201).json({
      mensagem: "Pet cadastrado com sucesso!",
      pet: {
        id: resultado.insertId,
        cliente_id: req.cliente.id,
        nome: nome.trim(),
        especie,
        raca: raca?.trim() || null,
        data_nascimento: data_nascimento || null,
        observacoes: observacoes?.trim() || null,
      },
    });
  } catch (erro) {
    console.error("Erro ao cadastrar pet:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível cadastrar o pet.",
    });
  }
});

// ==========================================
// LISTAR PETS DO CLIENTE
// GET /api/pets
// ==========================================

app.get("/api/pets", autenticarCliente, async (req, res) => {
  try {
    const [pets] = await pool.execute(
      `SELECT
        id,
        nome,
        especie,
        raca,
        data_nascimento,
        observacoes,
        criado_em
       FROM pets
       WHERE cliente_id = ? AND ativo = TRUE
       ORDER BY criado_em DESC`,
      [req.cliente.id]
    );

    return res.status(200).json({
      mensagem: "Pets encontrados com sucesso!",
      quantidade: pets.length,
      pets,
    });
  } catch (erro) {
    console.error("Erro ao listar pets:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível listar os pets.",
    });
  }
});

// ==========================================
// ATUALIZAR PET
// PUT /api/pets/:id
// ==========================================

app.put("/api/pets/:id", autenticarCliente, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Informe um ID de pet válido.",
      });
    }

    const [pets] = await pool.execute(
      `SELECT id, nome, especie, raca, data_nascimento, observacoes
       FROM pets
       WHERE id = ? AND cliente_id = ? AND ativo = TRUE`,
      [id, req.cliente.id]
    );

    if (pets.length === 0) {
      return res.status(404).json({
        mensagem: "Pet não encontrado.",
      });
    }

    const petAtual = pets[0];

    const {
      nome,
      especie,
      raca,
      data_nascimento,
      observacoes,
    } = req.body;

    const novoNome = nome === undefined ? petAtual.nome : nome;

    const novaEspecie =
      especie === undefined ? petAtual.especie : especie;

    const novaRaca =
      raca === undefined ? petAtual.raca : raca;

    const novaDataNascimento =
      data_nascimento === undefined
        ? petAtual.data_nascimento
        : data_nascimento;

    const novasObservacoes =
      observacoes === undefined
        ? petAtual.observacoes
        : observacoes;

    if (
      typeof novoNome !== "string" ||
      !novoNome.trim() ||
      !["cachorro", "gato", "outro"].includes(novaEspecie)
    ) {
      return res.status(400).json({
        mensagem: "Informe um nome e uma espécie válida para o pet.",
      });
    }

    if (
      novaRaca !== null &&
      novaRaca !== undefined &&
      typeof novaRaca !== "string"
    ) {
      return res.status(400).json({
        mensagem: "A raça deve ser um texto.",
      });
    }

    if (
      novasObservacoes !== null &&
      novasObservacoes !== undefined &&
      typeof novasObservacoes !== "string"
    ) {
      return res.status(400).json({
        mensagem: "As observações devem ser um texto.",
      });
    }

    await pool.execute(
      `UPDATE pets
       SET nome = ?, especie = ?, raca = ?,
           data_nascimento = ?, observacoes = ?
       WHERE id = ? AND cliente_id = ?`,
      [
        novoNome.trim(),
        novaEspecie,
        novaRaca?.trim() || null,
        novaDataNascimento || null,
        novasObservacoes?.trim() || null,
        id,
        req.cliente.id,
      ]
    );

    return res.status(200).json({
      mensagem: "Pet atualizado com sucesso!",
      pet: {
        id,
        nome: novoNome.trim(),
        especie: novaEspecie,
        raca: novaRaca?.trim() || null,
        data_nascimento: novaDataNascimento || null,
        observacoes: novasObservacoes?.trim() || null,
      },
    });
  } catch (erro) {
    console.error("Erro ao atualizar pet:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível atualizar o pet.",
    });
  }
});

// ==========================================
// EXCLUIR PET
// DELETE /api/pets/:id
// ==========================================

app.delete("/api/pets/:id", autenticarCliente, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Informe um ID de pet válido.",
      });
    }

    const [pets] = await pool.execute(
      `SELECT id
       FROM pets
       WHERE id = ? AND cliente_id = ? AND ativo = TRUE`,
      [id, req.cliente.id]
    );

    if (pets.length === 0) {
      return res.status(404).json({
        mensagem: "Pet não encontrado.",
      });
    }

    await pool.execute(
      `UPDATE pets
       SET ativo = FALSE
       WHERE id = ? AND cliente_id = ?`,
      [id, req.cliente.id]
    );

    return res.status(200).json({
      mensagem: "Pet excluído com sucesso!",
      id,
    });
  } catch (erro) {
    console.error("Erro ao excluir pet:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível excluir o pet.",
    });
  }
});

// ==========================================
// EXCLUIR PRODUTO
// DELETE /api/produtos/:id
// ==========================================

app.delete("/api/produtos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Informe um ID de produto válido.",
      });
    }

    const [produtos] = await pool.execute(
      `SELECT id
       FROM produtos
       WHERE id = ? AND ativo = TRUE`,
      [id]
    );

    if (produtos.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado ou já está inativo.",
      });
    }

    await pool.execute(
      `UPDATE produtos
       SET ativo = FALSE
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      mensagem: "Produto excluído com sucesso!",
      id,
    });
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível excluir o produto.",
    });
  }
});

// ==========================================
// CRIAR PEDIDO (CLIENTE LOGADO OU VISITANTE)
// POST /api/pedidos
// ==========================================

app.post("/api/pedidos", identificarClienteOpcional, async (req, res) => {
  let conexao;

  try {
    const { comprador, itens } = req.body;

    if (
      !comprador ||
      typeof comprador !== "object" ||
      Array.isArray(comprador)
    ) {
      return res.status(400).json({
        mensagem: "Informe os dados do comprador.",
      });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        mensagem: "O pedido precisa ter pelo menos um produto.",
      });
    }

    const camposObrigatorios = [
      "telefone",
      "endereco",
      "numero",
      "bairro",
      "cidade",
      "estado",
      "cep",
    ];

    for (const campo of camposObrigatorios) {
      if (
        typeof comprador[campo] !== "string" ||
        !comprador[campo].trim()
      ) {
        return res.status(400).json({
          mensagem: `O campo ${campo} é obrigatório.`,
        });
      }
    }

    if (!/^[a-zA-Z]{2}$/.test(comprador.estado.trim())) {
      return res.status(400).json({
        mensagem: "Informe uma sigla de estado válida.",
      });
    }

    if (
      comprador.complemento != null &&
      typeof comprador.complemento !== "string"
    ) {
      return res.status(400).json({
        mensagem: "O complemento informado é inválido.",
      });
    }

    let clienteId = null;
    let nomeCliente;
    let emailCliente;

    // Verifica se existe um cliente autenticado
    if (req.cliente) {
      clienteId = req.cliente.id;

      const [clientes] = await pool.execute(
        `SELECT nome, email
         FROM clientes
         WHERE id = ?`,
        [clienteId]
      );

      if (clientes.length === 0) {
        return res.status(401).json({
          mensagem: "Cliente não encontrado. Faça login novamente.",
        });
      }

      nomeCliente = clientes[0].nome;
      emailCliente = clientes[0].email;
    } else {
      // Compra como visitante
      nomeCliente = comprador.nome?.trim();
      emailCliente = comprador.email?.trim().toLowerCase();

      if (!nomeCliente || !emailCliente) {
        return res.status(400).json({
          mensagem: "Nome e e-mail são obrigatórios para visitantes.",
        });
      }

      // Valida o formato do e-mail
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCliente)) {
        return res.status(400).json({
          mensagem: "Informe um e-mail válido.",
        });
      }
    }

    // Valida e agrupa os produtos
    const produtosSolicitados = new Map();

    for (const item of itens) {
      const produtoId = Number(item.produto_id);
      const quantidade = Number(item.quantidade);

      if (
        !Number.isSafeInteger(produtoId) ||
        produtoId <= 0 ||
        !Number.isSafeInteger(quantidade) ||
        quantidade <= 0
      ) {
        return res.status(400).json({
          mensagem:
            "Existe um produto ou uma quantidade inválida no pedido.",
        });
      }

      const quantidadeAtual = produtosSolicitados.get(produtoId) || 0;
      const novaQuantidade = quantidadeAtual + quantidade;

      if (!Number.isSafeInteger(novaQuantidade)) {
        return res.status(400).json({
          mensagem: "Quantidade de produtos inválida.",
        });
      }

      produtosSolicitados.set(produtoId, novaQuantidade);
    }

    conexao = await pool.getConnection();
    await conexao.beginTransaction();

    const idsProdutos = [...produtosSolicitados.keys()];
    const placeholders = idsProdutos.map(() => "?").join(",");

    // Busca os produtos ativos e bloqueia seus registros
    const [produtos] = await conexao.execute(
      `SELECT id, nome, preco, estoque
       FROM produtos
       WHERE id IN (${placeholders})
       AND ativo = TRUE
       FOR UPDATE`,
      idsProdutos
    );

    if (produtos.length !== idsProdutos.length) {
      throw new Error("Um ou mais produtos não estão disponíveis.");
    }

    let totalCentavos = 0;

    // Confere o estoque e calcula o total
    for (const produto of produtos) {
      const quantidade = produtosSolicitados.get(produto.id);

      if (produto.estoque < quantidade) {
        throw new Error(
          `Estoque insuficiente para o produto: ${produto.nome}.`
        );
      }

      const precoCentavos = Math.round(Number(produto.preco) * 100);

      if (!Number.isSafeInteger(precoCentavos) || precoCentavos < 0) {
        throw new Error("Preço inválido em um dos produtos.");
      }

      totalCentavos += precoCentavos * quantidade;
    }

    if (!Number.isSafeInteger(totalCentavos)) {
      throw new Error("Valor total do pedido inválido.");
    }

    const valorTotal = (totalCentavos / 100).toFixed(2);

    // Cria o pedido
    const [resultadoPedido] = await conexao.execute(
      `INSERT INTO pedidos (
        cliente_id,
        nome_cliente,
        email,
        telefone,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        valor_total,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')`,
      [
        clienteId,
        nomeCliente,
        emailCliente,
        comprador.telefone.trim(),
        comprador.endereco.trim(),
        comprador.numero.trim(),
        comprador.complemento?.trim() || null,
        comprador.bairro.trim(),
        comprador.cidade.trim(),
        comprador.estado.trim().toUpperCase(),
        comprador.cep.trim(),
        valorTotal,
      ]
    );

    const pedidoId = resultadoPedido.insertId;

    // Registra os itens e reserva o estoque
    for (const produto of produtos) {
      const quantidade = produtosSolicitados.get(produto.id);

      const precoUnitario = (
        Math.round(Number(produto.preco) * 100) / 100
      ).toFixed(2);

      await conexao.execute(
        `INSERT INTO itens_pedido (
          pedido_id,
          produto_id,
          quantidade,
          preco_unitario
        ) VALUES (?, ?, ?, ?)`,
        [pedidoId, produto.id, quantidade, precoUnitario]
      );

      const [atualizacao] = await conexao.execute(
        `UPDATE produtos
         SET estoque = estoque - ?
         WHERE id = ?
         AND estoque >= ?
         AND ativo = TRUE`,
        [quantidade, produto.id, quantidade]
      );

      if (atualizacao.affectedRows !== 1) {
        throw new Error(
          `Não foi possível reservar o estoque de ${produto.nome}.`
        );
      }
    }

    await conexao.commit();

    return res.status(201).json({
      mensagem: "Pedido registrado com sucesso!",
      pedido: {
        id: pedidoId,
        cliente_id: clienteId,
        nome_cliente: nomeCliente,
        email: emailCliente,
        valor_total: valorTotal,
        status: "pendente",
      },
    });
  } catch (erro) {
    if (conexao) {
      await conexao.rollback();
    }

    console.error("Erro ao criar pedido:", erro.message);

    const conflito = [
      "Estoque insuficiente",
      "não estão disponíveis",
      "Não foi possível reservar",
    ].some((mensagem) => erro.message.includes(mensagem));

    return res.status(conflito ? 409 : 500).json({
      mensagem: erro.message || "Não foi possível registrar o pedido.",
    });
  } finally {
    if (conexao) {
      conexao.release();
    }
  }
});

// ==========================================
// LISTAR PEDIDOS DO CLIENTE
// GET /api/clientes/pedidos
// ==========================================

app.get("/api/clientes/pedidos", autenticarCliente, async (req, res) => {
  try {
    const clienteId = req.cliente.id;

    const [pedidos] = await pool.execute(
      `SELECT
        p.id,
        p.nome_cliente,
        p.email,
        p.valor_total,
        p.status,
        p.criado_em,
        ip.id AS item_id,
        ip.produto_id,
        pr.nome AS produto_nome,
        ip.quantidade,
        ip.preco_unitario
      FROM pedidos p
      LEFT JOIN itens_pedido ip ON ip.pedido_id = p.id
      LEFT JOIN produtos pr ON pr.id = ip.produto_id
      WHERE p.cliente_id = ?
      ORDER BY p.criado_em DESC, p.id DESC`,
      [clienteId]
    );

    const pedidosOrganizados = new Map();

    for (const linha of pedidos) {
      if (!pedidosOrganizados.has(linha.id)) {
        pedidosOrganizados.set(linha.id, {
          id: linha.id,
          nome_cliente: linha.nome_cliente,
          email: linha.email,
          valor_total: linha.valor_total,
          status: linha.status,
          criado_em: linha.criado_em,
          itens: [],
        });
      }

      if (linha.item_id !== null) {
        pedidosOrganizados.get(linha.id).itens.push({
          id: linha.item_id,
          produto_id: linha.produto_id,
          produto_nome: linha.produto_nome,
          quantidade: linha.quantidade,
          preco_unitario: linha.preco_unitario,
        });
      }
    }

    return res.status(200).json({
      pedidos: Array.from(pedidosOrganizados.values()),
    });
  } catch (erro) {
    console.error("Erro ao listar pedidos:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível consultar os pedidos.",
    });
  }
});

// ==========================================
// CONSULTAR PEDIDO DO CLIENTE
// GET /api/pedidos/:id
// ==========================================

app.get("/api/pedidos/:id", autenticarCliente, async (req, res) => {
  try {
    const pedidoId = Number(req.params.id);
    const clienteId = req.cliente.id;

    if (!Number.isSafeInteger(pedidoId) || pedidoId <= 0) {
      return res.status(400).json({
        mensagem: "ID do pedido inválido.",
      });
    }

    const [pedidos] = await pool.execute(
      `SELECT
        id,
        nome_cliente,
        email,
        telefone,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        valor_total,
        status,
        criado_em
      FROM pedidos
      WHERE id = ?
      AND cliente_id = ?`,
      [pedidoId, clienteId]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({
        mensagem: "Pedido não encontrado.",
      });
    }

    const [itens] = await pool.execute(
      `SELECT
        ip.id,
        ip.produto_id,
        pr.nome AS produto_nome,
        ip.quantidade,
        ip.preco_unitario
      FROM itens_pedido ip
      LEFT JOIN produtos pr ON pr.id = ip.produto_id
      WHERE ip.pedido_id = ?`,
      [pedidoId]
    );

    return res.status(200).json({
      pedido: {
        ...pedidos[0],
        itens,
      },
    });
  } catch (erro) {
    console.error("Erro ao consultar pedido:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível consultar o pedido.",
    });
  }
});

// ==========================================
// CONSULTAR PEDIDO COMO VISITANTE
// POST /api/pedidos/consultar-visitante
// ==========================================

app.post("/api/pedidos/consultar-visitante", async (req, res) => {
  try {
    const { pedido_id, email } = req.body;

    const pedidoId = Number(pedido_id);

    if (!Number.isSafeInteger(pedidoId) || pedidoId <= 0) {
      return res.status(400).json({
        mensagem: "Informe um número de pedido válido.",
      });
    }

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        mensagem: "Informe o e-mail utilizado na compra.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Valida o formato do e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      return res.status(400).json({
        mensagem: "Informe um e-mail válido.",
      });
    }

    const [pedidos] = await pool.execute(
      `SELECT
        id,
        nome_cliente,
        email,
        valor_total,
        status,
        criado_em
       FROM pedidos
       WHERE id = ?
       AND LOWER(email) = ?
       AND cliente_id IS NULL`,
      [pedidoId, emailNormalizado]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({
        mensagem:
          "Pedido não encontrado. Confira o número e o e-mail informado.",
      });
    }

    const [itens] = await pool.execute(
      `SELECT
        ip.id,
        ip.produto_id,
        pr.nome AS produto_nome,
        ip.quantidade,
        ip.preco_unitario
       FROM itens_pedido ip
       LEFT JOIN produtos pr ON pr.id = ip.produto_id
       WHERE ip.pedido_id = ?`,
      [pedidoId]
    );

    return res.status(200).json({
      mensagem: "Pedido encontrado com sucesso!",
      pedido: {
        ...pedidos[0],
        itens,
      },
    });
  } catch (erro) {
    console.error("Erro ao consultar pedido de visitante:", erro.message);

    return res.status(500).json({
      mensagem: "Não foi possível consultar o pedido.",
    });
  }
});

// ==========================================
// ATUALIZAR STATUS DO PEDIDO
// PUT /api/pedidos/:id/status
// ACESSO DE ADMINISTRADOR
// ==========================================

app.put(
  "/api/pedidos/:id/status",
  autenticarAdministrador,
  async (req, res) => {
    let conexao;

    try {
      // Obtém a conexão dentro do try para tratar possíveis falhas
      conexao = await pool.getConnection();

      const pedidoId = Number(req.params.id);
      const { status } = req.body;

      if (!Number.isSafeInteger(pedidoId) || pedidoId <= 0) {
        return res.status(400).json({
          mensagem: "ID do pedido inválido.",
        });
      }

      const statusPermitidos = [
        "confirmado",
        "enviado",
        "concluido",
        "cancelado",
      ];

      if (
        typeof status !== "string" ||
        !statusPermitidos.includes(status)
      ) {
        return res.status(400).json({
          mensagem: "Status informado inválido.",
        });
      }

      await conexao.beginTransaction();

      const [pedidos] = await conexao.execute(
        `SELECT id, status
         FROM pedidos
         WHERE id = ?
         FOR UPDATE`,
        [pedidoId]
      );

      if (pedidos.length === 0) {
        await conexao.rollback();

        return res.status(404).json({
          mensagem: "Pedido não encontrado.",
        });
      }

      const statusAtual = pedidos[0].status;

      const transicoesPermitidas = {
        pendente: ["confirmado", "cancelado"],
        confirmado: ["enviado", "cancelado"],
        enviado: ["concluido"],
        concluido: [],
        cancelado: [],
      };

      if (!transicoesPermitidas[statusAtual]?.includes(status)) {
        await conexao.rollback();

        return res.status(400).json({
          mensagem:
            `Não é permitido alterar o pedido de ${statusAtual} para ${status}.`,
        });
      }

      // Ao cancelar, devolve os produtos ao estoque
      if (status === "cancelado") {
        const [itens] = await conexao.execute(
          `SELECT produto_id, quantidade
           FROM itens_pedido
           WHERE pedido_id = ?`,
          [pedidoId]
        );

        for (const item of itens) {
          await conexao.execute(
            `UPDATE produtos
             SET estoque = estoque + ?
             WHERE id = ?`,
            [item.quantidade, item.produto_id]
          );
        }
      }

      await conexao.execute(
        `UPDATE pedidos
         SET status = ?
         WHERE id = ?`,
        [status, pedidoId]
      );

      await conexao.commit();

      return res.status(200).json({
        mensagem: "Status do pedido atualizado com sucesso!",
        pedido: {
          id: pedidoId,
          status_anterior: statusAtual,
          status_atual: status,
        },
      });
    } catch (erro) {
      if (conexao) {
        await conexao.rollback();
      }

      console.error(
        "Erro ao atualizar status do pedido:",
        erro.message
      );

      return res.status(500).json({
        mensagem: "Não foi possível atualizar o status do pedido.",
      });
    } finally {
      if (conexao) {
        conexao.release();
      }
    }
  }
);

// ==========================================
// INICIA O SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`Jardim Pet rodando em http://localhost:${PORT}`);
});