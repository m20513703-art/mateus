const clienteSalvo = localStorage.getItem("cliente");

if (!clienteSalvo) {
window.location.href = "../Cadastro/cadastro.html";
}

const cliente = JSON.parse(clienteSalvo);

if (!cliente.plano || cliente.plano.numero < 2) {
alert("O PDV de pedidos está disponível a partir do Plano 2.");
window.location.href = "../Painel/painel.html";
}

const empresa = document.getElementById("empresa");

const clientePedido = document.getElementById("clientePedido");
const produtoPedido = document.getElementById("produtoPedido");
const quantidadePedido = document.getElementById("quantidadePedido");
const valorPedido = document.getElementById("valorPedido");

const botaoAdicionar = document.getElementById("botaoAdicionar");
const botaoFinalizar = document.getElementById("botaoFinalizar");
const botaoVoltar = document.getElementById("botaoVoltar");

const listaPedido = document.getElementById("listaPedido");
const totalPedido = document.getElementById("totalPedido");
const listaHistorico = document.getElementById("listaHistorico");
const mensagem = document.getElementById("mensagem");

empresa.textContent = cliente.empresa || "Sistema de Climatização";

let pedidoAtual = [];

function formatarMoeda(valor) {
return "R$ " + valor.toFixed(2).replace(".", ",");
}

function atualizarPedido() {

listaPedido.innerHTML = "";

if (pedidoAtual.length === 0) {

    listaPedido.innerHTML =
        "<p>Nenhum item adicionado.</p>";

    totalPedido.textContent = "R$ 0,00";

    return;
}

let total = 0;

pedidoAtual.forEach(function (item, index) {

    total += item.subtotal;

    const div = document.createElement("div");

    div.className = "item-pedido";

    div.innerHTML = `
        <div class="item-info">
            <strong>${item.produto}</strong>
            <span>
                ${item.quantidade} x
                ${formatarMoeda(item.valorUnitario)}
                = ${formatarMoeda(item.subtotal)}
            </span>
        </div>

        <div class="item-acoes">
            <button
                class="botao-remover"
                type="button"
                onclick="removerItem(${index})"
            >
                Remover
            </button>
        </div>
    `;

    listaPedido.appendChild(div);
});

totalPedido.textContent = formatarMoeda(total);

}

function removerItem(index) {

pedidoAtual.splice(index, 1);

atualizarPedido();

}

botaoAdicionar.addEventListener("click", function () {

const produto = produtoPedido.value.trim();

const quantidade = Number(
    quantidadePedido.value
);

const valor = Number(
    valorPedido.value
);

mensagem.textContent = "";

if (!produto) {

    mensagem.textContent =
        "Digite o produto ou serviço.";

    return;
}

if (!quantidade || quantidade < 1) {

    mensagem.textContent =
        "Digite uma quantidade válida.";

    return;
}

if (valor < 0 || Number.isNaN(valor)) {

    mensagem.textContent =
        "Digite um preço válido.";

    return;
}

const subtotal = quantidade * valor;

pedidoAtual.push({
    produto: produto,
    quantidade: quantidade,
    valorUnitario: valor,
    subtotal: subtotal
});

produtoPedido.value = "";
quantidadePedido.value = "1";
valorPedido.value = "";

mensagem.textContent =
    "Item adicionado ao pedido.";

atualizarPedido();

});

botaoFinalizar.addEventListener("click", function () {

const nomeCliente = clientePedido.value.trim();

mensagem.textContent = "";

if (!nomeCliente) {

    mensagem.textContent =
        "Digite o nome do cliente.";

    return;
}

if (pedidoAtual.length === 0) {

    mensagem.textContent =
        "Adicione pelo menos um item ao pedido.";

    return;
}

let total = 0;

pedidoAtual.forEach(function (item) {
    total += item.subtotal;
});

const novoPedido = {
    id: Date.now(),
    cliente: nomeCliente,
    itens: pedidoAtual,
    total: total,
    data: new Date().toLocaleString("pt-BR")
};

const pedidosSalvos =
    JSON.parse(
        localStorage.getItem("pedidos") || "[]"
    );

pedidosSalvos.push(novoPedido);

localStorage.setItem(
    "pedidos",
    JSON.stringify(pedidosSalvos)
);

pedidoAtual = [];

clientePedido.value = "";

atualizarPedido();

mensagem.textContent =
    "Pedido finalizado com sucesso!";

carregarHistorico();

});

function carregarHistorico() {

const pedidosSalvos =
    JSON.parse(
        localStorage.getItem("pedidos") || "[]"
    );

listaHistorico.innerHTML = "";

if (pedidosSalvos.length === 0) {

    listaHistorico.innerHTML =
        "<p>Nenhum pedido realizado ainda.</p>";

    return;
}

pedidosSalvos
    .slice()
    .reverse()
    .forEach(function (pedido) {

        const div = document.createElement("div");

        div.className = "item-historico";

        div.innerHTML = `
            <strong>${pedido.cliente}</strong>
            <p>
                Total: ${formatarMoeda(pedido.total)}
            </p>
            <p>
                Data: ${pedido.data}
            </p>
        `;

        listaHistorico.appendChild(div);
    });

}

botaoVoltar.addEventListener("click", function () {

window.location.href =
    "../Painel/painel.html";

});

atualizarPedido();
carregarHistorico();