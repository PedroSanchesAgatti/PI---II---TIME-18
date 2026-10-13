export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    perfil: "Administrador" | "Líder de Projeto" | "Membro da Equipe";
}

export interface Projeto {
    id: number;
    nome: string;
}

export interface Demanda {
    id: number;
    titulo: string;
    descricao: string;
    tipo: "Tarefa" | "Defeito" | "Melhoria" | "Documentação";
    prioridade: "Crítica" | "Alta" | "Média" | "Baixa";
    status: "Aberta" | "Em andamento" | "Em revisão" | "Concluída" | "Cancelada";
    projetoId: number;
    responsavelId: number | null;
    prazo: string | null;
    dataCriacao: string;
    dataAtualizacao: string;
}

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

export const demandas: Demanda[] = [
    {
        id: 1,
        titulo: "Corrigir erro no login",
        descricao: "Corrigir falha apresentada durante o login.",
        tipo: "Defeito",
        prioridade: "Crítica",
        status: "Aberta",
        projetoId: 1,
        responsavelId: 3,
        prazo: "2026-10-20",
        dataCriacao: "2026-10-10",
        dataAtualizacao: "2026-10-10"
    },
    {
        id: 2,
        titulo: "Criar documentação",
        descricao: "Documentar as rotas da API.",
        tipo: "Documentação",
        prioridade: "Média",
        status: "Em andamento",
        projetoId: 1,
        responsavelId: 2,
        prazo: "2026-10-25",
        dataCriacao: "2026-10-09",
        dataAtualizacao: "2026-10-12"
    },
    {
        id: 3,
        titulo: "Melhorar dashboard",
        descricao: "Adicionar novos indicadores.",
        tipo: "Melhoria",
        prioridade: "Alta",
        status: "Concluída",
        projetoId: 2,
        responsavelId: 3,
        prazo: "2026-10-15",
        dataCriacao: "2026-10-01",
        dataAtualizacao: "2026-10-11"
    }
];