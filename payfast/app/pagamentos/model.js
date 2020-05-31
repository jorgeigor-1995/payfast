const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  forma_de_pagamento: String,
  valor: Number,
  moeda: String,
  descricao: String,
  status: String,
  data: Date
});


module.exports = mongoose.model('Pagamento', Schema);