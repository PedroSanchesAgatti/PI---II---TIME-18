//  Autor: Pedro Sanches 
import express, { NextFunction, Request, Response } from "express";
import path from "node:path";
import loginRouter from "./routes/login";

const app = express();
const porta = Number(process.env.PORT) || 3000;
const raizProjeto = process.cwd();


app.use(loginRouter);

app.get("/", (_req, res) => {
    res.sendFile(path.join(raizProjeto, "login.html"));
});

// Permite testar a interface e a API na mesma origem.
const paginasPublicas = [
    "login.html",
    "dashboard.html",
    "demandas.html",
    "cadastro-demanda.html",
    "detalhes-demanda.html"
];

for (const pagina of paginasPublicas) {
    app.get(`/${pagina}`, (_req, res) => {
        res.sendFile(path.join(raizProjeto, pagina));
    });
}

app.use("/css", express.static(path.join(raizProjeto, "css"), { dotfiles: "deny" }));
app.use("/js", express.static(path.join(raizProjeto, "js"), { dotfiles: "deny" }));

app.use((_req, res) => {
    res.status(404).json({ mensagem: "Rota não encontrada." });
});

app.use(
    (erro: unknown, _req: Request, res: Response, _next: NextFunction) => {
        const status =
            erro &&
            typeof erro === "object" &&
            "status" in erro &&
            (erro as { status?: number }).status === 400
                ? 400
                : 500;

        if (status === 400) {
            return res.status(400).json({
                mensagem: "O corpo da requisição contém JSON inválido."
            });
        }

        console.error("Erro inesperado na API:", erro);
        return res.status(500).json({
            mensagem: "Erro interno do servidor."
        });
    }
);

app.listen(porta, () => {
    console.log(`Servidor disponível em http://localhost:${porta}`);
});
