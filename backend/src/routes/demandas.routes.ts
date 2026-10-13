/*
    Projeto Integrador II - Engenharia de Software - 2026
    Reunião 4

    Arquivo: demandas.routes.ts

    Rotas:
    GET  /demandas
    POST /demandas
    GET  /demandas/:id
    GET  /demandas/:id/comentarios
    POST /demandas/:id/comentarios
*/

import { Router } from "express";

import {
    demandas,
    projetos,
    usuarios,
    comentarios,
    Demanda,
    Comentario
} from "../data/dados";

const router = Router();


router.get("/demandas", (req, res) => {

    const {
        status,
        prioridade,
        tipo,
        busca,
        ordenarPor = "dataCriacao",
        ordem = "desc"
    } = req.query;


    // Faz uma cópia para não alterar o array original
    let resultado = [...demandas];


    if (status) {

        resultado = resultado.filter(
            d => d.status === String(status)
        );
    }

    if (prioridade) {

        resultado = resultado.filter(
            d => d.prioridade === String(prioridade)
        );
    }

    if (tipo) {

        resultado = resultado.filter(
            d => d.tipo === String(tipo)
        );
    }

    if (busca) {

        const texto = String(busca)
            .trim()
            .toLowerCase();

        resultado = resultado.filter(
            d =>
                d.titulo.toLowerCase().includes(texto) ||
                d.descricao.toLowerCase().includes(texto)
        );
    }


    const camposPermitidos: (keyof Demanda)[] = [
        "prioridade",
        "dataCriacao",
        "prazo",
        "status"
    ];


    if (
        camposPermitidos.includes(
            ordenarPor as keyof Demanda
        )
    ) {

        const campo = ordenarPor as keyof Demanda;

        resultado.sort((a, b) => {

            const valorA =
                String(a[campo] ?? "");

            const valorB =
                String(b[campo] ?? "");

            const comparacao =
                valorA.localeCompare(
                    valorB,
                    "pt-BR"
                );

            return ordem === "asc"
                ? comparacao
                : -comparacao;
        });
    }

    const resposta = resultado.map(d => {

        const projeto = projetos.find(
            p => p.id === d.projetoId
        );

        const responsavel = usuarios.find(
            u => u.id === d.responsavelId
        );

        return {

            ...d,

            projeto: projeto
                ? {
                    id: projeto.id,
                    nome: projeto.nome
                }
                : null,

            responsavel: responsavel
                ? {
                    id: responsavel.id,
                    nome: responsavel.nome
                }
                : null
        };
    });

    return res.status(200).json({

        total: resposta.length,

        demandas: resposta
    });

});

router.post("/demandas", (req, res) => {

    const {
        titulo,
        descricao,
        tipo,
        prioridade,
        projetoId,
        responsavelId,
        prazo
    } = req.body;


    if (
        !titulo ||
        !descricao ||
        !tipo ||
        !prioridade ||
        !projetoId
    ) {

        return res.status(400).json({

            mensagem:
                "Título, descrição, tipo, prioridade e projeto são obrigatórios."

        });
    }

    if (
        String(titulo).trim() === "" ||
        String(descricao).trim() === ""
    ) {

        return res.status(400).json({

            mensagem:
                "Título e descrição não podem ficar vazios."

        });
    }

    const tiposPermitidos = [
        "Tarefa",
        "Defeito",
        "Melhoria",
        "Documentação"
    ];


    if (!tiposPermitidos.includes(tipo)) {

        return res.status(400).json({

            mensagem:
                "Tipo de demanda inválido."

        });
    }

    const prioridadesPermitidas = [
        "Crítica",
        "Alta",
        "Média",
        "Baixa"
    ];


    if (
        !prioridadesPermitidas.includes(
            prioridade
        )
    ) {

        return res.status(400).json({

            mensagem:
                "Prioridade inválida."

        });
    }

    const projetoExiste = projetos.some(
        p => p.id === Number(projetoId)
    );


    if (!projetoExiste) {

        return res.status(400).json({

            mensagem:
                "Projeto informado não existe."

        });
    }


    if (
        responsavelId != null &&
        responsavelId !== ""
    ) {

        const usuarioExiste = usuarios.some(
            u =>
                u.id ===
                Number(responsavelId)
        );


        if (!usuarioExiste) {

            return res.status(400).json({

                mensagem:
                    "Responsável informado não existe."

            });
        }
    }

    if (
        prazo &&
        !/^\d{4}-\d{2}-\d{2}$/.test(
            String(prazo)
        )
    ) {

        return res.status(400).json({

            mensagem:
                "Prazo deve estar no formato AAAA-MM-DD."

        });
    }

    const agora =
        new Date().toISOString();


    const novaDemanda: Demanda = {

        id:
            demandas.length > 0
                ? Math.max(
                    ...demandas.map(
                        d => d.id
                    )
                ) + 1
                : 1,

        titulo:
            String(titulo).trim(),

        descricao:
            String(descricao).trim(),

        tipo,

        prioridade,

        // Status sempre começa como Aberta
        status: "Aberta",

        projetoId:
            Number(projetoId),

        responsavelId:
            responsavelId
                ? Number(responsavelId)
                : null,

        prazo:
            prazo
                ? String(prazo)
                : null,

        dataCriacao: agora,

        dataAtualizacao: agora
    };


    // Adiciona aos dados em memória
    demandas.push(novaDemanda);


    // 201 = registro criado
    return res
        .status(201)
        .json(novaDemanda);

});


router.get("/demandas/:id", (req, res) => {

    const id =
        Number(req.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        return res.status(400).json({

            mensagem:
                "ID da demanda inválido."

        });
    }

    const demanda = demandas.find(
        d => d.id === id
    );


    if (!demanda) {

        return res.status(404).json({

            mensagem:
                "Demanda não encontrada."

        });
    }

    const projeto = projetos.find(
        p => p.id === demanda.projetoId
    );

    const responsavel = usuarios.find(
        u => u.id === demanda.responsavelId
    );

    return res.status(200).json({

        ...demanda,

        projeto: projeto
            ? {
                id: projeto.id,
                nome: projeto.nome
            }
            : null,

        responsavel: responsavel
            ? {
                id: responsavel.id,
                nome: responsavel.nome
            }
            : null
    });

});

router.get(
    "/demandas/:id/comentarios",
    (req, res) => {

        const demandaId =
            Number(req.params.id);


        if (
            !Number.isInteger(demandaId) ||
            demandaId <= 0
        ) {

            return res.status(400).json({

                mensagem:
                    "ID da demanda inválido."

            });
        }


        const demandaExiste =
            demandas.some(
                d => d.id === demandaId
            );


        if (!demandaExiste) {

            return res.status(404).json({

                mensagem:
                    "Demanda não encontrada."

            });
        }

        const comentariosDaDemanda =
            comentarios
                .filter(
                    c =>
                        c.demandaId ===
                        demandaId
                )
                .map(comentario => {

                    const usuario =
                        usuarios.find(
                            u =>
                                u.id ===
                                comentario.usuarioId
                        );


                    return {

                        ...comentario,

                        usuario: usuario
                            ? {
                                id: usuario.id,
                                nome: usuario.nome
                            }
                            : null
                    };
                });


        return res.status(200).json({

            total:
                comentariosDaDemanda.length,

            comentarios:
                comentariosDaDemanda

        });
    }
);


router.post(
    "/demandas/:id/comentarios",
    (req, res) => {

        const demandaId =
            Number(req.params.id);

        const {
            usuarioId,
            texto
        } = req.body;


        if (
            !Number.isInteger(demandaId) ||
            demandaId <= 0
        ) {

            return res.status(400).json({

                mensagem:
                    "ID da demanda inválido."

            });
        }

        const demandaExiste =
            demandas.some(
                d => d.id === demandaId
            );


        if (!demandaExiste) {

            return res.status(404).json({

                mensagem:
                    "Demanda não encontrada."

            });
        }


        if (!usuarioId) {

            return res.status(400).json({

                mensagem:
                    "O usuário é obrigatório para registrar um comentário."

            });
        }

        const usuarioExiste =
            usuarios.some(
                u =>
                    u.id ===
                    Number(usuarioId)
            );


        if (!usuarioExiste) {

            return res.status(400).json({

                mensagem:
                    "Usuário informado não existe."

            });
        }

        if (
            !texto ||
            String(texto).trim() === ""
        ) {

            return res.status(400).json({

                mensagem:
                    "O comentário não pode estar vazio."

            });
        }

        const novoComentario: Comentario = {

            id:
                comentarios.length > 0
                    ? Math.max(
                        ...comentarios.map(
                            c => c.id
                        )
                    ) + 1
                    : 1,

            demandaId,

            usuarioId:
                Number(usuarioId),

            texto:
                String(texto).trim(),

            dataHora:
                new Date().toISOString()
        };

        comentarios.push(
            novoComentario
        );


        return res
            .status(201)
            .json(novoComentario);
    }
);
router.put("/demandas/:id", (req, res) => {

    const id = Number(req.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        return res.status(400).json({
            mensagem: "ID da demanda inválido."
        });
    }


    const indice = demandas.findIndex(
        d => d.id === id
    );


    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Demanda não encontrada."
        });
    }


    const {
        titulo,
        descricao,
        tipo,
        prioridade,
        projetoId,
        responsavelId,
        prazo
    } = req.body;


    if (
        !titulo ||
        !descricao ||
        !tipo ||
        !prioridade ||
        !projetoId
    ) {
        return res.status(400).json({
            mensagem:
                "Título, descrição, tipo, prioridade e projeto são obrigatórios."
        });
    }


    const tiposPermitidos = [
        "Tarefa",
        "Defeito",
        "Melhoria",
        "Documentação"
    ];


    if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
            mensagem: "Tipo de demanda inválido."
        });
    }


    const prioridadesPermitidas = [
        "Crítica",
        "Alta",
        "Média",
        "Baixa"
    ];


    if (!prioridadesPermitidas.includes(prioridade)) {
        return res.status(400).json({
            mensagem: "Prioridade inválida."
        });
    }


    const projetoExiste = projetos.some(
        p => p.id === Number(projetoId)
    );


    if (!projetoExiste) {
        return res.status(400).json({
            mensagem: "Projeto informado não existe."
        });
    }


    if (
        responsavelId != null &&
        responsavelId !== ""
    ) {

        const usuarioExiste = usuarios.some(
            u => u.id === Number(responsavelId)
        );


        if (!usuarioExiste) {
            return res.status(400).json({
                mensagem: "Responsável informado não existe."
            });
        }
    }


    if (
        prazo &&
        !/^\d{4}-\d{2}-\d{2}$/.test(
            String(prazo)
        )
    ) {
        return res.status(400).json({
            mensagem: "Prazo deve estar no formato AAAA-MM-DD."
        });
    }


    const demandaAtual = demandas[indice];


    const demandaAtualizada: Demanda = {

        ...demandaAtual,

        titulo: String(titulo).trim(),

        descricao: String(descricao).trim(),

        tipo,

        prioridade,

        projetoId: Number(projetoId),

        responsavelId:
            responsavelId
                ? Number(responsavelId)
                : null,

        prazo:
            prazo
                ? String(prazo)
                : null,

        dataAtualizacao:
            new Date().toISOString()
    };


    demandas[indice] = demandaAtualizada;


    return res.status(200).json({
        mensagem: "Demanda atualizada com sucesso.",
        demanda: demandaAtualizada
    });

});

export default router;