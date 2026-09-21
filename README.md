# 📦 Estoca aê! — Front-end

**MVP para Pós PUC-RIO — Engenharia de Software — Arquitetura de Software**

O **Estoca aê!** é uma interface web para gestão de materiais e controle de estoque. O sistema permite o cadastro de itens, gestão de solicitações e visualização de estoque.

O usuário consulta um catálogo de referência (**Fake Store API**), cadastra materiais, faz solicitações, atende os pedidos e acompanha o estoque gerado.

Os registros ficam armazenados na **API Estoca aê!**, mantida em um repositório separado, que utiliza SQLite para persistência dos dados.

---

## 📑 Sumário

- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias utilizadas](#️-tecnologias-utilizadas)
- [API externa — Fake Store API](#-api-externa--fake-store-api)
- [Comunicação com a API Estoca aê!](#-comunicação-com-a-api-estoca-aê)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como executar](#-como-executar)
- [Repositórios do projeto](#-repositórios-do-projeto)

---

## 🏗️ Arquitetura

![Arquitetura do projeto](docs/arquitetura.png)

O projeto segue o **Cenário 1** proposto no enunciado do MVP.

- O **front-end** (este repositório) é servido por **Nginx** na porta `8080`.
- O front-end consulta o catálogo de produtos da **Fake Store API**.
- O front-end chama a **API Estoca aê!**, desenvolvida em Flask e executada na porta `5001`.
- A API é responsável por cadastrar materiais, criar e atender solicitações e consultar o estoque.
- A API persiste os dados em **SQLite**, utilizando um volume Docker.

### 🔄 Fluxo da aplicação

```text
┌──────────────────────┐
│      Usuário         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Front-end       │
│   HTML + CSS + JS    │
│      Nginx :8080     │
└───────┬────────┬─────┘
        │        │
        │        │
        ▼        ▼
┌────────────┐  ┌──────────────────────┐
│ Fake Store │  │   API Estoca aê!     │
│    API     │  │    Flask :5001       │
└────────────┘  └──────────┬───────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    SQLite    │
                     └──────────────┘
```

---

## 🚀 Funcionalidades

### 🛒 Catálogo de referência

- Lista produtos da **Fake Store API**.
- Permite filtrar produtos por categoria.
- Permite cadastrar um produto do catálogo como material.
- Exibe título, preço e imagem do produto.

### 📦 Cadastro de materiais

- Cadastro manual de materiais.
- Campos para nome, valor e link da imagem.
- Listagem dos materiais cadastrados.
- Exibição da imagem em formato de miniatura.
- Exclusão de materiais.

### 📋 Solicitação de materiais

- Seleção do material cadastrado.
- Definição da quantidade.
- Definição da data de necessidade.
- Visualização das solicitações.
- Identificação do status:
  - `PENDENTE`
  - `ATENDIDA`
- Atendimento das solicitações.
- Exclusão de solicitações pendentes.

### 🏭 Estoque

- Geração de estoque ao atender uma solicitação.
- Visualização dos itens disponíveis.
- Visualização da quantidade disponível.
- Visualização da data de entrada.
- Exclusão de itens do estoque.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| **HTML5** | Estrutura da interface |
| **CSS3** | Estilização da aplicação |
| **JavaScript** | Lógica do front-end e integração com APIs |
| **Fetch API** | Comunicação HTTP com as APIs |
| **Nginx** | Servidor web do front-end |
| **Docker** | Containerização |
| **Docker Compose** | Orquestração dos serviços |
| **Fake Store API** | Catálogo externo de produtos |
| **Flask** | Back-end da API Estoca aê! |
| **SQLite** | Persistência dos dados |

---

## 🛒 API externa — Fake Store API

O projeto utiliza a **Fake Store API** como catálogo externo de referência.

| Informação | Detalhes |
|---|---|
| **Descrição** | API REST pública que fornece um catálogo fictício de produtos, incluindo título, preço, categoria, descrição e imagem. |
| **URL base** | https://fakestoreapi.com |
| **Cadastro ou chave de acesso** | Não é necessário |
| **Custo** | Gratuita |
| **Licença de uso** | Confirmar no repositório oficial do projeto |

### 📡 Rotas utilizadas

| Método | Rota | Uso no projeto |
|:---:|---|---|
| `GET` | `/products` | Lista os produtos do catálogo |
| `GET` | `/products/categories` | Preenche o filtro de categorias |
| `GET` | `/products/category/{categoria}` | Lista os produtos de uma categoria |

Os dados são consumidos e tratados dentro da própria aplicação, sem redirecionar o usuário para outro site.

Cada produto escolhido no catálogo é cadastrado na API **Estoca aê!** com o seguinte mapeamento:

| Fake Store API | Material cadastrado |
|---|---|
| `title` | `nome` |
| `price` | `valor` |
| `image` | `link` — exibido como miniatura |

> 💡 **Observação:** A Fake Store API não define a moeda dos preços. No sistema, o valor é tratado como valor de referência. As operações de escrita da Fake Store API não gravam dados de verdade; por isso, a persistência é realizada pela API **Estoca aê!**.

---

## 🔗 Comunicação com a API Estoca aê!

O endereço da API está definido no início do arquivo `script.js`, através da variável `baseUrl`:

```javascript
const baseUrl = 'http://127.0.0.1:5001';
```

### 📡 Endpoints utilizados pelo front-end

| Método | Rota | Uso no front-end |
|:---:|---|---|
| `GET` | `/cadastros` | Lista os materiais e preenche o seletor de solicitação |
| `POST` | `/cadastros` | Cadastra um material pelo formulário ou catálogo |
| `DELETE` | `/cadastros/{id}` | Remove um material |
| `POST` | `/solicitacoes` | Cria uma solicitação |
| `GET` | `/solicitacoes` | Lista as solicitações |
| `PUT` | `/solicitacoes/{id}/atender` | Atende a solicitação e gera o estoque |
| `DELETE` | `/solicitacoes/{id}` | Remove uma solicitação pendente |
| `GET` | `/estoque` | Lista os itens em estoque |
| `DELETE` | `/estoque/{id}` | Remove um item do estoque |

> 📌 Os envios `POST` utilizam `FormData`.

---

## 📁 Estrutura do projeto

```text
estoca_ae-front-full-stack-avancado/
│
├── docs/
│   └── arquitetura.png        # Fluxograma da arquitetura
│
├── index.html                 # Estrutura da página
├── script.js                  # Lógica e chamadas às APIs
├── style.css                  # Estilos da aplicação
├── favicon.png                # Ícone da aplicação
├── painel.png                 # Imagem do cabeçalho
│
├── Dockerfile                 # Imagem do front-end com Nginx
├── docker-compose.yml         # Execução integrada do front e da API
└── README.md                  # Documentação do projeto
```

---

# 🐳 Como executar

## Opção 1 — Docker Compose

### Pré-requisitos

- Docker instalado e em execução.
- Repositórios do front-end e da API clonados lado a lado.

### 📂 Estrutura esperada

```text
projetos/
│
├── estoca_ae-api-full-stack-avancado/
│   └── API
│
└── estoca_ae-front-full-stack-avancado/
    └── Front-end
```

### 1. Clone os repositórios

```bash
git clone https://github.com/kathleenborges/estoca_ae-api-full-stack-avancado.git
git clone https://github.com/kathleenborges/estoca_ae-front-full-stack-avancado.git
```

### 2. Entre na pasta do front-end

```bash
cd estoca_ae-front-full-stack-avancado
```

### 3. Suba os serviços

```bash
docker compose up --build
```

### 4. Acesse a aplicação

| Serviço | Endereço |
|---|---|
| 🌐 **Front-end** | http://localhost:8080 |
| 🔧 **API / Swagger** | http://localhost:5001/openapi |

### 5. Para parar a aplicação

Pressione:

```text
Ctrl + C
```

Depois execute:

```bash
docker compose down
```

Os dados da API ficam armazenados no volume `estoca_dados` e permanecem entre as execuções.

Para remover também os dados persistidos:

```bash
docker compose down -v
```

---

## 💻 Opção 2 — Execução sem Docker

### Pré-requisitos

- Python 3.12 para a API.
- Navegador web.

### 1. Execute a API

Siga as instruções do README do repositório da API.

Por padrão, a API estará disponível em:

```text
http://localhost:5001
```

A documentação Swagger estará disponível em:

```text
http://localhost:5001/openapi
```

### 2. Execute o front-end

Na raiz do repositório do front-end:

```bash
python3 -m http.server 8080
```

### 3. Acesse a aplicação

Abra no navegador:

```text
http://localhost:8080
```

> ⚠️ **Importante:** Se a API estiver rodando em outro endereço, ajuste o valor de `baseUrl` no início do arquivo `script.js`.

---

## 🔗 Repositórios do projeto

| Componente | Repositório |
|---|---|
| 🌐 **Front-end** | [estoca_ae-front-full-stack-avancado](https://github.com/kathleenborges/estoca_ae-front-full-stack-avancado) |
| 🔧 **API / Back-end** | [estoca_ae-api-full-stack-avancado](https://github.com/kathleenborges/estoca_ae-api-full-stack-avancado) |

---

## 👩‍💻 Desenvolvimento

**Estoca aê!**

Projeto desenvolvido por **Kathleen Borges**, com foco em otimização de processos, gestão de materiais e controle de estoque.

📦 **Front-end:** HTML, CSS, JavaScript e Nginx  
🔧 **Back-end:** Flask, SQLAlchemy e SQLite  
🐳 **Infraestrutura:** Docker e Docker Compose

Desenvolvido por Kathleen Borges com foco em otimização de processos. 🤖📦
