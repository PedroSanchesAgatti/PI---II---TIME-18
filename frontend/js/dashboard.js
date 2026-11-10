/*
    Autor: Hyan Victor
    Arquivo: dashboard.js
    Tela: Dashboard
    Projeto Integrador II - Engenharia de Software - 2026
*/

const API_URL = "http://localhost:3000";

const usuario = obterUsuarioAutenticado();

if (usuario) {
    const elementoUsuario = document.querySelector("#usuario-logado");
    if (elementoUsuario) {
        elementoUsuario.textContent =
            `Usuário: ${usuario.nome} | Perfil: ${usuario.perfil}`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    carregarDashboard();

    const botaoAtualizar = document.querySelector("#botao-atualizar");
    if (botaoAtualizar) {
        botaoAtualizar.addEventListener("click", carregarDashboard);
    }

    const botaoSair = document.querySelector("#botao-sair");
    if (botaoSair) {
        botaoSair.addEventListener("click", sairDoSistema);
    }
});

async function buscarDados(url) {
    const resposta = await fetch(url);
    let dados;

    try {
        dados = await resposta.json();
    } catch (erro) {
        dados = {};
    }

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem || dados.erro ||
            `Não foi possível consultar os dados (HTTP ${resposta.status}).`
        );
    }

    return dados;
}

async function carregarDashboard() {
    mostrarErro("");
    mostrarMensagem("Atualizando informações...");
    definirCarregando("lista-demandas-recentes", 5, "Carregando demandas...");
    definirCarregando("lista-proximas-prazo", 4, "Carregando prazos...");

    try {
        // Os dois endpoints existentes são consultados sem alterar o Back-end.
        const [dadosDashboard, dadosLista] = await Promise.all([
            buscarDados(`${API_URL}/dashboard`),
            buscarDados(`${API_URL}/demandas`)
        ]);

        atualizarIndicadores(dadosDashboard);

        const demandas = Array.isArray(dadosLista)
            ? dadosLista
            : (Array.isArray(dadosLista.demandas) ? dadosLista.demandas : []);

        atualizarDemandasRecentes(demandas);
        atualizarProximasDoPrazo(
            Array.isArray(dadosDashboard.proximasDoPrazo)
                ? dadosDashboard.proximasDoPrazo
                : [],
            demandas
        );

        mostrarMensagem("Informações atualizadas com sucesso.");
    } catch (erro) {
        console.error("Erro ao carregar o Dashboard:", erro);
        mostrarErro(erro.message || "Não foi possível carregar o Dashboard.");
        mostrarMensagem("Verifique se o servidor está em execução e tente novamente.");
        exibirLinhaVazia("lista-demandas-recentes", 5, "Não foi possível carregar as demandas.");
        exibirLinhaVazia("lista-proximas-prazo", 4, "Não foi possível carregar os prazos.");
    }
}

function atualizarIndicadores(dados) {
    const status = dados.porStatus || {};
    const prioridades = dados.porPrioridade || {};

    definirTexto("total-demandas", dados.total);
    definirTexto("demandas-abertas", status.aberta);
    definirTexto("demandas-andamento", status.andamento);
    definirTexto("demandas-concluidas", status.concluida);

    definirTexto("prioridade-critica", prioridades.critica);
    definirTexto("prioridade-alta", prioridades.alta);
    definirTexto("prioridade-media", prioridades.media);
    definirTexto("prioridade-baixa", prioridades.baixa);
}

function atualizarDemandasRecentes(demandas) {
    const tabela = document.querySelector("#lista-demandas-recentes");
    if (!tabela) return;

    tabela.replaceChildren();

    const recentes = [...demandas]
        .sort((a, b) => compararDatas(b.dataCriacao, a.dataCriacao))
        .slice(0, 5);

    if (recentes.length === 0) {
        exibirLinhaVazia("lista-demandas-recentes", 5, "Nenhuma demanda cadastrada.");
        return;
    }

    recentes.forEach(demanda => {
        const linha = document.createElement("tr");
        linha.appendChild(criarCelula(demanda.titulo));
        linha.appendChild(criarCelula(demanda.prioridade));
        linha.appendChild(criarCelula(demanda.status));
        linha.appendChild(criarCelula(
            demanda.responsavel?.nome ||
            (demanda.responsavelId ? `Usuário ${demanda.responsavelId}` : "Sem responsável")
        ));
        linha.appendChild(criarCelula(formatarData(demanda.dataCriacao)));
        tabela.appendChild(linha);
    });
}

function atualizarProximasDoPrazo(proximas, demandasCompletas) {
    const tabela = document.querySelector("#lista-proximas-prazo");
    if (!tabela) return;

    tabela.replaceChildren();

    const dadosCompletos = new Map(
        demandasCompletas.map(demanda => [Number(demanda.id), demanda])
    );

    const lista = [...proximas].sort((a, b) =>
        String(a.prazo || "").localeCompare(String(b.prazo || ""))
    );

    if (lista.length === 0) {
        exibirLinhaVazia("lista-proximas-prazo", 4, "Nenhuma demanda próxima do prazo.");
        return;
    }

    lista.forEach(demanda => {
        const completa = dadosCompletos.get(Number(demanda.id)) || demanda;
        const linha = document.createElement("tr");
        linha.appendChild(criarCelula(completa.titulo || demanda.titulo));
        linha.appendChild(criarCelula(formatarData(completa.prazo || demanda.prazo)));
        linha.appendChild(criarCelula(completa.status || demanda.status));
        linha.appendChild(criarCelula(
            completa.responsavel?.nome ||
            (completa.responsavelId ? `Usuário ${completa.responsavelId}` : "Sem responsável")
        ));
        tabela.appendChild(linha);
    });
}

function definirTexto(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor ?? 0;
    }
}

function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto ?? "—";
    return celula;
}

function definirCarregando(id, colunas, mensagem) {
    exibirLinhaVazia(id, colunas, mensagem);
}

function exibirLinhaVazia(id, colunas, mensagem) {
    const tabela = document.getElementById(id);
    if (!tabela) return;

    tabela.replaceChildren();
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = colunas;
    celula.textContent = mensagem;
    linha.appendChild(celula);
    tabela.appendChild(linha);
}

function formatarData(data) {
    if (!data) return "—";

    const valor = String(data).substring(0, 10);
    const partes = valor.split("-");

    if (partes.length !== 3) return valor;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function compararDatas(dataA, dataB) {
    const data1 = dataA ? new Date(dataA).getTime() : 0;
    const data2 = dataB ? new Date(dataB).getTime() : 0;
    return (Number.isNaN(data1) ? 0 : data1) - (Number.isNaN(data2) ? 0 : data2);
}

function mostrarErro(mensagem) {
    const elemento = document.querySelector("#mensagem-erro-dashboard");
    if (!elemento) return;

    elemento.textContent = mensagem;
    elemento.hidden = !mensagem;
}

function mostrarMensagem(mensagem) {
    const elemento = document.querySelector("#mensagem-dashboard");
    if (elemento) elemento.textContent = mensagem;
}
