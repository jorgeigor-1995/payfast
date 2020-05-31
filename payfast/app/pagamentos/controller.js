const Model = require('./model');
const to = require('../../core/to');
const app = require('../../config/custom-express');
const clienteCartoes = require('../../services/clienteCartoes');
const restify= require('restify-clients');

exports.index = async (req, res) => {
  const data = await Model.find({});
  if (data) {
    res.json({ sucess: true, data: data })
  }
}

exports.confirm = async (req, res) => {
  const id = req.params.id;
  const model = await Model.findOne({ _id: id });

  if (model) {
    model.status = "CONFIRMADO";
    const data = await model.save();

    if (data) {
      res.json({ success: true, data });
    } else {
      res.json({ success: false, data, err: "Erro ao salvar, tente novamente." });
    }
  } else {
    res.json({ success: false, data: model, err: "Pagamento não encontrado." });
  }
}

exports.new = async (req, res) => {
  const erros = [];
  if (!req.body.pagamento || !req.body.pagamento.forma_de_pagamento || req.body.pagamento.forma_de_pagamento === '') {
    erros.push("forma de pagamento obrigatorio");
  }
  if (!req.body.pagamento.valor || req.body.pagamento.valor === Number) {
    erros.push("Valor é obrigatório e deve ser decimal");
  }

  if (erros.length > 0) {
    console.log('Erros de validacao encontrados!');
    res.status(400).send("Erro: " + erros);
    return;
  }

  const pagamento = req.body.pagamento;
  console.log("Processando uma requisição de um novo pagamento");

  pagamento.status = "CRIADO";
  pagamento.data = new Date;
  if (req.body.pagamento.forma_de_pagamento === 'cartao') {
    const cartao = req.body["cartao"];
    
    const client = await restify.createJSONClient({
      url:"http://localhost:3031",
    });

    client.post('/cartao/autoriza', cartao , (err, requisicao, response, resposta) => {
      if(!err){
        console.log("pagamento criado");
      res.status(201).json({
        erro: err, data: resposta })
      } else {
        console.log("Erro ao inserir no banco: " + err);
        res.status(500).json({ erro: err });
      };
    });

  } else {
    const model = new Model(pagamento);
    const [err, data] = await to(model.save());
    if (!err) {
      console.log("pagamento criado");
      res.status(201).json({
        erro: err, data: data,
        links: [{
          href: "http://localhost:3030/pagamentos/pagamento/" + data._id,
          rel: "confirmar",
          method: "PUT"
        }, {
          href: "http://localhost:3030/pagamentos/pagamento/" + data._id,
          rel: "cancelar",
          method: "DELETE"
        }, {
          href: "http://localhost:3030/pagamentos",
          ref: "listar",
          method: "GET"
        }
        ]
      });
    } else {
      console.log("Erro ao inserir no banco: " + err);
      res.status(500).json({ erro: err });
    }

  }

}

exports.delete = async (req, res) => {
  const id = req.params.id;
  const model = await Model.findOne({ _id: id });

  if (model) {
    model.status = "CANCELADO";
    const data = await model.save();

    if (data) {
      res.status(204).json({ success: true, data, err: "Pagamento cancelado" });
      console.log('Pagamento cancelado');
    } else {
      res.status(500).json({ success: false, data, err: "Erro ao salvar, tente novamente." });
      console.log('Erro ao salvar');
    }
  } else {
    res.json({ success: false, data: model, err: "Pagamento não encontrado." });
  }
}