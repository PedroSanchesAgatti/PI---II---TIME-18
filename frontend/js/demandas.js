const usuario = obterUsuarioAutenticado();

if (!usuario) {
    throw new Error(
        "Usuário não autenticado."
    );
}


console.log("demandas.js carregado!");

const API_URL = "http://localhost:3000";

const campoStatus =
    document.querySelector("#status");

const campoPrioridade =
    document.querySelector("#prioridade");

const campoTipo =
    document.querySelector("#tipo");

const campoBusca =
    document.querySelector("#busca");

const campoOrdenarPor =
    document.querySelector("#ordenarPor");

const campoOrdem =
    document.querySelector("#ordem");

const botaoFiltrar =
    document.querySelector("#botao-filtrar");

const erroStatus =
    document.querySelector("#erroStatus");

const erroPrioridade =
    document.querySelector("#erroPrioridade");

const erroBusca =
    document.querySelector("#erroBusca");

const tabela =
    document.querySelector("#tabela-demandas");

const mensagemLista =
    document.querySelector("#mensagem-lista");


const statusPermitidos = [
    "",
    "Aberta",
    "Em andamento",
    "Em revisão",
    "Concluída",
    "Cancelada"
];

const prioridadesPermitidas = [
    "",
    "Crítica",
    "Alta",
    "Média",
    "Baixa"
];

botaoFiltrar.addEventListener(
    "click",
    function () {

        limparErros();

        const status =
            campoStatus.value;

        const prioridade =
            campoPrioridade.value;

        const busca =
            campoBusca.value.trim();

        let valido = true;


        if (!statusPermitidos.includes(status)) {

            erroStatus.innerText =
                "Status inválido.";

            campoStatus.classList.add(
                "invalido"
            );

            valido = false;
        }


        if (
            !prioridadesPermitidas.includes(
                prioridade
            )
        ) {

            erroPrioridade.innerText =
                "Prioridade inválida.";

            campoPrioridade.classList.add(
                "invalido"
            );

            valido = false;
        }


        if (
            busca.length > 0 &&
            busca.length < 3
        ) {

            erroBusca.innerText =
                "Digite ao menos 3 caracteres.";

            campoBusca.classList.add(
                "invalido"
            );

            valido = false;
        }


        if (!valido) {
            return;
        }


        carregarDemandas();
    }
);


function limparErros() {

    campoStatus.classList.remove(
        "invalido"
    );

    campoPrioridade.classList.remove(
        "invalido"
    );

    campoBusca.classList.remove(
        "invalido"
    );


    erroStatus.innerText = "";
    erroPrioridade.innerText = "";
    erroBusca.innerText = "";
}


function montarQuery() {

    const params =
        new URLSearchParams();


    if (campoStatus.value) {

        params.set(
            "status",
            campoStatus.value
        );
    }


    if (campoPrioridade.value) {

        params.set(
            "prioridade",
            campoPrioridade.value
        );
    }


    if (campoTipo.value) {

        params.set(
            "tipo",
            campoTipo.value
        );
    }


    if (campoBusca.value.trim()) {

        params.set(
            "busca",
            campoBusca.value.trim()
        );
    }


    params.set(
        "ordenarPor",
        campoOrdenarPor.value
    );

    params.set(
        "ordem",
        campoOrdem.value
    );


    return params.toString();
}

function formatarData(data) {

    if (!data) {
        return "—";
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

function criarCelula(texto) {

    const td =
        document.createElement("td");

    td.textContent =
        texto ?? "—";

    return td;
}


function renderizar(demandas) {

    tabela.replaceChildren();


    demandas.forEach(function (demanda) {

        const tr =
            document.createElement("tr");


        tr.appendChild(
            criarCelula(demanda.titulo)
        );

        tr.appendChild(
            criarCelula(demanda.tipo)
        );

        tr.appendChild(
            criarCelula(demanda.prioridade)
        );

        tr.appendChild(
            criarCelula(demanda.status)
        );


        tr.appendChild(
            criarCelula(
                demanda.projeto
                    ? demanda.projeto.nome
                    : "—"
            )
        );


        tr.appendChild(
            criarCelula(
                demanda.responsavel
                    ? demanda.responsavel.nome
                    : "Sem responsável"
            )
        );


        tr.appendChild(
            criarCelula(
                formatarData(
                    demanda.dataCriacao
                )
            )
        );


        tr.appendChild(
            criarCelula(
                formatarData(
                    demanda.prazo
                )
            )
        );


        // BOTÃO DETALHES

        const acoes =
            document.createElement("td");

        const link =
            document.createElement("a");


        link.href =
            "detalhes-demanda.html?id=" +
            demanda.id;

        link.textContent =
            "Detalhes";

        link.classList.add(
            "botao"
        );


        acoes.appendChild(link);

        tr.appendChild(acoes);

        tabela.appendChild(tr);
    });
}



async function carregarDemandas() {

    mensagemLista.textContent =
        "Carregando...";


    try {

        const resposta = await fetch(
            `${API_URL}/demandas?${montarQuery()}`
        );


        const dados =
            await resposta.json();


        console.log(
            "Resposta /demandas:",
            dados
        );


        if (!resposta.ok) {

            tabela.replaceChildren();

            mensagemLista.textContent =
                dados.mensagem ||
                "Não foi possível listar as demandas.";

            return;
        }


        /*
         * Aceita tanto:
         *
         * { demandas: [...] }
         *
         * quanto:
         *
         * [...]
         */

        const lista =
            Array.isArray(dados)
                ? dados
                : dados.demandas || [];


        renderizar(lista);


        mensagemLista.textContent =
            lista.length === 0
                ? "Nenhuma demanda encontrada."
                : lista.length +
                " demanda(s) encontrada(s).";


    } catch (erro) {

        tabela.replaceChildren();

        mensagemLista.textContent =
            "Não foi possível conectar ao servidor.";


        console.error(
            "Erro ao carregar demandas:",
            erro
        );
    }
}

carregarDemandas();