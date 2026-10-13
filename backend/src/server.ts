/*
    Projeto Integrador II
    Reunião 4
    Servidor Express com TypeScript
*/

import express from "express";

import loginRoutes from "./routes/login.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import demandasRoutes from "./routes/demandas.routes";
import projetosRoutes from "./routes/projetos.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "API do Sistema de Demandas funcionando."
    });
});

app.use(loginRoutes);
app.use(dashboardRoutes);
app.use(demandasRoutes);
app.use(projetosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor executando em http://localhost:${PORT}`);
});