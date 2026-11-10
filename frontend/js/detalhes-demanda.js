
const API = window.API_URL || 'http://localhost:3000';

const id = new URLSearchParams(location.search).get('id');

const $ = (id) => document.getElementById(id);

const mensagem = (id, texto) => {
    $(id).textContent = texto;
};

const data = (valor) => {
    return valor
        ? new Date(valor).toLocaleString('pt-BR')
        : 'Não informado';
};

const nome = (valor) => {
    if (typeof valor === 'object' && valor !== null) {
        return valor.nome || valor.titulo || valor.id || 'Não informado';
    }

    return valor ?? 'Não informado';
};

async function requisicao(caminho, opcoes = {}) {
    let resposta;

    try {
        resposta = await fetch(`${API}${caminho}`, {
            credentials: 'include',
            ...opcoes
        });
    } catch {
        throw new Error('Não foi possível conectar à API.');
    }

    const json = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(
            json.erro ||
            json.mensagem ||
            `Erro HTTP ${resposta.status}`
        );
    }

    return json;
}

async function carregarDemanda() {
    if (!id || !/^\d+$/.test(id)) {
        mensagem(
            'mensagem-demanda',
            'Selecione uma demanda na listagem para visualizar os detalhes.'
        );
        return;
    }

    try {
        const d = await requisicao(
            `/demandas/${encodeURIComponent(id)}`
        );

        const campos = {
            titulo: d.titulo,
            descricao: d.descricao,
            tipo: d.tipo,
            projeto: nome(d.projeto_nome ?? d.projeto),
            prioridade: d.prioridade,
            status: d.status,
            responsavel: nome(d.responsavel_nome ?? d.responsavel),
            prazo: data(d.prazo_finalizacao ?? d.prazo),
            'data-criacao': data(d.data_criacao),
            'data-atualizacao': data(d.data_atualizacao)
        };

        Object.entries(campos).forEach(([chave, valor]) => {
            $(chave).textContent = valor ?? 'Não informado';
        });

        $('informacoes-demanda').hidden = false;
        $('form-comentario').hidden = false;

        $('botao-editar').href =
            `cadastro-demanda.html?id=${encodeURIComponent(id)}`;

        mensagem('mensagem-demanda', '');

        await Promise.all([
            carregarComentarios(),
            carregarHistorico()
        ]);

    } catch (erro) {
        mensagem('mensagem-demanda', erro.message);
    }
}

async function carregarComentarios() {
    try {
        const comentarios = await requisicao(
            `/demandas/${encodeURIComponent(id)}/comentarios`
        );

        const lista = $('lista-comentarios');
        lista.replaceChildren();

        if (!comentarios.length) {
            lista.textContent = 'Nenhum comentário registrado.';
            return;
        }

        comentarios.forEach(c => {
            const item = document.createElement('article');
            item.className = 'comentario';

            const autor = document.createElement('strong');
            autor.textContent = nome(c.usuario_nome ?? c.usuario);

            const quando = document.createElement('small');
            quando.textContent = data(c.data_criacao);

            const texto = document.createElement('p');
            texto.textContent = c.texto;

            item.append(autor, quando, texto);
            lista.append(item);
        });

    } catch (erro) {
        mensagem('mensagem-comentario', erro.message);
    }
}

async function carregarHistorico() {
    try {
        const historico = await requisicao(
            `/demandas/${encodeURIComponent(id)}/historico`
        );

        const lista = $('lista-historico');
        lista.replaceChildren();

        if (!historico.length) {
            lista.textContent = 'Nenhuma alteração registrada.';
            return;
        }

        historico.forEach(h => {
            const item = document.createElement('li');

            item.textContent =
                `${data(h.data_alteracao)} — ` +
                `${nome(h.usuario_nome)} alterou ${h.campo}: ` +
                `${h.valor_anterior ?? 'Não definido'} → ` +
                `${h.valor_novo ?? 'Não definido'}`;

            lista.append(item);
        });

    } catch (erro) {
        $('lista-historico').textContent = erro.message;
    }
}

$('form-comentario').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const texto = $('texto-comentario').value.trim();

    if (!texto) {
        mensagem(
            'mensagem-comentario',
            'Digite um comentário antes de publicar.'
        );
        return;
    }

    if (texto.length > 2000) {
        mensagem(
            'mensagem-comentario',
            'Máximo de 2000 caracteres.'
        );
        return;
    }

    const botao = $('form-comentario').querySelector('button');
    botao.disabled = true;

    try {
        await requisicao(
            `/demandas/${encodeURIComponent(id)}/comentarios`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ texto })
            }
        );

        $('texto-comentario').value = '';

        mensagem(
            'mensagem-comentario',
            'Comentário publicado.'
        );

        await carregarComentarios();

    } catch (erro) {
        mensagem('mensagem-comentario', erro.message);
    } finally {
        botao.disabled = false;
    }
});

carregarDemanda();
