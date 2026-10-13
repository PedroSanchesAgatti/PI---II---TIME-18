import { Router } from "express";
import { demandas, projetos, usuarios, Demanda } from "../dados";

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

    let resultado = [...demandas];

    // FILTROS

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

    // BUSCA

    if (busca) {
        const texto = String(busca).toLowerCase();

        resultado = resultado.filter(
            d =>
                d.titulo.toLowerCase().includes(texto) ||
                d.descricao.toLowerCase().includes(texto)
        );
    }

    // ORDENAÇÃO

    const camposPermitidos: (keyof Demanda)[] = [
        "prioridade",
        "dataCriacao",
        "prazo",
        "status"
    ];

    if (camposPermitidos.includes(ordenarPor as keyof Demanda)) {

        const campo = ordenarPor as keyof Demanda;

        resultado.sort((a, b) => {

            const valorA = String(a[campo] ?? "");
            const valorB = String(b[campo] ?? "");

            const comparacao = valorA.localeCompare(
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

    // CAMPOS OBRIGATÓRIOS

    if (!titulo || !descricao || !tipo || !prioridade || !projetoId) {
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

    // PROJETO

    const projetoExiste = projetos.some(
        p => p.id === Number(projetoId)
    );

    if (!projetoExiste) {
        return res.status(400).json({
            mensagem: "Projeto informado não existe."
        });
    }

    // RESPONSÁVEL É OPCIONAL

    if (responsavelId != null && responsavelId !== "") {

        const usuarioExiste = usuarios.some(
            u => u.id === Number(responsavelId)
        );

        if (!usuarioExiste) {
            return res.status(400).json({
                mensagem: "Responsável informado não existe."
            });
        }
    }

    // PRAZO

    if (
        prazo &&
        !/^\d{4}-\d{2}-\d{2}$/.test(String(prazo))
    ) {
        return res.status(400).json({
            mensagem: "Prazo deve estar no formato AAAA-MM-DD."
        });
    }

    const agora = new Date().toISOString();

    const novaDemanda = {
        id:
            demandas.length > 0
                ? Math.max(...demandas.map(d => d.id)) + 1
                : 1,

        titulo: String(titulo).trim(),
        descricao: String(descricao).trim(),

        tipo,
        prioridade,

        // O servidor define obrigatoriamente
        status: "Aberta" as const,

        projetoId: Number(projetoId),

        responsavelId:
            responsavelId
                ? Number(responsavelId)
                : null,

        prazo: prazo || null,

        dataCriacao: agora,
        dataAtualizacao: agora
    };

    demandas.push(novaDemanda);

    return res.status(201).json(novaDemanda);
});