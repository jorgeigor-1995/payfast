const express = require('express');
const rotas = express.Router();

const controller = require("./controller");

rotas.post('/calc-prazo', controller.calcPrazo);

module.exports = rotas;