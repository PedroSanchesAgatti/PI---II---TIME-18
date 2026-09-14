```javascript
/*
    Autor: Hyan Victor
    Arquivo: dashboard.js
    Tela: Dashboard
    Projeto Integrador II - Engenharia de Software - 2026
    como não tem muito o que validar aqui, eu apenas coloquei para conferir se as informações batem 
*/


// PEGAR OS CARDS DO DASHBOARD

const cards = document.querySelectorAll(".card");


// VERIFICAR SE OS CARDS EXISTEM

if (cards.length === 4) {

    const total = parseInt(cards[0].querySelector("strong").textContent);
    const abertas = parseInt(cards[1].querySelector("strong").textContent);
    const andamento = parseInt(cards[2].querySelector("strong").textContent);
    const concluidas = parseInt(cards[3].querySelector("strong").textContent);


    // VALIDAR OS NÚMEROS

    if (
        isNaN(total) ||
        isNaN(abertas) ||
        isNaN(andamento) ||
        isNaN(concluidas)
    ) {

        console.error(
            "Erro: os valores do resumo do Dashboard são inválidos."
        );

    } else {

        // VERIFICAR SE A SOMA DOS STATUS É IGUAL AO TOTAL

        const soma = abertas + andamento + concluidas;


        if (soma !== total) {

            console.error(
                "Erro: os dados do Dashboard não estão consistentes."
            );

        } else {

            console.log(
                "Dashboard validado: os dados estão consistentes."
            );

        }
    }
}


// VALIDAR DEMANDAS RECENTES

const linhas = document.querySelectorAll(
    ".bloco-dashboard table tbody tr"
);


linhas.forEach(function (linha, indice) {

    const colunas = linha.querySelectorAll("td");


    if (colunas.length < 4) {

        console.error(
            "Erro na demanda " + (indice + 1) +
            ": informações incompletas."
        );

        return;
    }


    const titulo = colunas[0].textContent.trim();
    const prioridade = colunas[1].textContent.trim();
    const status = colunas[2].textContent.trim();
    const responsavel = colunas[3].textContent.trim();


    // VALIDAR TÍTULO

    if (titulo === "") {

        console.error(
            "Erro: a demanda " + (indice + 1) +
            " não possui título."
        );
    }


    // VALIDAR PRIORIDADE

    if (prioridade === "") {

        console.error(
            "Erro: a demanda " + (indice + 1) +
            " não possui prioridade."
        );
    }


    // VALIDAR STATUS

    if (status === "") {

        console.error(
            "Erro: a demanda " + (indice + 1) +
            " não possui status."
        );
    }


    // VALIDAR RESPONSÁVEL

    if (responsavel === "") {

        console.error(
            "Erro: a demanda " + (indice + 1) +
            " não possui responsável."
        );
    }

});


// MENSAGEM NO CONSOLE

console.log(
    "Dashboard carregado e validado com JavaScript."
);
```
