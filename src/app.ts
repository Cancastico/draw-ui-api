/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { router } from "./model/routes/routes";
import cluster from "cluster";
import os from "os";
import { error_response } from "./model/services/error_service";

//instancia do Express
const app = express();
//Configuração CORS
app.use(
  cors({
    origin: ["localhost", "192.168.0.183"],
  }),
);

//Configura o express para estar recebendo JSON como formato de Requisição. OBS: acredito dar pra colocar XML
app.use(express.json());

// faz a referencia para as rotas podendo
app.use(router);

//Extenção final do Error middleware, é esse cara que pega e configura as respostas de erro criadas pelo erro middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof error_response) {
    return res.status(err.code).json({
      error: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

//Iniciação da API
const server = app.listen(8099, () => {
  console.log("Server is running on port 8099");
});
