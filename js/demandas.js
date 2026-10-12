console.log("JS carregado!");

const campoStatus=document.querySelector("#status");
const campoPrioridade=document.querySelector("#prioridade");
const campoBusca=document.querySelector("#busca");
const botaoFiltrar=document.querySelector(".botao-salvar");

const erroStatus=document.querySelector("#erroStatus");
const erroPrioridade=document.querySelector("#erroPrioridade");
const erroBusca=document.querySelector("#erroBusca");

botaoFiltrar.addEventListener("click", function () {

    limparErros();

    const status=campoStatus.value;
    const prioridade=campoPrioridade.value;
    const busca=campoBusca.value.trim();

    let valido=true;

    const statusPermitidos=["", "aberta", "andamento", "revisao", "concluida", "cancelada"];
    const prioridadesPermitidas=["", "critica", "alta", "media", "baixa"];

    if (!statusPermitidos.includes(status)) {
        erroStatus.innerText="Status inválido.";
        campoStatus.classList.add("invalido");
        valido=false;
    }

    if (!prioridadesPermitidas.includes(prioridade)) {
        erroPrioridade.innerText="Prioridade inválida.";
        campoPrioridade.classList.add("invalido");
        valido=false;
    }

    if (busca.length > 0 && busca.length < 3) {
        erroBusca.innerText="Digite ao menos 3 caracteres.";
        campoBusca.classList.add("invalido");
        valido=false;
    }

    if (!valido) return;

    console.log("Filtros válidos!");
});
    
function limparErros() {
    campoStatus.classList.remove("invalido");
    campoPrioridade.classList.remove("invalido");
    campoBusca.classList.remove("invalido");

    erroStatus.innerText="";
    erroPrioridade.innerText="";
    erroBusca.innerText="";
}
