import { Router } from "express";
import { autenticarUsuario, listarUsuarios } from "../data/usuarios";

const router = Router();

router.get("/usuarios", (_req, res) => {
    res.status(200).json(listarUsuarios());
});

router.post("/login", (req, res) => {
    const corpo: unknown = req.body;

    if (!corpo || typeof corpo !== "object") {
        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios."
        });
    }

    const dados = corpo as Record<string, unknown>;
    const email = dados.email;
    const senha = dados.senha;

    if (
        typeof email !== "string" ||
        typeof senha !== "string" ||
        email.trim().length === 0 ||
        senha.length === 0
    ) {
        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios."
        });
    }

    const usuario = autenticarUsuario(email, senha);

    if (!usuario) {
        return res.status(401).json({
            mensagem: "E-mail ou senha incorretos."
        });
    }

    return res.status(200).json({
        mensagem: "Login realizado com sucesso.",
        usuario
    });
});

export default router;
