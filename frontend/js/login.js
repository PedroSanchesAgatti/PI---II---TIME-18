
// ============================================================
// AUTORIA: Pedro Henrique Sanches
// Estrutura inicial do formulário e validações básicas
// ============================================================
console.log("login.js carregado!");

const API_URL = "http://localhost:3000";

const formulario = document.querySelector("#login-form");
const campoSenha = document.querySelector("#password");
const campoEmail = document.querySelector("#email");
const mensagemLogin = document.querySelector("#mensagem-login");
const botaoEntrar = document.querySelector("#botao-entrar");

const botaoMostrarSenha = document.querySelector("#mostrarSenha");
const contadorSenha = document.querySelector("#contadorSenha");
const forcaSenha = document.querySelector("#forcaSenha");


// ============================================================
// ENVIO DO LOGIN
// ============================================================

formulario.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    limparErros();

    const email = campoEmail.value.trim();
    const senha = campoSenha.value;

    let valido = true;


    // E-MAIL
    if (email.length === 0) {

        campoEmail.setCustomValidity("Informe o e-mail.");
        campoEmail.classList.add("invalido");

        valido = false;

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        campoEmail.setCustomValidity(
            "Informe um e-mail válido."
        );

        campoEmail.classList.add("invalido");

        valido = false;
    }


    // SENHA
    if (senha.length === 0) {

        campoSenha.setCustomValidity(
            "Informe a senha."
        );

        campoSenha.classList.add("invalido");

        valido = false;
    }


    if (!valido) {

        if (!campoEmail.checkValidity()) {
            campoEmail.reportValidity();
        } else {
            campoSenha.reportValidity();
        }

        return;
    }


    mensagemLogin.hidden = true;

    botaoEntrar.disabled = true;
    botaoEntrar.textContent = "Entrando...";


    try {

        const resposta = await fetch(
            `${API_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );


        const dados = await resposta.json();


        if (!resposta.ok) {

            mensagemLogin.textContent =
                dados.mensagem ||
                dados.message ||
                "E-mail ou senha incorretos.";

            mensagemLogin.hidden = false;

            return;
        }


        console.log(
            "Login realizado:",
            dados
        );


        window.location.href =
            "dashboard.html";


    } catch (erro) {

        mensagemLogin.textContent =
            "Não foi possível conectar ao servidor.";

        mensagemLogin.hidden = false;

        console.error(
            "Erro ao fazer login:",
            erro
        );


    } finally {

        botaoEntrar.disabled = false;
        botaoEntrar.textContent = "Entrar";
    }

});


// ============================================================
// LIMPAR ERROS
// ============================================================

campoEmail.addEventListener("input", function () {

    campoEmail.setCustomValidity("");
    campoEmail.classList.remove("invalido");

});


campoSenha.addEventListener("input", function () {

    campoSenha.setCustomValidity("");
    campoSenha.classList.remove("invalido");

});


// ============================================================
// CONTADOR DA SENHA
// ============================================================

campoSenha.addEventListener("input", function () {

    if (contadorSenha) {

        contadorSenha.textContent =
            campoSenha.value.length + "/64";
    }

});


// ============================================================
// MOSTRAR / OCULTAR SENHA
// ============================================================

if (botaoMostrarSenha) {

    botaoMostrarSenha.addEventListener(
        "click",
        function () {

            if (campoSenha.type === "password") {

                campoSenha.type = "text";

                botaoMostrarSenha.textContent =
                    "Ocultar senha";

                botaoMostrarSenha.setAttribute(
                    "aria-pressed",
                    "true"
                );

            } else {

                campoSenha.type = "password";

                botaoMostrarSenha.textContent =
                    "Mostrar senha";

                botaoMostrarSenha.setAttribute(
                    "aria-pressed",
                    "false"
                );
            }
        }
    );
}


// ============================================================
// FORÇA DA SENHA
// ============================================================

campoSenha.addEventListener("input", function () {

    if (!forcaSenha) {
        return;
    }

    const senha = campoSenha.value;

    let pontos = 0;

    if (senha.length >= 8) pontos++;
    if (/[A-Z]/.test(senha)) pontos++;
    if (/[a-z]/.test(senha)) pontos++;
    if (/[0-9]/.test(senha)) pontos++;
    if (/[!@#$%^&*]/.test(senha)) pontos++;


    if (senha.length === 0) {

        forcaSenha.textContent =
            "Força da senha: -";

    } else if (pontos <= 2) {

        forcaSenha.textContent =
            "Força da senha: Fraca";

    } else if (pontos === 3) {

        forcaSenha.textContent =
            "Força da senha: Média";

    } else if (pontos === 4) {

        forcaSenha.textContent =
            "Força da senha: Forte";

    } else {

        forcaSenha.textContent =
            "Força da senha: Muito forte";
    }

});


function limparErros() {

    campoSenha.setCustomValidity("");
    campoEmail.setCustomValidity("");

    campoSenha.classList.remove("invalido");
    campoEmail.classList.remove("invalido");
}