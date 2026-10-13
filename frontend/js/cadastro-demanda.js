console.log("cadastro-demanda.js carregado!");

const API_URL = "http://localhost:3000";

const formulario =
    document.getElementById("form-cadastro-demanda");

const mensagemCadastro =
    document.getElementById("mensagem-cadastro");

const botaoSalvar =
    document.getElementById("botao-salvar");

// VERIFICAR SE ESTAMOS EDITANDO
const parametros =
    new URLSearchParams(window.location.search);

const idDemanda =
    parametros.get("id");

const modoEdicao =
    idDemanda !== null;

// SE TIVER ID, CARREGAR DADOS DA DEMANDA

if (modoEdicao) {

    carregarDemandaParaEdicao();

}

// CARREGAR DEMANDA

async function carregarDemandaParaEdicao() {

    try {

        const resposta = await fetch(
            `${API_URL}/demandas/${idDemanda}`
        );


        const demanda =
            await resposta.json();


        if (!resposta.ok) {

            mostrarMensagem(
                demanda.mensagem ||
                "Não foi possível carregar a demanda.",
                "erro"
            );

            return;
        }


        
        // PREENCHER FORMULÁRIO
        

        document.getElementById(
            "titulo"
        ).value =
            demanda.titulo || "";


        document.getElementById(
            "descricao"
        ).value =
            demanda.descricao || "";


        document.getElementById(
            "tipo"
        ).value =
            demanda.tipo || "";


        document.getElementById(
            "prioridade"
        ).value =
            demanda.prioridade || "";


        document.getElementById(
            "projeto"
        ).value =
            String(
                demanda.projetoId || ""
            );


        document.getElementById(
            "responsavel"
        ).value =
            demanda.responsavelId
                ? String(
                    demanda.responsavelId
                )
                : "";


        document.getElementById(
            "prazo"
        ).value =
            demanda.prazo
                ? String(
                    demanda.prazo
                ).substring(0, 10)
                : "";


        botaoSalvar.textContent =
            "Atualizar demanda";


        console.log(
            "Demanda carregada para edição:",
            demanda
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar demanda:",
            erro
        );


        mostrarMensagem(
            "Não foi possível conectar com o servidor.",
            "erro"
        );
    }

}

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const titulo =
            document
                .getElementById("titulo")
                .value
                .trim();


        const descricao =
            document
                .getElementById("descricao")
                .value
                .trim();


        const tipo =
            document
                .getElementById("tipo")
                .value;


        const prioridade =
            document
                .getElementById("prioridade")
                .value;


        const projeto =
            document
                .getElementById("projeto")
                .value;


        const responsavel =
            document
                .getElementById("responsavel")
                .value;


        const prazo =
            document
                .getElementById("prazo")
                .value;


        // VALIDAÇÃO

        if (
            titulo === "" ||
            descricao === "" ||
            tipo === "" ||
            prioridade === "" ||
            projeto === ""
        ) {

            mostrarMensagem(
                "Preencha todos os campos obrigatórios.",
                "erro"
            );

            return;
        }


        const demanda = {

            titulo,

            descricao,

            tipo,

            prioridade,

            projetoId:
                Number(projeto),

            responsavelId:
                responsavel !== ""
                    ? Number(responsavel)
                    : null,

            prazo:
                prazo !== ""
                    ? prazo
                    : null
        };


        botaoSalvar.disabled = true;


        botaoSalvar.textContent =
            modoEdicao
                ? "Atualizando..."
                : "Salvando...";


        try {

            // SE TEM ID = PUT
            // SE NÃO TEM ID = POST

            const url =
                modoEdicao
                    ? `${API_URL}/demandas/${idDemanda}`
                    : `${API_URL}/demandas`;


            const metodo =
                modoEdicao
                    ? "PUT"
                    : "POST";


            console.log(
                "Método:",
                metodo
            );


            console.log(
                "URL:",
                url
            );


            console.log(
                "Dados:",
                demanda
            );


            const resposta = await fetch(
                url,
                {
                    method: metodo,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            demanda
                        )
                }
            );


            const dados =
                await resposta.json();


            console.log(
                "Status:",
                resposta.status
            );


            console.log(
                "Resposta:",
                dados
            );

            if (!resposta.ok) {

                mostrarMensagem(
                    dados.mensagem ||
                    "Não foi possível salvar a demanda.",
                    "erro"
                );

                return;
            }



            if (modoEdicao) {

                mostrarMensagem(
                    "Demanda atualizada com sucesso!",
                    "sucesso"
                );

            } else {

                mostrarMensagem(
                    "Demanda cadastrada com sucesso!",
                    "sucesso"
                );
            }


            setTimeout(function () {

                window.location.href =
                    "demandas.html";

            }, 800);


        } catch (erro) {

            console.error(
                "Erro:",
                erro
            );


            mostrarMensagem(
                "Não foi possível conectar com o servidor.",
                "erro"
            );


        } finally {

            botaoSalvar.disabled =
                false;


            botaoSalvar.textContent =
                modoEdicao
                    ? "Atualizar demanda"
                    : "Salvar demanda";
        }

    }
);


function mostrarMensagem(texto, tipo) {

    mensagemCadastro.hidden =
        false;


    mensagemCadastro.textContent =
        texto;


    mensagemCadastro.style.color =
        tipo === "sucesso"
            ? "green"
            : "red";
}