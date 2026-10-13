/*
    Rota do Dashboard
    Projeto Integrador II - Reunião 4
*/

import { Router } from "express";
import { demandas } from "../dados";

const router = Router();

router.get("/dashboard", (req, res) => {

    const porStatus = {
        aberta: demandas.filter(d => d.status === "Aberta").length,
        andamento: demandas.filter(d => d.status === "Em andamento").length,
        revisao: demandas.filter(d => d.status === "Em revisão").length,
        concluida: demandas.filter(d => d.status === "Concluída").length,
        cancelada: demandas.filter(d => d.status === "Cancelada").length
    };

    const porPrioridade = {
        critica: demandas.filter(d => d.prioridade === "Crítica").length,
        alta: demandas.filter(d => d.prioridade === "Alta").length,
        media: demandas.filter(d => d.prioridade === "Média").length,
        baixa: demandas.filter(d => d.prioridade === "Baixa").length
    };

    const porTipo = {
        tarefa: demandas.filter(d => d.tipo === "Tarefa").length,
        defeito: demandas.filter(d => d.tipo === "Defeito").length,
        melhoria: demandas.filter(d => d.tipo === "Melhoria").length,
        documentacao: demandas.filter(d => d.tipo === "Documentação").length
    };

    const criticasEmAberto = demandas.filter(
        d =>
            d.prioridade === "Crítica" &&
            !["Concluída", "Cancelada"].includes(d.status)
    );

    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + 7);

    const proximasDoPrazo = demandas.filter(d => {
        if (!d.prazo) return false;

        const prazo = new Date(`${d.prazo}T23:59:59`);

        return prazo >= hoje && prazo <= limite;
    });

    return res.status(200).json({
        total: demandas.length,
        porStatus,
        porPrioridade,
        porTipo,
        criticasEmAberto,
        proximasDoPrazo
    });
});

export default router;