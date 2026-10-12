
// Autor: Hyan Victor Sedia
// Arquivo: dashboard.ts
// Projeto Integrador II - Engenharia de Software - 2026

import { Router } from "express";
import {
    demandas,
    Demanda,
    PRIORIDADES,
    STATUS,
    TIPOS
} from "../data/demandas";

const router = Router();

// Critério: demandas em aberto são aquelas que não foram
// concluídas nem canceladas.
const STATUS_EM_ABERTO = [
    "Aberta",
    "Em andamento",
    "Em revisão"
];

// Critério: prazo entre hoje e os próximos 3 dias, inclusive.
const DIAS_ATE_PRAZO = 3;

// Converte uma data para hoje, sem considerar o horário.
function obterInicioDoDia(data: Date): Date {
    return new Date(
        data.getFullYear(),
        data.getMonth(),
        data.getDate()
    );
}

// Verifica se o prazo está entre hoje e os próximos 3 dias.
function prazoProximo(
    prazo: string | null,
    hoje: Date,
    limite: Date
): boolean {
    if (!prazo) {
        return false;
    }

    const partes = prazo.split("-").map(Number);

    if (partes.length !== 3 || partes.some(Number.isNaN)) {
        return false;
    }

    const [ano, mes, dia] = partes;
    const dataPrazo = new Date(ano, mes - 1, dia);

    // Confere se a data realmente existe.
    if (
        dataPrazo.getFullYear() !== ano ||
        dataPrazo.getMonth() !== mes - 1 ||
        dataPrazo.getDate() !== dia
    ) {
        return false;
    }

    return dataPrazo >= hoje && dataPrazo <= limite;
}

// Conta quantas demandas existem em cada categoria.
function contarPor<T extends string>(
    categorias: readonly T[],
    obterCategoria: (demanda: Demanda) => T
): Record<T, number> {
    const resultado = {} as Record<T, number>;

    for (const categoria of categorias) {
        resultado[categoria] = demandas.filter(
            (demanda) => obterCategoria(demanda) === categoria
        ).length;
    }

    return resultado;
}

// GET /dashboard
router.get("/dashboard", (_req, res) => {
    // Demandas que ainda estão em andamento.
    const demandasEmAberto = demandas.filter(
        (demanda) => STATUS_EM_ABERTO.includes(demanda.status)
    );

    const hoje = obterInicioDoDia(new Date());

    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + DIAS_ATE_PRAZO);

    // Demandas críticas que ainda estão em aberto.
    const demandasCriticasEmAberto = demandasEmAberto.filter(
        (demanda) => demanda.prioridade === "Crítica"
    );

    // Demandas abertas com prazo próximo.
    const demandasProximasDoPrazo = demandasEmAberto.filter(
        (demanda) => prazoProximo(demanda.prazo, hoje, limite)
    );

    return res.status(200).json({
        totalDemandas: demandas.length,

        porStatus: contarPor(
            STATUS,
            (demanda) => demanda.status
        ),

        porPrioridade: contarPor(
            PRIORIDADES,
            (demanda) => demanda.prioridade
        ),

        porTipo: contarPor(
            TIPOS,
            (demanda) => demanda.tipo
        ),

        demandasCriticasEmAberto,

        demandasProximasDoPrazo,

        criterios: {
            emAberto:
                "Demandas com status Aberta, Em andamento ou Em revisão.",

            proximasDoPrazo:
                "Demandas em aberto com prazo entre hoje e os próximos 3 dias, inclusive. Demandas sem prazo ou com prazo vencido não são incluídas."
        }
    });
});

export default router;

