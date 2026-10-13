/*
    Rotas de Login e Usuários
    Projeto Integrador II - Reunião 4
*/

import { Router } from "express";
import { usuarios } from "../data/dados";

const router = Router();

router.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios."
        });
    }

    const usuario = usuarios.find(
        (u) => u.email === email && u.senha === senha
    );

    if (!usuario) {
        return res.status(401).json({
            mensagem: "E-mail ou senha incorretos."
        });
    }

    return res.status(200).json({
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil
        }
    });
});

router.get("/usuarios", (req, res) => {
    const usuariosSemSenha = usuarios.map((usuario) => ({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
    }));

    return res.status(200).json(usuariosSemSenha);
});

export default router;