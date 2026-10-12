
//  Autor: Pedro Sanches
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export type PerfilUsuario =
    | "Administrador"
    | "Líder de Projeto"
    | "Membro da Equipe";

export interface UsuarioPublico {
    id: number;
    nome: string;
    email: string;
    perfil: PerfilUsuario;
}

interface UsuarioInterno extends UsuarioPublico {
    salt: Buffer;
    senhaHash: Buffer;
}

function criarUsuarioTeste(
    id: number,
    nome: string,
    email: string,
    senhaTeste: string,
    perfil: PerfilUsuario
): UsuarioInterno {
    const salt = randomBytes(16);
    const senhaHash = scryptSync(senhaTeste, salt, 64);

    return { id, nome, email, perfil, salt, senhaHash };
}

// Dados temporários para demonstrar a autenticação nesta etapa do projeto.
const usuarios: UsuarioInterno[] = [
    criarUsuarioTeste(
        1,
        "Ana Administradora",
        "admin@pi2.local",
        "Admin@123",
        "Administrador"
    ),
    criarUsuarioTeste(
        2,
        "Bruno Líder",
        "lider@pi2.local",
        "Lider@123",
        "Líder de Projeto"
    ),
    criarUsuarioTeste(
        3,
        "Carla Membro",
        "membro@pi2.local",
        "Membro@123",
        "Membro da Equipe"
    )
];

export function listarUsuarios(): UsuarioPublico[] {
    return usuarios.map(({ id, nome, email, perfil }) => ({
        id,
        nome,
        email,
        perfil
    }));
}

export function autenticarUsuario(
    emailInformado: string,
    senhaInformada: string
): UsuarioPublico | null {
    const emailNormalizado = emailInformado.trim().toLowerCase();
    const usuario = usuarios.find(
        (item) => item.email.toLowerCase() === emailNormalizado
    );

    if (!usuario) {
        return null;
    }

    const hashInformado = scryptSync(
        senhaInformada,
        usuario.salt,
        usuario.senhaHash.length
    );

    if (!timingSafeEqual(hashInformado, usuario.senhaHash)) {
        return null;
    }

    const { id, nome, email, perfil } = usuario;
    return { id, nome, email, perfil };
}
