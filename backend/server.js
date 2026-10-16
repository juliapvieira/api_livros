// ROTAS:
// GET /api/livros/aleatorio
// GET /api/livros/:genero

// Importar o framework Express para criar o servidor
const express = require("express");
// Importar o CORS para permitir requisições de outros domínios (ex: frontend)
const cors = require("cors");
// Importa utilidades para trabalhar com caminhos de arquivos
const path = require("path");
// Importa o arquivo JSON que contém os gêneros e capas dos livros
const livros = require("./data/livros.json");

// Cria a aplicação Express
const app = express();
// Definir a porta onde o servidor irá rodar
const PORT = 3000;

// Habilitar o uso do CORS na aplicação
app.use(cors());

//=================================================
// SERVIR ARQUIVOS ESTÁTICOS
//=================================================

// Disponibiliza as imagens da pasta data/fotos no caminho /fotos
app.use(
  "/fotos",
  express.static(
    path.join(__dirname, "data/fotos"),
  ),
);

//=================================================
// FUNÇÃO AUXILIAR
//=================================================

// Função que recebe um array e retorna um item aleatório dele
function sortear(array) {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}

//================================
// ROTAS DA API
//================================

// ROTA 1 - Livro/Foto aleatória de qualquer gênero
app.get("/api/livros/aleatorio", (req, res) => {
  // Pega todas as fotos de todos os gêneros em um único array
  const todasAsFotos = Object.values(livros).flat();

  // Sorteia uma foto aleatória
  const item = sortear(todasAsFotos);

  // Responde para o cliente em formato JSON
  res.json({
    status: "success",
    message: `http://localhost:${PORT}/fotos/${item}`,
  });
});

// ROTA 2 - Livro/Foto por gênero (ex: /api/livros/terror)
app.get("/api/livros/:genero", (req, res) => {
  // decodeURIComponent trata caracteres especiais e acentos enviados na URL
  const genero = decodeURIComponent(req.params.genero).toLowerCase();

  // Verifica se o gênero existe no arquivo JSON
  if (!livros[genero]) {
    return res.status(404).json({
      status: "error",
      message: `Gênero "${genero}" não encontrado.`,
    });
  }

  // Sorteia uma foto do gênero solicitado
  const item = sortear(livros[genero]);

  // Retorna a resposta em JSON
  res.json({
    status: "success",
    message: `http://localhost:${PORT}/fotos/${item}`,
  });
});

//======================================
// INICIA O SERVIDOR
//=====================================

app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
  console.log(` Coloque as fotos manualmente em: data/fotos/`);
});