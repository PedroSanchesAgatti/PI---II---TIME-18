const usuario = obterUsuarioAutenticado();

if (!usuario) {
    throw new Error(
        "Usuário não autenticado."
    );
}


console.log("detalhes-demanda.js carregado!");

const API_URL = "http://localhost:3000";


document.addEventListener(
    "DOMContentLoaded",
    carregarDemanda
);


// ============================================================
// CARREGAR DEMANDA
// ============================================================

async function carregarDemanda() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get("id");


    const mensagem =
        document.getElementById(
            "mensagem-demanda"
        );


    const informacoes =
        document.getElementById(
            "informacoes-demanda"
        );


    const botaoEditar =
        document.getElementById(
            "botao-editar"
        );


    // ========================================================
    // VALIDAR ID
    // ========================================================

    if (
        !id ||
        !Number.isInteger(Number(id)) ||
        Number(id) <= 0
    ) {

        mensagem.textContent =
            "Selecione uma demanda na página de listagem.";

        return;
    }


    try {

        // ====================================================
        // GET /demandas/:id
        // ====================================================

        const resposta = await fetch(
            `${API_URL}/demandas/${id}`
        );


        if (resposta.status === 404) {

            mensagem.textContent =
                "Demanda não encontrada.";

            return;
        }


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar a demanda."
            );
        }


        const demanda =
            await resposta.json();


        console.log(
            "Demanda recebida:",
            demanda
        );


        // ====================================================
        // PREENCHER HTML
        // ====================================================

        document.getElementById(
            "titulo"
        ).textContent =
            demanda.titulo ||
            "Não informado";


        document.getElementById(
            "descricao"
        ).textContent =
            demanda.descricao ||
            "Não informada";


        document.getElementById(
            "tipo"
        ).textContent =
            demanda.tipo ||
            "Não informado";


        document.getElementById(
            "prioridade"
        ).textContent =
            demanda.prioridade ||
            "Não informada";


        document.getElementById(
            "status"
        ).textContent =
            demanda.status ||
            "Não informado";


        // PROJETO

        document.getElementById(
            "projeto"
        ).textContent =
            demanda.projeto
                ? demanda.projeto.nome
                : "Não informado";


        // RESPONSÁVEL

        document.getElementById(
            "responsavel"
        ).textContent =
            demanda.responsavel
                ? demanda.responsavel.nome
                : "Não atribuído";


        // PRAZO

        document.getElementById(
            "prazo"
        ).textContent =
            formatarData(
                demanda.prazo
            );


        // DATA DE CRIAÇÃO

        document.getElementById(
            "data-criacao"
        ).textContent =
            formatarData(
                demanda.dataCriacao
            );


        // DATA DE ATUALIZAÇÃO

        document.getElementById(
            "data-atualizacao"
        ).textContent =
            formatarData(
                demanda.dataAtualizacao
            );


        // ====================================================
        // MOSTRAR INFORMAÇÕES
        // ====================================================

        informacoes.hidden = false;

        mensagem.textContent = "";


        // O botão editar continua preparado
        // para uma implementação futura.

        botaoEditar.href =
            `cadastro-demanda.html?id=${demanda.id}`;


    } catch (erro) {

        mensagem.textContent =
            "Não foi possível carregar os dados. " +
            "Verifique se a API está funcionando.";


        console.error(
            "Erro ao carregar demanda:",
            erro
        );
    }
}


// ============================================================
// FORMATAR DATA
// ============================================================

function formatarData(data) {

    if (!data) {
        return "Não informado";
    }


    const valor =
        String(data).substring(0, 10);


    const partes =
        valor.split("-");


    if (partes.length !== 3) {
        return valor;
    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );
}