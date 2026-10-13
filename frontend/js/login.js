
// ============================================================
// AUTORIA: Pedro Henrique Sanches
// Estrutura inicial do formulário e validações básicas
// ============================================================

console.log("JS carregado!");

const formulario = document.querySelector("#login-form");
const campoSenha = document.querySelector("#password");
const mensagemLogin = document.querySelector("#mensagem-login");
const botaoEntrar = document.querySelector("#botao-entrar");



// ============================================================
// AUTORIA: Júlia Guarnieri
// Elementos adicionados para novas funcionalidades
// ============================================================

const botaoMostrarSenha = document.querySelector("#mostrarSenha");
const contadorSenha = document.querySelector("#contadorSenha");
const forcaSenha = document.querySelector("#forcaSenha");
const campoEmail = document.querySelector("#email");


// ============================================================
// AUTORIA: Pedro Henrique Sanches
// Validação do formulário no envio
// ============================================================

formulario.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    limparErros();

    const senha = campoSenha.value;
    const email = campoEmail.value.trim();

    let valido = true;





    // ========================================================
    // AUTORIA: Júlia Guarnieri
    // Validação do e-mail
    // ========================================================

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


    // ========================================================
    // AUTORIA: Pedro Henrique Sanches
    // Validação básica da senha
    // ========================================================

    if (senha.length === 0) {
        campoSenha.setCustomValidity("Informe a senha.");
        campoSenha.classList.add("invalido");
        valido = false;
    }



    // ========================================================
    // AUTORIA: Júlia Guarnieri
    // Novas regras de segurança para a senha
    // ========================================================

    else if (!/[A-Z]/.test(senha)) {

        campoSenha.setCustomValidity(
            "A senha deve conter pelo menos uma letra maiúscula."
        );

        campoSenha.classList.add("invalido");
        valido = false;

    } else if (!/[a-z]/.test(senha)) {

        campoSenha.setCustomValidity(
            "A senha deve conter pelo menos uma letra minúscula."
        );

        campoSenha.classList.add("invalido");
        valido = false;

    } else if (!/[0-9]/.test(senha)) {

        campoSenha.setCustomValidity(
            "A senha deve conter pelo menos um número."
        );

        campoSenha.classList.add("invalido");
        valido = false;

    } else if (!/[!@#$%^&*]/.test(senha)) {

        campoSenha.setCustomValidity(
            "A senha deve conter pelo menos um caractere especial."
        );

        campoSenha.classList.add("invalido");
        valido = false;
    }


    // ========================================================
    // AUTORIA: Pedro Henrique Sanches
    // Impede o acesso caso existam erros
    // ========================================================

    if (!valido) {

        if (!campoEmail.checkValidity()) {

            campoEmail.reportValidity();

        } else {

            campoSenha.reportValidity();
        }

        return;
    }


    // ========================================================
    // AUTORIA: Pedro Henrique Sanches
    // Redirecionamento após login válido
    // ========================================================

    botaoEntrar.disabled = true;
    botaoEntrar.textContent = "Entrando...";

    try {
        const resposta = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        let dados = {};
        try {
            dados = await resposta.json();
        } catch {
            // A resposta pode não conter JSON.
        }

        if (resposta.status === 400) {
            mensagemLogin.textContent =
                dados.mensagem || dados.message || "Confira os dados informados.";
            mensagemLogin.hidden = false;
            return;
        }

        if (resposta.status === 401) {
            mensagemLogin.textContent =
                dados.mensagem || dados.message || "E-mail ou senha incorretos.";
            mensagemLogin.hidden = false;
            return;
        }

        if (!resposta.ok) {
            mensagemLogin.textContent =
                dados.mensagem || dados.message || "Não foi possível entrar. Tente novamente.";
            mensagemLogin.hidden = false;
            return;
        }

        window.location.href = "dashboard.html";
    } catch (erro) {
        mensagemLogin.textContent =
            "Não foi possível conectar ao servidor. Verifique se a API está em execução.";
        mensagemLogin.hidden = false;
        console.error("Erro ao fazer login:", erro);
    } finally {
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = "Entrar";
    }

});


// ============================================================
// AUTORIA: Pedro Henrique Sanches
// Limpeza dos erros enquanto o usuário digita
// ============================================================



campoSenha.addEventListener("input", function () {

    campoSenha.setCustomValidity("");
    campoSenha.classList.remove("invalido");
});


// ============================================================
// AUTORIA: Júlia Guarnieri
// Limpeza do erro do e-mail enquanto o usuário digita
// ============================================================

campoEmail.addEventListener("input", function () {

    campoEmail.setCustomValidity("");
    campoEmail.classList.remove("invalido");
});


// ============================================================
// AUTORIA: Júlia Guarnieri
// Contador de caracteres da senha
// ============================================================

campoSenha.addEventListener("input", function () {

    if (contadorSenha) {

        contadorSenha.textContent =
            campoSenha.value.length + "/64";
    }
});


// ============================================================
// AUTORIA: Júlia Guarnieri
// Mostrar e ocultar senha
// ============================================================

if (botaoMostrarSenha) {

    botaoMostrarSenha.addEventListener("click", function () {

        if (campoSenha.type === "password") {

            campoSenha.type = "text";
            botaoMostrarSenha.textContent = "Ocultar senha";

        } else {

            campoSenha.type = "password";
            botaoMostrarSenha.textContent = "Mostrar senha";
        }
    });
}


// ============================================================
// AUTORIA: Júlia Guarnieri
// Indicador de força da senha
// ============================================================

campoSenha.addEventListener("input", function () {

    if (!forcaSenha) {
        return;
    }

    const senha = campoSenha.value;

    let pontos = 0;

    if (senha.length >= 8) {
        pontos++;
    }

    if (/[A-Z]/.test(senha)) {
        pontos++;
    }

    if (/[a-z]/.test(senha)) {
        pontos++;
    }

    if (/[0-9]/.test(senha)) {
        pontos++;
    }

    if (/[!@#$%^&*]/.test(senha)) {
        pontos++;
    }


    if (senha.length === 0) {

        forcaSenha.textContent = "Força da senha: -";

    } else if (pontos <= 2) {

        forcaSenha.textContent = "Força da senha: Fraca";

    } else if (pontos === 3) {

        forcaSenha.textContent = "Força da senha: Média";

    } else if (pontos === 4) {

        forcaSenha.textContent = "Força da senha: Forte";

    } else {

        forcaSenha.textContent = "Força da senha: Muito forte";
    }
});


// ============================================================
// AUTORIA: Pedro Henrique Sanches
// Função para limpar as mensagens de erro
// ============================================================

function limparErros() {

   
    campoSenha.setCustomValidity("");
    campoEmail.setCustomValidity("");

    
    campoSenha.classList.remove("invalido");
    campoEmail.classList.remove("invalido");
}
