const express = require('express');
const rotas = express.Router();

const controller = require("./controller");

rotas.get("/", controller.index);
rotas.get('/pagamento/:id', controller.get);
rotas.post("/pagamento", controller.new);
rotas.put('/pagamento/:id', controller.confirm);
rotas.delete('/pagamento/:id', controller.delete);

module.exports = rotas;