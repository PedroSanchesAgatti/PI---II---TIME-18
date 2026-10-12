//  Autor: Larissa Quito
export const TIPOS = ["Tarefa", "Defeito", "Melhoria", "Documentação"] as const;
export const PRIORIDADES = ["Crítica", "Alta", "Média", "Baixa"] as const;
export const STATUS = [
    "Aberta",
    "Em andamento",
    "Em revisão",
    "Concluída",
    "Cancelada"
] as const;

export type TipoDemanda = (typeof TIPOS)[number];
export type PrioridadeDemanda = (typeof PRIORIDADES)[number];
export type StatusDemanda = (typeof STATUS)[number];

export interface Demanda {
    id: number;
    titulo: string;
    descricao: string;
    tipo: TipoDemanda;
    prioridade: PrioridadeDemanda;
    status: StatusDemanda;
    projetoId: number;
    responsavelId: number | null;
    dataCriacao: string; // ISO: AAAA-MM-DD
    dataAtualizacao: string;
    prazo: string | null; // ISO: AAAA-MM-DD
}

export const demandas: Demanda[] = [
    { id: 1, titulo: "Corrigir login", descricao: "Erro ao autenticar com senha válida.", tipo: "Defeito", prioridade: "Alta", status: "Aberta", projetoId: 1, responsavelId: 2, dataCriacao: "2026-02-10", dataAtualizacao: "2026-02-10", prazo: "2026-02-20" },
    { id: 2, titulo: "Implementar dashboard", descricao: "Criar cards de resumo por status.", tipo: "Tarefa", prioridade: "Média", status: "Em andamento", projetoId: 2, responsavelId: 3, dataCriacao: "2026-02-05", dataAtualizacao: "2026-02-12", prazo: "2026-02-18" },
    { id: 3, titulo: "Falha crítica no cadastro", descricao: "Sistema trava ao salvar demanda sem responsável.", tipo: "Defeito", prioridade: "Crítica", status: "Aberta", projetoId: 1, responsavelId: 1, dataCriacao: "2026-02-11", dataAtualizacao: "2026-02-11", prazo: "2026-02-14" },
    { id: 4, titulo: "Documentar API de login", descricao: "Descrever rotas POST /login e GET /usuarios.", tipo: "Documentação", prioridade: "Baixa", status: "Em revisão", projetoId: 3, responsavelId: 2, dataCriacao: "2026-01-28", dataAtualizacao: "2026-02-09", prazo: "2026-03-01" },
    { id: 5, titulo: "Melhorar filtros da listagem", descricao: "Adicionar filtro por tipo e responsável.", tipo: "Melhoria", prioridade: "Média", status: "Aberta", projetoId: 2, responsavelId: null, dataCriacao: "2026-02-08", dataAtualizacao: "2026-02-08", prazo: null },
    { id: 6, titulo: "Revisar layout do dashboard", descricao: "Ajustar cores e espaçamento dos cards.", tipo: "Melhoria", prioridade: "Baixa", status: "Concluída", projetoId: 2, responsavelId: 3, dataCriacao: "2026-01-15", dataAtualizacao: "2026-02-01", prazo: "2026-02-01" },
    { id: 7, titulo: "Integrar com banco de dados", descricao: "Substituir dados em memória por banco.", tipo: "Tarefa", prioridade: "Alta", status: "Cancelada", projetoId: 3, responsavelId: 1, dataCriacao: "2026-01-20", dataAtualizacao: "2026-02-03", prazo: "2026-03-15" },
    { id: 8, titulo: "Erro de acentuação nos comentários", descricao: "Caracteres especiais aparecem quebrados.", tipo: "Defeito", prioridade: "Média", status: "Em andamento", projetoId: 1, responsavelId: 3, dataCriacao: "2026-02-09", dataAtualizacao: "2026-02-13", prazo: "2026-02-25" },
    { id: 9, titulo: "Manual do usuário", descricao: "Escrever guia de uso das telas.", tipo: "Documentação", prioridade: "Baixa", status: "Aberta", projetoId: 3, responsavelId: 2, dataCriacao: "2026-02-12", dataAtualizacao: "2026-02-12", prazo: "2026-04-10" },
    { id: 10, titulo: "Validar prazo no cadastro", descricao: "Rejeitar datas em formato inválido.", tipo: "Tarefa", prioridade: "Crítica", status: "Em revisão", projetoId: 2, responsavelId: 1, dataCriacao: "2026-02-02", dataAtualizacao: "2026-02-13", prazo: "2026-02-16" }
];