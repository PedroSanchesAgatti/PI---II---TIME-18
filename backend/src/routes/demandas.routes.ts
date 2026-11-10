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
        status,
        projetoId,
        responsavelId,
        prazo
    } = req.body;


    if (
        !titulo ||
        !descricao ||
        !tipo ||
        !prioridade ||
        !projetoId ||
        !status
    ) {
        return res.status(400).json({
            mensagem:
                "Título, descrição, tipo, prioridade, status e projeto são obrigatórios."
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


const statusPermitidos = [
    "Aberta",
    "Em andamento",
    "Em revisão",
    "Concluída",
    "Cancelada"
];


    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({
            mensagem: "Status da demanda inválido."
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

        status,

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



/*
    Rota de Exclusão de Demandas
    Projeto Integrador II - Engenharia de Software - 2026

    Autora: Júlia Andrade Guarnieri
    Rota: DELETE /demandas/:id

    Descrição:
    Exclui uma demanda pelo ID informado.
*/

router.delete("/demandas/:id", (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
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

    demandas.splice(indice, 1);

    return res.status(200).json({
        mensagem: "Demanda excluída com sucesso."
    });


    /*Gabriel Castro*/
    import { Router, Request, Response } from 'express';
import oracledb from 'oracledb';

// Integrar ao middleware de autenticação existente: ele deve definir req.usuario.id.
type UsuarioRequest = Request & { usuario?: { id: number; perfil: string } };
const router = Router();
const erro = (res: Response, status: number, mensagem: string) => res.status(status).json({ erro: mensagem });
const idValido = (id: string) => /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;

router.use((req: UsuarioRequest, res, next) => {
  if (!req.usuario?.id) { erro(res, 401, 'Faça login para acessar os detalhes.'); return; }
  next();
});

router.get('/:id', async (req, res) => {
  if (!idValido(req.params.id as string)) { erro(res, 400, 'ID inválido.'); return; }
  try {
    const r = await oracledb.getConnection();
    try {
      const resultado = await r.execute(`SELECT d.id, d.titulo, d.descricao, d.tipo, d.prioridade, d.status,
        d.prazo_finalizacao, d.data_criacao, d.data_atualizacao,
        p.nome AS projeto_nome, u.nome AS responsavel_nome
        FROM demandas d JOIN projetos p ON p.id = d.projeto_id
        LEFT JOIN usuarios u ON u.id = d.responsavel_id WHERE d.id = :id`, { id: Number(req.params.id) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      if (!resultado.rows?.length) { erro(res, 404, 'Demanda não encontrada.'); return; }
      res.json(resultado.rows[0]);
    } finally { await r.close(); }
  } catch { erro(res, 500, 'Erro ao consultar demanda.'); }
});

router.get('/:id/comentarios', async (req, res) => {
  if (!idValido(req.params.id as string)) { erro(res, 400, 'ID inválido.'); return; }
  try {
    const c = await oracledb.getConnection();
    try {
      const existe = await c.execute('SELECT id FROM demandas WHERE id = :id', { id: Number(req.params.id) });
      if (!existe.rows?.length) { erro(res, 404, 'Demanda não encontrada.'); return; }
      const r = await c.execute(`SELECT c.id, c.texto, c.data_criacao, u.nome AS usuario_nome
        FROM comentarios c JOIN usuarios u ON u.id = c.usuario_id
        WHERE c.demanda_id = :id ORDER BY c.data_criacao ASC`, { id: Number(req.params.id) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      res.json(r.rows);
    } finally { await c.close(); }
  } catch { erro(res, 500, 'Erro ao consultar comentários.'); }
});

router.post('/:id/comentarios', async (req: UsuarioRequest, res) => {
  if (!idValido(req.params.id as string)) { erro(res, 400, 'ID inválido.'); return; }
  const texto = req.body?.texto;
  if (typeof texto !== 'string' || !texto.trim() || texto.trim().length > 2000) {
    erro(res, 400, 'O comentário deve conter entre 1 e 2000 caracteres.'); return;
  }
  try {
    const c = await oracledb.getConnection();
    try {
      const existe = await c.execute('SELECT id FROM demandas WHERE id = :id', { id: Number(req.params.id) });
      if (!existe.rows?.length) { erro(res, 404, 'Demanda não encontrada.'); return; }
      const r = await c.execute(`INSERT INTO comentarios (demanda_id, usuario_id, texto, data_criacao)
        VALUES (:demanda, :usuario, :texto, SYSTIMESTAMP) RETURNING id INTO :id`, {
        demanda: Number(req.params.id), usuario: req.usuario!.id, texto: texto.trim(),
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }, { autoCommit: true });
      res.status(201).json({ mensagem: 'Comentário registrado.', id: (r.outBinds as any)?.id?.[0] });
    } finally { await c.close(); }
  } catch { erro(res, 500, 'Erro ao registrar comentário.'); }
});

router.get('/:id/historico', async (req, res) => {
  if (!idValido(req.params.id as string)) { erro(res, 400, 'ID inválido.'); return; }
  try {
    const c = await oracledb.getConnection();
    try {
      const existe = await c.execute('SELECT id FROM demandas WHERE id = :id', { id: Number(req.params.id) });
      if (!existe.rows?.length) { erro(res, 404, 'Demanda não encontrada.'); return; }
      const r = await c.execute(`SELECT h.campo, h.valor_anterior, h.valor_novo, h.data_alteracao,
        u.nome AS usuario_nome FROM historico_demandas h JOIN usuarios u ON u.id = h.usuario_id
        WHERE h.demanda_id = :id ORDER BY h.data_alteracao DESC`, { id: Number(req.params.id) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      res.json(r.rows);
    } finally { await c.close(); }
  } catch { erro(res, 500, 'Erro ao consultar histórico.'); }
});
export default router;


});

export default router;
