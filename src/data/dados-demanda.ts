
/*
Autor: Julia Guarnieri
Dados de teste para demandas, usuários e comentários.
*/

// Usuários cadastrados para teste
export const usuarios = [
    { id: 1, nome: "Ana Silva" },
    { id: 2, nome: "Carlos Souza" },
    { id: 3, nome: "Maria Oliveira" }
];

// Demandas cadastradas para teste
export const demandas = [
    {
        id: 1,
        titulo: "Corrigir erro no login",
        descricao: "O sistema apresenta erro ao entrar.",
        tipo: "Defeito",
        prioridade: "Alta",
        status: "Aberta",
        projetoId: 1,
        responsavelId: 2,
        dataCriacao: "2026-10-10T10:00:00",
        prazoFinalizacao: "2026-10-20",
        ultimaAtualizacao: "2026-10-10T10:00:00"
    },
    {
        id: 2,
        titulo: "Criar tela de relatórios",
        descricao: "Desenvolver a tela de relatórios do sistema.",
        tipo: "Tarefa",
        prioridade: "Média",
        status: "Em andamento",
        projetoId: 2,
        responsavelId: 1,
        dataCriacao: "2026-10-11T14:00:00",
        prazoFinalizacao: "2026-10-25",
        ultimaAtualizacao: "2026-10-12T09:00:00"
    }
];

// Comentários vinculados às demandas
export const comentarios: {
    id: number;
    demandaId: number;
    usuarioId: number;
    texto: string;
    dataHora: string;
}[] = [
    {
        id: 1,
        demandaId: 1,
        usuarioId: 1,
        texto: "O erro foi identificado.",
        dataHora: "2026-10-11T10:30:00"
    }
];