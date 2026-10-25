/*
    Arquivo: auth.js
    Responsável: Pedro Henrique Sanches
*/

function obterUsuarioAutenticado() {
    const usuarioSalvo = sessionStorage.getItem(
        "usuarioAutenticado"
    );

    if (!usuarioSalvo) {
        window.location.href = "login.html";
        return null;
    }

    try {
        return JSON.parse(usuarioSalvo);
    } catch (erro) {
        sessionStorage.removeItem(
            "usuarioAutenticado"
        );

        window.location.href = "login.html";
        return null;
    }
}

function obterToken() {
    return sessionStorage.getItem("token");
}

function sairDoSistema() {
    sessionStorage.removeItem(
        "usuarioAutenticado"
    );

    sessionStorage.removeItem("token");

    window.location.href = "login.html";
}
