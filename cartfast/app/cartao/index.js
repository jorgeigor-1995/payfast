const express = require('express');
const rotas = express.Router();

const controller = require("./controller");

rotas.get("/", controller.index);
rotas.post("/autoriza", controller.new);
rotas.delete('/:id', controller.delete);

module.exports = rotas;