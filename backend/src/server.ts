/*
    Projeto Integrador II - Engenharia de Software - 2026
    Reunião 4

    Arquivo: server.ts
*/
import express from "express";

import loginRoutes from "./routes/login.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import demandasRoutes from "./routes/demandas.routes";
import projetosRoutes from "./routes/projetos.routes";

const app = express();

const PORT = 3000;


// Permite receber JSON nas requisições
app.use(express.json());


// Rota principal para testar a API
app.get("/", (req, res) => {

    return res.status(200).json({
        mensagem: "API do Sistema de Demandas funcionando."
    });

});


// Rotas da aplicação
app.use(loginRoutes);

app.use(dashboardRoutes);

app.use(demandasRoutes);

app.use(projetosRoutes);


// Inicia o servidor
app.listen(PORT, () => {

    console.log(
        `Servidor executando em http://localhost:${PORT}`
    );

});