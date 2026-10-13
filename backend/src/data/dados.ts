/*
    Projeto Integrador II - Engenharia de Software - 2026
    Reunião 4

    Arquivo: dados.ts

    Dados temporários armazenados em memória.
*/


// ============================================================
// USUÁRIO
// ============================================================

export interface Usuario {

    id: number;

    nome: string;

    email: string;

    senha: string;

    perfil:
        | "Administrador"
        | "Líder de Projeto"
        | "Membro da Equipe";
}


// ============================================================
// PROJETO
// ============================================================

export interface Projeto {

    id: number;

    nome: string;
}


// ============================================================
// DEMANDA
// ============================================================

export interface Demanda {

    id: number;

    titulo: string;

    descricao: string;

    tipo:
        | "Tarefa"
        | "Defeito"
        | "Melhoria"
        | "Documentação";

    prioridade:
        | "Crítica"
        | "Alta"
        | "Média"
        | "Baixa";

    status:
        | "Aberta"
        | "Em andamento"
        | "Em revisão"
        | "Concluída"
        | "Cancelada";

    projetoId: number;

    responsavelId:
        number | null;

    prazo:
        string | null;

    dataCriacao: string;

    dataAtualizacao: string;
}


// ============================================================
// COMENTÁRIO
// ============================================================

export interface Comentario {

    id: number;

    demandaId: number;

    usuarioId: number;

    texto: string;

    dataHora: string;
}


// ============================================================
// USUÁRIOS DE TESTE
// ============================================================

export const usuarios: Usuario[] = [

    {
        id: 1,
        nome: "Administrador",
        email: "admin@sistema.com",
        senha: "Admin123!",
        perfil: "Administrador"
    },

    {
        id: 2,
        nome: "João",
        email: "joao@sistema.com",
        senha: "Joao123!",
        perfil: "Líder de Projeto"
    },

    {
        id: 3,
        nome: "Maria",
        email: "maria@sistema.com",
        senha: "Maria123!",
        perfil: "Membro da Equipe"
    }

];


// ============================================================
// PROJETOS DE TESTE
// ============================================================

export const projetos: Projeto[] = [

    {
        id: 1,
        nome: "Sistema de Demandas"
    },

    {
        id: 2,
        nome: "Portal Acadêmico"
    }

];


// ============================================================
// DEMANDAS DE TESTE
// ============================================================

export const demandas: Demanda[] = [

    {
        id: 1,

        titulo:
            "Corrigir erro no login",

        descricao:
            "Corrigir falha apresentada durante o login.",

        tipo:
            "Defeito",

        prioridade:
            "Crítica",

        status:
            "Aberta",

        projetoId:
            1,

        responsavelId:
            3,

        prazo:
            "2026-10-20",

        dataCriacao:
            "2026-10-10",

        dataAtualizacao:
            "2026-10-10"
    },


    {
        id: 2,

        titulo:
            "Criar documentação",

        descricao:
            "Documentar as rotas da API.",

        tipo:
            "Documentação",

        prioridade:
            "Média",

        status:
            "Em andamento",

        projetoId:
            1,

        responsavelId:
            2,

        prazo:
            "2026-10-25",

        dataCriacao:
            "2026-10-09",

        dataAtualizacao:
            "2026-10-12"
    },


    {
        id: 3,

        titulo:
            "Melhorar dashboard",

        descricao:
            "Adicionar novos indicadores ao dashboard.",

        tipo:
            "Melhoria",

        prioridade:
            "Alta",

        status:
            "Concluída",

        projetoId:
            2,

        responsavelId:
            3,

        prazo:
            "2026-10-15",

        dataCriacao:
            "2026-10-01",

        dataAtualizacao:
            "2026-10-11"
    },


    {
        id: 4,

        titulo:
            "Criar testes da API",

        descricao:
            "Realizar testes das rotas GET e POST.",

        tipo:
            "Tarefa",

        prioridade:
            "Baixa",

        status:
            "Em revisão",

        projetoId:
            1,

        responsavelId:
            null,

        prazo:
            "2026-10-30",

        dataCriacao:
            "2026-10-12",

        dataAtualizacao:
            "2026-10-12"
    }

];


// ============================================================
// COMENTÁRIOS DE TESTE
// ============================================================

export const comentarios: Comentario[] = [

    {
        id: 1,

        demandaId: 1,

        usuarioId: 2,

        texto:
            "Estou verificando o problema apresentado no login.",

        dataHora:
            "2026-10-11T10:00:00.000Z"
    },


    {
        id: 2,

        demandaId: 1,

        usuarioId: 3,

        texto:
            "O erro também ocorreu durante os testes.",

        dataHora:
            "2026-10-11T14:30:00.000Z"
    },


    {
        id: 3,

        demandaId: 2,

        usuarioId: 1,

        texto:
            "Adicionar exemplos das requisições na documentação.",

        dataHora:
            "2026-10-12T09:00:00.000Z"
    }

];