const express = require('express');
const rotas = express.Router();

const controller = require("./controller");

rotas.get("/", controller.index);
rotas.post("/pagamento", controller.new);

module.exports = rotas;