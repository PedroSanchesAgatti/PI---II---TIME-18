//  Autor: Larissa Quito
import { Router } from "express";
import {
    demandas,
    Demanda,
    PRIORIDADES,
    STATUS,
    TIPOS
} from "../data/demandas";
import { projetos } from "../data/projetos";
import { listarUsuarios } from "../data/usuarios";

const router = Router();

const CAMPOS_ORDENACAO = ["prioridade", "dataCriacao", "prazo", "status"] as const;
type CampoOrdenacao = (typeof CAMPOS_ORDENACAO)[number];

function normalizar(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


function lerTexto(valor: unknown): string | undefined | null {
    if (valor === undefined) return undefined;
    if (typeof valor !== "string") return null; 
    const limpo = valor.trim();
    return limpo === "" ? undefined : limpo;
}

function lerInteiro(valor: unknown): number | undefined | null {
    const texto = lerTexto(valor);
    if (texto === undefined || texto === null) return texto;
    return /^\d+$/.test(texto) ? Number(texto) : null;
}

function valorPermitido<T extends string>(
    lista: readonly T[],
    entrada: string
): T | undefined {
    return lista.find((item) => normalizar(item) === normalizar(entrada));
}

router.get("/demandas", (req, res) => {
    const erros: string[] = [];
    const q = req.query;


    let status: string | undefined;
    const statusBruto = lerTexto(q.status);
    if (statusBruto === null) erros.push("Parâmetro 'status' inválido.");
    else if (statusBruto !== undefined) {
        status = valorPermitido(STATUS, statusBruto);
        if (!status) erros.push(`Status inválido. Valores aceitos: ${STATUS.join(", ")}.`);
    }

    let prioridade: string | undefined;
    const prioridadeBruta = lerTexto(q.prioridade);
    if (prioridadeBruta === null) erros.push("Parâmetro 'prioridade' inválido.");
    else if (prioridadeBruta !== undefined) {
        prioridade = valorPermitido(PRIORIDADES, prioridadeBruta);
        if (!prioridade) erros.push(`Prioridade inválida. Valores aceitos: ${PRIORIDADES.join(", ")}.`);
    }

    let tipo: string | undefined;
    const tipoBruto = lerTexto(q.tipo);
    if (tipoBruto === null) erros.push("Parâmetro 'tipo' inválido.");
    else if (tipoBruto !== undefined) {
        tipo = valorPermitido(TIPOS, tipoBruto);
        if (!tipo) erros.push(`Tipo inválido. Valores aceitos: ${TIPOS.join(", ")}.`);
    }

    const responsavelId = lerInteiro(q.responsavel);
    if (responsavelId === null) erros.push("O parâmetro 'responsavel' deve ser o ID numérico do usuário.");

    const projetoId = lerInteiro(q.projeto);
    if (projetoId === null) erros.push("O parâmetro 'projeto' deve ser o ID numérico do projeto.");

    
    const busca = lerTexto(q.busca);
    if (busca === null) erros.push("Parâmetro 'busca' inválido.");
    else if (busca !== undefined && busca.length < 3) {
        erros.push("A busca deve ter ao menos 3 caracteres.");
    }

    
    let campoOrdenacao: CampoOrdenacao = "dataCriacao";
    const ordenarPorBruto = lerTexto(q.ordenarPor);
    if (ordenarPorBruto === null) erros.push("Parâmetro 'ordenarPor' inválido.");
    else if (ordenarPorBruto !== undefined) {
        const campo = CAMPOS_ORDENACAO.find(
            (c) => normalizar(c) === normalizar(ordenarPorBruto)
        );
        if (!campo) erros.push(`Campo de ordenação inválido. Valores aceitos: ${CAMPOS_ORDENACAO.join(", ")}.`);
        else campoOrdenacao = campo;
    }

    let ordem: "asc" | "desc" = "desc";
    const ordemBruta = lerTexto(q.ordem);
    if (ordemBruta === null) erros.push("Parâmetro 'ordem' inválido.");
    else if (ordemBruta !== undefined) {
        const o = normalizar(ordemBruta);
        if (o !== "asc" && o !== "desc") erros.push("Ordem inválida. Use 'asc' ou 'desc'.");
        else ordem = o;
    }

    if (erros.length > 0) {
        return res.status(400).json({ mensagem: "Parâmetros inválidos.", erros });
    }

    
    const buscaNormalizada = busca ? normalizar(busca) : undefined;

    let resultado = demandas.filter((d) => {
        if (status && d.status !== status) return false;
        if (prioridade && d.prioridade !== prioridade) return false;
        if (tipo && d.tipo !== tipo) return false;
        if (responsavelId !== undefined && d.responsavelId !== responsavelId) return false;
        if (projetoId !== undefined && d.projetoId !== projetoId) return false;
        if (
            buscaNormalizada &&
            !normalizar(d.titulo).includes(buscaNormalizada) &&
            !normalizar(d.descricao).includes(buscaNormalizada)
        ) {
            return false;
        }
        return true;
    });

    
    const pesoPrioridade = (d: Demanda) => PRIORIDADES.indexOf(d.prioridade); 
    const pesoStatus = (d: Demanda) => STATUS.indexOf(d.status);
    const fator = ordem === "asc" ? 1 : -1;

    resultado = [...resultado].sort((a, b) => {
        switch (campoOrdenacao) {
            case "prioridade":
                
                return (pesoPrioridade(a) - pesoPrioridade(b)) * fator;
            case "status":
                return (pesoStatus(a) - pesoStatus(b)) * fator;
            case "prazo":
                
                if (a.prazo === b.prazo) return 0;
                if (a.prazo === null) return 1;
                if (b.prazo === null) return -1;
                return a.prazo.localeCompare(b.prazo) * fator;
            default:
                return a.dataCriacao.localeCompare(b.dataCriacao) * fator;
        }
    });

    
    const usuarios = listarUsuarios();

    const lista = resultado.map((d) => {
        const projeto = projetos.find((p) => p.id === d.projetoId);
        const responsavel = usuarios.find((u) => u.id === d.responsavelId);

        return {
            id: d.id,
            titulo: d.titulo,
            tipo: d.tipo,
            prioridade: d.prioridade,
            status: d.status,
            projeto: projeto ? { id: projeto.id, nome: projeto.nome } : null,
            responsavel: responsavel ? { id: responsavel.id, nome: responsavel.nome } : null,
            dataCriacao: d.dataCriacao,
            prazo: d.prazo
        };
    });

    return res.status(200).json({ total: lista.length, demandas: lista });
});

export default router;