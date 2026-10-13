/*
    Projeto Integrador II - Engenharia de Software - 2026
    Reunião 4

    Arquivo: server.ts
*/

import express from "express";
import cors from "cors";

import loginRoutes from "./routes/login.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import demandasRoutes from "./routes/demandas.routes";
import projetosRoutes from "./routes/projetos.routes";

const app = express();

const PORT = 3000;


// ============================================================
// CONFIGURAÇÕES
// ============================================================

// Permite que o frontend acesse a API
app.use(cors());

// Permite receber JSON nas requisições
app.use(express.json());


// ============================================================
// ROTA PRINCIPAL
// ============================================================

app.get("/", (req, res) => {

    return res.status(200).json({
        mensagem: "API do Sistema de Demandas funcionando."
    });

});


// ============================================================
// ROTAS DA APLICAÇÃO
// ============================================================

app.use(loginRoutes);

app.use(dashboardRoutes);

app.use(demandasRoutes);

app.use(projetosRoutes);

app.listen(PORT, () => {

    console.log(
        `Servidor executando em http://localhost:${PORT}`
    );

});