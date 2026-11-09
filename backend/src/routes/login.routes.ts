/*
    Rotas de Login e Usuários
    Projeto Integrador II - Reunião 4
*/

import { Router } from "express";
import { usuarios } from "../data/dados";
import pool from "../config/database";
import { RowDataPacket } from "mysql2";

const router = Router();

router.post("/login", async (req, res) => {
    const email = typeof req.body.email === "string"
        ? req.body.email.trim()
        : "";
    const senha = typeof req.body.senha === "string"
        ? req.body.senha
        : "";
 
    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios."
        });
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT
                id_usuario,
                nome,
                email,
                senha,
                perfil
             FROM USUARIO
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        const usuario = rows[0];

        if (!usuario || usuario.senha !== senha) {
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            });
        }

        return res.status(200).json({
            usuario: {
                id: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });
    } catch (erro) {
        console.error("Erro ao consultar o banco de dados no login:", erro);

        return res.status(503).json({
            mensagem: "Não foi possível conectar ao banco de dados."
        });
    }
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
