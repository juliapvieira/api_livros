// =====================================
// FRONT - END = consome nossa API local
// =====================================

// =====================================
// ELEMENTOS DO HTML
// =====================================

const bookImage = document.getElementById("bookImage") || document.getElementById("sportsImage");
const bookName = document.getElementById("bookName") || document.getElementById("sportsName");
const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");
const bookInput = document.getElementById("bookInput") || document.getElementById("sportsInput");
const bookArea = document.querySelector(".book-area") || document.querySelector(".sports-area");

// =====================================
// URL DA API
// =====================================

const API = "http://localhost:3000/api/livros";

// =====================================
// FUNÇÃO PRINCIPAL
// =====================================

async function buscarLivro(url) {
  // Mostra a animação de carregamento
  if (bookArea) bookArea.classList.add("loading");

  try {
    // Faz requisição HTTP para a API
    const response = await fetch(url);
    const data = await response.json();

    console.log("Resposta da API:", data);

    // Se a API retornar erro (ex: gênero 404)
    if (data.status === "error") {
      if (bookName) bookName.textContent = data.message;
      if (bookImage) bookImage.src = "";
      return;
    }

    // Coloca a imagem sorteada na tela
    if (bookImage) bookImage.src = data.message;

    // Extrai e decodifica o gênero a partir da URL da imagem
    // Exemplo: "http://localhost:3000/fotos/romance/1.jpg" -> "romance"
    const parts = data.message.split("/");
    const generoRaw = parts[4];

    if (generoRaw) {
      // decodeURIComponent transforma termos com caracteres especiais de volta ao texto original
      const genero = decodeURIComponent(generoRaw);
      if (bookName) bookName.textContent = genero.charAt(0).toUpperCase() + genero.slice(1);
    } else {
      if (bookName) bookName.textContent = "Livro";
    }

  } catch (error) {
    console.error(error);
    if (bookName) {
      bookName.textContent = "📴 Falha na conexão com o servidor. Verifique se o `node server.js` está rodando.";
    }
    if (bookImage) bookImage.src = "";
  } finally {
    // Remove o indicador de carregamento
    if (bookArea) bookArea.classList.remove("loading");
  }
}

// =====================================
// AÇÕES
// =====================================

// Busca livro/capa aleatória
function livroAleatorio() {
  buscarLivro(`${API}/aleatorio`);
}

// Busca livro por gênero digitado
function buscarPorGenero() {
  const genero = bookInput ? bookInput.value.trim().toLowerCase() : "";

  if (!genero) {
    alert("Digite um gênero para buscar (ex: romance, terror, suspense, infantil)!");
    return;
  }

  // encodeURIComponent garante que acentos e caracteres especiais fiquem seguros na URL
  buscarLivro(`${API}/${encodeURIComponent(genero)}`);
}

// =====================================
// EVENTOS
// =====================================

// Clique no botão aleatório
if (randomBtn) randomBtn.addEventListener("click", livroAleatorio);

// Clique no botão de busca
if (searchBtn) searchBtn.addEventListener("click", buscarPorGenero);

// Clique na própria imagem do livro
if (bookImage) bookImage.addEventListener("click", livroAleatorio);

// Enter no campo de busca
if (bookInput) {
  bookInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      buscarPorGenero();
    }
  });
}

// Carrega um livro assim que a página abre
window.addEventListener("load", livroAleatorio);