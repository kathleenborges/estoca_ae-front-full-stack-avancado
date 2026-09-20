# estoca_ae_front
MVP para Pós PUC RIO - Engenharia de Software - Arquitetura de Software

# 📦 Estoca aê! - Gestão de Logística Inteligente

O **Estoca aê!** é uma interface web para gestão de materiais e controle de estoque. O sistema permite o cadastro de itens, gestão de solicitações e visualização de estoque em tempo real.
O usuário consulta um catálogo de referência (Fake Store API), cadastra materiais, faz solicitações, atende os pedidos e acompanha o estoque gerado. Os registros ficam guardados na API Estoca aê! (repositório separado), que armazena os dados em SQLite.

# Sumário

Arquitetura
Funcionalidades
Tecnologias
API externa: Fake Store API
Comunicação com a API Estoca aê!
Estrutura do projeto
Como executar
Repositórios do projeto

# Arquitetura

![Arquitetura do projeto](docs/arquitetura.png)

- O projeto segue o Cenário 1 proposto no enunciado do MVP:
- O front-end (este repositório) é servido por nginx na porta 8080.
- O front consulta o catálogo de produtos na Fake Store API (serviço externo).
- O front chama a API Estoca aê! (Flask, porta 5001) para cadastrar materiais, criar e atender solicitações e consultar o estoque.
- A API persiste os dados em SQLite, em um volume Docker.


## 🚀 Funcionalidades

* **Painel de Controle:** Visualização intuitiva com design focado em logística.
* **Cadastro de Materiais:** Registro de novos itens com nome, valor e link de imagem.
* **Gestão de Solicitações:** Sistema de pedidos com controle de status (Pendente/Atendido).
* **Estoque Dinâmico:** Tabela de itens disponíveis atualizada automaticamente após o atendimento.
* **Interface Responsiva:** Design limpo com cores modernas e ícones intuitivos.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica da aplicação.
* **CSS3:** Estilização personalizada, incluindo painéis dinâmicos e efeitos de sombra.
* **JavaScript (ES6):** Lógica de manipulação de dados e atualização da interface (DOM).

## 📂 Como rodar o projeto

1.  Clone este repositório ou baixe os arquivos.
2.  Este front-end é uma interface dinâmica que consome dados de uma API. Para que as funcionalidades de cadastro, listagem e pedidos funcionem, **o servidor Back-end (Python/Flask) deve estar em execução**.
3.  Clicar no link abaixo:

    ```bash
    http://127.0.0.1:5500/estoca_ae_front-main/index.html

4.  Certifique-se de que os arquivos `index.html`, `style.css`, `script.js` e as imagem `painel.png` e `favicon.png` estão na mesma pasta.
5.  Abra o arquivo `index.html` no seu navegador ou utilize a extensão **Live Server** no VS Code para uma melhor experiência.

## 🎨 Identidade Visual

O projeto utiliza uma paleta de cores voltada para o setor industrial/logístico:
* **Verde (#28a745):** Para ações de sucesso e destaque da marca.
* **Grafite (#1a1d23):** Para o painel principal, garantindo um visual premium.
* **Branco/Cinza Claro:** Para legibilidade e organização das tabelas.

---
Desenvolvido por Kathleen Borges com foco em otimização de processos. 🤖📦
