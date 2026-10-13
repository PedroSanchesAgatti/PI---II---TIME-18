
/*
Autor: Julia Guarnieri
Rotas de detalhes das demandas e comentários.
*/

import { Router, Request, Response } from "express";
import { demandas, comentarios, usuarios } from "../data/dados-demanda.ts";

const router = Router();

// GET /demandas/:id
// Busca os detalhes de uma demanda específica.
router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const demanda = demandas.find((item) => item.id === id);

    if (!demanda) {
        return res.status(404).json({
            mensagem: "Demanda não encontrada."
        });
    }

    return res.status(200).json(demanda);
});

// GET /demandas/:id/comentarios
// Lista os comentários de uma demanda.
router.get("/:id/comentarios", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const demanda = demandas.find((item) => item.id === id);

    if (!demanda) {
        return res.status(404).json({
            mensagem: "Demanda não encontrada."
        });
    }

    const listaComentarios = comentarios
        .filter((item) => item.demandaId === id)
        .map((item) => {
            const usuario = usuarios.find(
                (user) => user.id === item.usuarioId
            );

            return {
                ...item,
                usuario: usuario?.nome
            };
        });

    return res.status(200).json(listaComentarios);
});

// POST /demandas/:id/comentarios
// Cadastra um comentário em uma demanda.
router.post("/:id/comentarios", (req: Request, res: Response) => {
    const demandaId = Number(req.params.id);
    const usuarioId = Number(req.body?.usuarioId);
    const texto = req.body?.texto;

    const demanda = demandas.find(
        (item) => item.id === demandaId
    );

    if (!demanda) {
        return res.status(404).json({
            mensagem: "Demanda não encontrada."
        });
    }

    if (
        !Number.isInteger(usuarioId) ||
        !usuarios.some((user) => user.id === usuarioId)
    ) {
        return res.status(400).json({
            mensagem: "Informe um usuário válido."
        });
    }

    if (typeof texto !== "string" || texto.trim() === "") {
        return res.status(400).json({
            mensagem: "O comentário não pode ficar vazio."
        });
    }

    const novoComentario = {
        id: comentarios.length > 0
            ? Math.max(...comentarios.map((item) => item.id)) + 1
            : 1,
        demandaId: demandaId,
        usuarioId: usuarioId,
        texto: texto.trim(),
        dataHora: new Date().toISOString()
    };

    comentarios.push(novoComentario);

    return res.status(201).json(novoComentario);
});

export default router;