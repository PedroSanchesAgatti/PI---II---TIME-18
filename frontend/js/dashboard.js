/*
    Autor: Hyan Victor
    Arquivo: dashboard.js
    Tela: Dashboard
    Projeto Integrador II - Engenharia de Software - 2026
*/

console.log("dashboard.js carregado!");

const API_URL = "http://localhost:3000";


document.addEventListener(
    "DOMContentLoaded",
    carregarDashboard
);

async function carregarDashboard() {

    console.log("Buscando dados do dashboard...");

    try {

        const resposta = await fetch(
            `${API_URL}/dashboard`
        );

        const dados = await resposta.json();

        console.log(
            "Dados recebidos do dashboard:",
            dados
        );

        if (!resposta.ok) {

            console.error(
                "Erro ao carregar dashboard:",
                dados
            );

            return;
        }

        document.getElementById(
            "total-demandas"
        ).textContent = dados.total;


        document.getElementById(
            "demandas-abertas"
        ).textContent =
            dados.porStatus.aberta;


        document.getElementById(
            "demandas-andamento"
        ).textContent =
            dados.porStatus.andamento;


        document.getElementById(
            "demandas-concluidas"
        ).textContent =
            dados.porStatus.concluida;

        document.getElementById(
            "prioridade-critica"
        ).textContent =
            dados.porPrioridade.critica;


        document.getElementById(
            "prioridade-alta"
        ).textContent =
            dados.porPrioridade.alta;


        document.getElementById(
            "prioridade-media"
        ).textContent =
            dados.porPrioridade.media;


        document.getElementById(
            "prioridade-baixa"
        ).textContent =
            dados.porPrioridade.baixa;


        atualizarDemandasRecentes(
            dados.criticasEmAberto
        );


        console.log(
            "Dashboard atualizado com sucesso!"
        );


    } catch (erro) {

        console.error(
            "Não foi possível conectar ao servidor:",
            erro
        );
    }
}


function atualizarDemandasRecentes(demandas) {

    const tabela = document.getElementById(
        "lista-demandas-recentes"
    );


    if (!tabela) {

        console.error(
            "Tabela lista-demandas-recentes não encontrada."
        );

        return;
    }


    tabela.replaceChildren();


    if (!demandas || demandas.length === 0) {

        const linha =
            document.createElement("tr");

        const coluna =
            document.createElement("td");


        coluna.colSpan = 4;

        coluna.textContent =
            "Nenhuma demanda crítica em aberto.";


        linha.appendChild(coluna);

        tabela.appendChild(linha);

        return;
    }


    demandas.forEach(function (demanda) {

        const linha =
            document.createElement("tr");


        // TÍTULO
        linha.appendChild(
            criarCelula(
                demanda.titulo
            )
        );


        // PRIORIDADE
        linha.appendChild(
            criarCelula(
                demanda.prioridade
            )
        );


        // STATUS
        linha.appendChild(
            criarCelula(
                demanda.status
            )
        );


        // RESPONSÁVEL
        linha.appendChild(
            criarCelula(
                demanda.responsavelId
                    ? "Usuário " +
                      demanda.responsavelId
                    : "Sem responsável"
            )
        );


        tabela.appendChild(linha);
    });
}



function criarCelula(texto) {

    const td =
        document.createElement("td");

    td.textContent =
        texto ?? "—";

    return td;
}