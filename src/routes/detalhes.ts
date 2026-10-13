
import { Router, Request, Response } from "express";
import { demandas, usuarios, comentarios } from "../demandas2";

const router = Router();

router.get("/demandas/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const demanda = demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({
            mensagem: "Demanda não encontrada."
        });
    }

    return res.status(200).json(demanda);
});

router.get("/demandas/:id/comentarios", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const demanda = demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({
            mensagem: "Demanda não encontrada."
        });
    }

    const listaComentarios = comentarios.filter(
        (c) => c.demandaId === id
    );

    return res.status(200).json(listaComentarios);
});

router.post("/demandas/:id/comentarios", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const demanda = demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({
            mensagem: "Demanda não encontrada."
        });
    }

    const { usuarioId, comentario } = req.body as {
        usuarioId?: number;
        comentario?: string;
    };

    if (
        typeof comentario !== "string" ||
        comentario.trim() === ""
    ) {
        return res.status(400).json({
            mensagem: "O comentário não pode estar vazio."
        });
    }

    const usuario = usuarios.find((u) => u.id === Number(usuarioId));

    if (!usuario) {
        return res.status(400).json({
            mensagem: "Usuário não encontrado."
        });
    }

    const novoComentario = {
        id: comentarios.length > 0
            ? Math.max(...comentarios.map((c) => c.id)) + 1
            : 1,
        demandaId: id,
        usuarioId: usuario.id,
        comentario: comentario.trim(),
        dataCriacao: new Date().toISOString()
    };

    comentarios.push(novoComentario);

    return res.status(201).json(novoComentario);
});

export default router;
