const express = require('express');
const rotas = express.Router();

const controller = require("./controller");

rotas.post('/imagem', controller.imagem);

module.exports = rotas;