console.log("JS carregado!");

const campoStatus = document.querySelector("#status");
const campoPrioridade = document.querySelector("#prioridade");
const campoTipo = document.querySelector("#tipo");
const campoBusca = document.querySelector("#busca");
const campoOrdenarPor = document.querySelector("#ordenarPor");
const campoOrdem = document.querySelector("#ordem");
const botaoFiltrar = document.querySelector("#botao-filtrar");

const erroStatus = document.querySelector("#erroStatus");
const erroPrioridade = document.querySelector("#erroPrioridade");
const erroBusca = document.querySelector("#erroBusca");

const tabela = document.querySelector("#tabela-demandas");
const mensagemLista = document.querySelector("#mensagem-lista");

const statusPermitidos = ["", "Aberta", "Em andamento", "Em revisão", "Concluída", "Cancelada"];
const prioridadesPermitidas = ["", "Crítica", "Alta", "Média", "Baixa"];

botaoFiltrar.addEventListener("click", function () {
    limparErros();

    const status = campoStatus.value;
    const prioridade = campoPrioridade.value;
    const busca = campoBusca.value.trim();

    let valido = true;

    if (!statusPermitidos.includes(status)) {
        erroStatus.innerText = "Status inválido.";
        campoStatus.classList.add("invalido");
        valido = false;
    }

    if (!prioridadesPermitidas.includes(prioridade)) {
        erroPrioridade.innerText = "Prioridade inválida.";
        campoPrioridade.classList.add("invalido");
        valido = false;
    }

    if (busca.length > 0 && busca.length < 3) {
        erroBusca.innerText = "Digite ao menos 3 caracteres.";
        campoBusca.classList.add("invalido");
        valido = false;
    }

    if (!valido) return;

    carregarDemandas();
});

function limparErros() {
    campoStatus.classList.remove("invalido");
    campoPrioridade.classList.remove("invalido");
    campoBusca.classList.remove("invalido");

    erroStatus.innerText = "";
    erroPrioridade.innerText = "";
    erroBusca.innerText = "";
}

function montarQuery() {
    const params = new URLSearchParams();

    if (campoStatus.value) params.set("status", campoStatus.value);
    if (campoPrioridade.value) params.set("prioridade", campoPrioridade.value);
    if (campoTipo.value) params.set("tipo", campoTipo.value);
    if (campoBusca.value.trim()) params.set("busca", campoBusca.value.trim());

    params.set("ordenarPor", campoOrdenarPor.value);
    params.set("ordem", campoOrdem.value);

    return params.toString();
}

function formatarData(iso) {
    if (!iso) return "—";
    const [ano, mes, dia] = iso.split("-");
    return dia + "/" + mes + "/" + ano;
}

function criarCelula(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function renderizar(demandas) {
    tabela.replaceChildren();

    demandas.forEach(function (d) {
        const tr = document.createElement("tr");

        tr.appendChild(criarCelula(d.titulo));
        tr.appendChild(criarCelula(d.tipo));
        tr.appendChild(criarCelula(d.prioridade));
        tr.appendChild(criarCelula(d.status));
        tr.appendChild(criarCelula(d.projeto ? d.projeto.nome : "—"));
        tr.appendChild(criarCelula(d.responsavel ? d.responsavel.nome : "Sem responsável"));
        tr.appendChild(criarCelula(formatarData(d.dataCriacao)));
        tr.appendChild(criarCelula(formatarData(d.prazo)));

        const acoes = document.createElement("td");
        const link = document.createElement("a");
        link.href = "detalhes-demanda.html?id=" + d.id;
        link.textContent = "Detalhes";
        acoes.appendChild(link);
        tr.appendChild(acoes);

        tabela.appendChild(tr);
    });
}

async function carregarDemandas() {
    mensagemLista.textContent = "Carregando...";

    try {
        const resposta = await fetch("/demandas?" + montarQuery(), {
            headers: { "Accept": "application/json" }
        });
        const dados = await resposta.json();

        if (!resposta.ok) {
            tabela.replaceChildren();
            mensagemLista.textContent =
                (dados.erros && dados.erros.join(" ")) ||
                dados.mensagem ||
                "Não foi possível listar as demandas.";
            return;
        }

        renderizar(dados.demandas);
        mensagemLista.textContent =
            dados.total === 0
                ? "Nenhuma demanda encontrada."
                : dados.total + " demanda(s) encontrada(s).";
    } catch (erro) {
        tabela.replaceChildren();
        mensagemLista.textContent =
            "Não foi possível conectar ao servidor. Verifique se a API está em execução.";
        console.error("Erro ao carregar demandas:", erro);
    }
}

carregarDemandas();