const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  numero: Number,
  bandeira: String,
  ano_de_expiracao: Number,
  ano_de_expiraca: Number,
  cvv: Number,
  status: {
    type: String,
    default: "ativo",
  }
});


module.exports = mongoose.model('Cartao', Schema);