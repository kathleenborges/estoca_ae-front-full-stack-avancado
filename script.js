const baseUrl = 'http://127.0.0.1:5001';

/* Carrega a lista inicial do servidor 
*/
const getList = async () => {
    let url = `${baseUrl}/cadastros`;
    try {
        const response = await fetch(url, { method: 'get' });
        const data = await response.json();
        
        const tableBody = document.querySelector('#myTable tbody');
        tableBody.innerHTML = ""; // Limpa a tabela para recarregar
        
        data.cadastros.forEach(item => {
            insertList(item.id, item.nome, item.valor, item.link);
        });
        carregarSelectMateriais();
    } catch (error) {
        console.error('Erro ao buscar lista:', error);
    }
}

/* Cadastra novo item via POST (FormData)
*/
const postItem = async (nome, valor, link) => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('valor', valor);
    formData.append('link', link);

    const btn = document.getElementById("btn-add");
    btn.disabled = true;

    try {
        const response = await fetch(`${baseUrl}/cadastros`, {
            method: 'post',
            body: formData
        });

        if (response.ok) {
            alert("Sucesso! Material cadastrado.");
            getList(); // Atualiza a tabela
            clearInputs();
        } else if (response.status === 409) {
            alert("Erro: Este material já existe.");
        } else {
            alert("Erro no servidor ao cadastrar.");
        }
    } catch (error) {
        alert("Erro de conexão com o servidor.");
    } finally {
        btn.disabled = false;
    }
}

/* Remove item cadastrado via DELETE usando o ID 
*/
const deleteItem = async (id) => {
    if (confirm("Deseja realmente excluir este item?")) {
        try {
            const response = await fetch(`${baseUrl}/cadastros/${id}`, {
                method: 'delete'
            });

            if (response.ok) {
                alert("Removido com sucesso!");
                getList();
            } else {
                const erro = await response.json();
                alert("Erro: " + erro.message);
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    }
}

/* Funções Auxiliares 
*/
const fakeStoreUrl = 'https://fakestoreapi.com';

// Carrega as categorias no select (GET externo)
const carregarCategorias = async () => {
    try {
        const response = await fetch(`${fakeStoreUrl}/products/categories`);
        const categorias = await response.json();
        const select = document.getElementById("selectCategoria");
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

// Carrega os produtos, todos ou de uma categoria (GET externo)
const carregarCatalogo = async (categoria = "") => {
    const url = categoria
        ? `${fakeStoreUrl}/products/category/${encodeURIComponent(categoria)}`
        : `${fakeStoreUrl}/products`;
    const catalogo = document.getElementById("catalogo");
    catalogo.textContent = "Carregando catálogo...";

    try {
        const response = await fetch(url);
        const produtos = await response.json();
        catalogo.innerHTML = "";

        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card-produto";

            const img = document.createElement("img");
            img.src = produto.image;
            img.alt = produto.title;

            const titulo = document.createElement("p");
            titulo.className = "card-titulo";
            titulo.textContent = produto.title;

            const preco = document.createElement("strong");
            preco.textContent = `$ ${produto.price.toFixed(2)}`;

            const btn = document.createElement("button");
            btn.textContent = "Cadastrar";
            btn.onclick = () => postItem(produto.title, produto.price, produto.image);

            card.append(img, titulo, preco, btn);
            catalogo.appendChild(card);
        });
    } catch (error) {
        catalogo.textContent = "Não foi possível carregar o catálogo.";
    }
}

const newItem = () => {
    let nome = document.getElementById("newInput").value;
    let valor = document.getElementById("newPrice").value;
    let link = document.getElementById("newLink").value;

    if (!nome || !valor || !link) {
        alert("Nome, Valor e Link da Imagem são obrigatórios!");
        return;
    }
    postItem(nome, valor, link);
}

const insertList = (id, nome, valor, link) => {
    const table = document.querySelector('#myTable tbody');
    const row = table.insertRow();

    row.insertCell(0).textContent = nome;
    row.insertCell(1).textContent = `R$ ${parseFloat(valor).toFixed(2)}`;
    const linkCell = row.insertCell(2);
    const img = document.createElement("img");
    img.src = link;
    img.alt = nome;
    img.className = "miniatura";
    img.onerror = () => {
        if (/^https?:\/\//.test(link)) {
            const a = document.createElement("a");
            a.href = link;
            a.target = "_blank";
            a.textContent = "Ver link";
            img.replaceWith(a);
        } else {
            img.replaceWith("Sem imagem");
        }
    };
    linkCell.appendChild(img);

    const btnCell = row.insertCell(3);
    const delBtn = document.createElement("button");
    delBtn.className = "btn-delete";
    delBtn.textContent = "Excluir";
    delBtn.onclick = () => deleteItem(id);
    btnCell.appendChild(delBtn);
}

const clearInputs = () => {
    document.getElementById("newInput").value = "";
    document.getElementById("newPrice").value = "";
    document.getElementById("newLink").value = "";
}

/* --------------------------------------------------------------------------------------
  ESTOQUE E SOLICITAÇÕES
  --------------------------------------------------------------------------------------
*/

// Busca os materiais cadastrados para preencher o <select>
const carregarSelectMateriais = async () => {
    try {
        const response = await fetch(`${baseUrl}/cadastros`);
        const data = await response.json();
        const select = document.getElementById("selectMateriais");
        
        select.innerHTML = '<option value="">Selecione um material...</option>';
        data.cadastros.forEach(item => {
            let option = document.createElement("option");
            option.value = item.id;
            option.text = item.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar select:", error);
    }
}

// Cria uma nova solicitação (POST)
const novaSolicitacao = async () => {
    const idMaterial = document.getElementById("selectMateriais").value;
    const qtde = document.getElementById("solicitaQtde").value;
    const dataNec = document.getElementById("solicitaData").value;

    if (!idMaterial || !qtde || !dataNec) {
        alert("Preencha todos os campos da solicitação!");
        return;
    }

    const formData = new FormData();
    formData.append('cadastro_id', idMaterial);
    formData.append('quantidade', qtde);
    formData.append('data_necessidade', dataNec);

    try {
        const response = await fetch(`${baseUrl}/solicitacoes`, {
            method: 'post',
            body: formData
        });

        if (response.ok) {
            alert("Solicitação enviada com sucesso!");
            
            document.getElementById("solicitaQtde").value = "";
            getSolicitacoes();
        } else {
            const erro = await response.json();
            alert("Erro: " + (erro.message || "não foi possível criar a solicitação."));
        }
    } catch (error) {
        alert("Erro ao enviar solicitação.");
    }
}

/* Busca todas as solicitações (GET) */

const getSolicitacoes = async () => {
    try {
        const response = await fetch(`${baseUrl}/solicitacoes`);
        const data = await response.json();
        const tableBody = document.querySelector('#tableSolicitacoes tbody');
        tableBody.innerHTML = "";

        data.solicitacoes.forEach(item => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = item.nome_material;
            row.insertCell(1).textContent = item.quantidade;
            row.insertCell(2).textContent = item.data_necessidade;
            
            // Coluna Status com estilo
            const statusCell = row.insertCell(3);
            const classe = item.status === "PENDENTE" ? "status-pendente" : "status-atendida";
            statusCell.innerHTML = `<span class="${classe}">${item.status}</span>`;

            // Coluna Ações (Onde ficarão os botões)
            const btnCell = row.insertCell(4);
            
            if (item.status === "PENDENTE") {
                // Container para os botões ficarem alinhados
                const container = document.createElement("div");
                container.style.display = "flex";
                container.style.gap = "5px";

                // Botão Atender
                const btnAtender = document.createElement("button");
                btnAtender.className = "btn-atender";
                btnAtender.textContent = "Atender";
                btnAtender.onclick = () => atenderSolicitacao(item.id);

                // Botão Excluir
                const btnDel = document.createElement("button");
                btnDel.className = "btn-delete";
                btnDel.textContent = "Excluir";
                btnDel.onclick = () => deleteSolicitacao(item.id);

                // Adiciona os botões no container e o container na célula
                container.appendChild(btnAtender);
                container.appendChild(btnDel);
                btnCell.appendChild(container);
            } else {
                btnCell.textContent = "---";
            }
        });
    } catch (error) {
        console.error("Erro ao buscar solicitações:", error);
    }
}

/* Altera o status da solicitação e gera estoque (PUT) */

const atenderSolicitacao = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/solicitacoes/${id}/atender`, {
            method: 'PUT'
        });

        if (response.ok) {
            alert("Solicitação atendida! Estoque atualizado.");
            getSolicitacoes(); // Atualiza a tabela de solicitações
            getEstoque();      // Atualiza a tabela de estoque automaticamente
        } else {
            const erro = await response.json();
            alert("Erro: " + erro.message);
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor.");
    }
}

/* Remove uma solicitação (DELETE) */

const deleteSolicitacao = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta solicitação?")) {
        try {
            const response = await fetch(`${baseUrl}/solicitacoes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Solicitação removida!");
                getSolicitacoes(); // Atualiza a tabela
            } else {
                const erro = await response.json();
                alert("Erro: " + erro.message);
            }
        } catch (error) {
            console.error('Erro ao deletar solicitação:', error);
        }
    }
}

// Atualiza a função de carregamento inicial para incluir as solicitações
const inicializar = async () => {
    await getList();
    await getSolicitacoes();
    await getEstoque();
    await carregarCategorias();
    await carregarCatalogo();
}

// Busca a lista de estoque (GET)
const getEstoque = async () => {
    try {
        const response = await fetch(`${baseUrl}/estoque`);
        const data = await response.json();
        
        const tableBody = document.querySelector('#tableEstoque tbody');
        tableBody.innerHTML = "";

        data.estoque.forEach(item => {
            const row = tableBody.insertRow();
            
            
            row.insertCell(0).textContent = item.nome || "Sem Nome"; 
            row.insertCell(1).textContent = item.quantidade_disponivel;
            row.insertCell(2).textContent = new Date(item.data_entrada).toLocaleDateString('pt-BR');
            
            // Botão Deletar ---
            const cellAcoes = row.insertCell(3);
            const btnDelete = document.createElement('button');
            btnDelete.textContent = "Excluir";
            btnDelete.className = "btn-delete"; 
            btnDelete.onclick = () => deletarItemEstoque(item.id);
            cellAcoes.appendChild(btnDelete);
        });
    } catch (error) {
        console.error("Erro ao buscar estoque:", error);
    }
}

// Deleta um item do estoque (DELETE)

const deletarItemEstoque = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/estoque/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error("Erro ao deletar item");
        }

        alert("Item deletado com sucesso!");
        getEstoque(); // Recarrega a tabela
    } catch (error) {
        console.error("Erro ao deletar:", error);
    }
};

// Chama a inicialização
inicializar();

