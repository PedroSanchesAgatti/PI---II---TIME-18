
const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", carregarDemanda);

async function carregarDemanda() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    const mensagem = document.getElementById("mensagem-demanda");
    const informacoes = document.getElementById("informacoes-demanda");
    const botaoEditar = document.getElementById("botao-editar");

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        mensagem.textContent =
            "Selecione uma demanda na página de listagem.";
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/demandas/${id}`);

        if (resposta.status === 404) {
            mensagem.textContent = "Demanda não encontrada.";
            return;
        }

        if (!resposta.ok) {
            throw new Error("Erro ao consultar a demanda.");
        }

        const demanda = await resposta.json();

        document.getElementById("titulo").textContent =
            demanda.titulo || "Não informado";

        document.getElementById("descricao").textContent =
            demanda.descricao || "Não informada";

        document.getElementById("tipo").textContent =
            demanda.tipo || "Não informado";

        document.getElementById("projeto").textContent =
            demanda.projetoId != null
                ? `Projeto ${demanda.projetoId}`
                : "Não informado";

        document.getElementById("prioridade").textContent =
            demanda.prioridade || "Não informada";

        document.getElementById("status").textContent =
            demanda.status || "Não informado";

        document.getElementById("responsavel").textContent =
            demanda.responsavelId != null
                ? `Usuário ${demanda.responsavelId}`
                : "Não atribuído";

        document.getElementById("prazo").textContent =
            formatarData(demanda.prazo);

        document.getElementById("data-criacao").textContent =
            formatarData(demanda.dataCriacao);

        document.getElementById("data-atualizacao").textContent =
            formatarData(demanda.dataAtualizacao);

        botaoEditar.href = `cadastro-demanda.html?id=${demanda.id}`;

        informacoes.hidden = false;
        mensagem.textContent = "";

    } catch (erro) {
        mensagem.textContent =
            "Não foi possível carregar os dados. Verifique se a API está funcionando.";

        console.error(erro);
    }
}

function formatarData(data) {
    if (!data) {
        return "Não informado";
    }

    const valor = String(data).substring(0, 10);
    const partes = valor.split("-");

    if (partes.length !== 3) {
        return valor;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
const link = document.createElement("a");

link.href = `detalhes-demanda.html?id=${demanda.id}`;
link.textContent = "Ver detalhes";
