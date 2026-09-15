
// ============================================================
// AUTORIA: Pedro Henrique Sanches
// Estrutura inicial do formulário e validações básicas
// ============================================================

console.log("JS carregado!");

const formulario = document.querySelector("#login-form");
const campoUsuario = document.querySelector("#user");
const campoSenha = document.querySelector("#password");


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

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    limparErros();

    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value;
    const email = campoEmail.value.trim();

    let valido = true;


    // ========================================================
    // AUTORIA: Pedro Henrique Sanches
    // Validação básica do usuário
    // ========================================================

    if (usuario.length === 0) {

        campoUsuario.setCustomValidity("Informe o usuário.");
        campoUsuario.classList.add("invalido");
        valido = false;

    } else if (usuario.length < 3) {

        campoUsuario.setCustomValidity(
            "O usuário deve ter ao menos 3 caracteres."
        );

        campoUsuario.classList.add("invalido");
        valido = false;

    } else if (usuario.length > 30) {

        campoUsuario.setCustomValidity(
            "O usuário deve ter no máximo 30 caracteres."
        );

        campoUsuario.classList.add("invalido");
        valido = false;

    } else if (!/^[A-Za-zÀ-ÿ0-9._-]+$/.test(usuario)) {

        campoUsuario.setCustomValidity(
            "O usuário contém caracteres inválidos."
        );

        campoUsuario.classList.add("invalido");
        valido = false;
    }


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

    } else if (senha.length < 8) {

        campoSenha.setCustomValidity(
            "A senha deve ter ao menos 8 caracteres."
        );

        campoSenha.classList.add("invalido");
        valido = false;

    } else if (senha.length > 64) {

        campoSenha.setCustomValidity(
            "A senha deve ter no máximo 64 caracteres."
        );

        campoSenha.classList.add("invalido");
        valido = false;


    // ========================================================
    // AUTORIA: Júlia Guarnieri
    // Novas regras de segurança para a senha
    // ========================================================

    } else if (!/[A-Z]/.test(senha)) {

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

        if (!campoUsuario.checkValidity()) {

            campoUsuario.reportValidity();

        } else if (!campoEmail.checkValidity()) {

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

    console.log("Login válido!");
    window.location.href = "dashboard.html";
});


// ============================================================
// AUTORIA: Pedro Henrique Sanches
// Limpeza dos erros enquanto o usuário digita
// ============================================================

campoUsuario.addEventListener("input", function () {

    campoUsuario.setCustomValidity("");
    campoUsuario.classList.remove("invalido");
});

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

    campoUsuario.setCustomValidity("");
    campoSenha.setCustomValidity("");
    campoEmail.setCustomValidity("");

    campoUsuario.classList.remove("invalido");
    campoSenha.classList.remove("invalido");
    campoEmail.classList.remove("invalido");
}
