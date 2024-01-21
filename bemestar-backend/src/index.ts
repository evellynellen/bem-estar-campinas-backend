import "dotenv/config";
import express from "express";

import cors from "cors";
import { router } from "./routes";

const app = express();

// Adicionando middlewares ao servidor
app.use(cors());
app.use(express.json());
app.use(router);

// Iniciando o servidor na porta definida
app.listen(process.env.PORT || 5000, () => console.log("API running...."));
