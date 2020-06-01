const Model = require('./model');
const to = require('../../core/to');
const restify = require('restify-clients');
const memCachedClient = require('../../services/menCachedClient');
const logger = require('../../services/loggers');

exports.get = async (req, res) => {
  let id = req.params.id;
  console.log('consultando pagamento: ' + id);

  const clientCached = memCachedClient();

  clientCached.get('pagamento-' + id, function (erro, retorno) {
    if (erro || !retorno) {
      console.log("MISS - chave não encontrada: " + erro);
      const [err, data] = to(Model.findOne({ _id: id }));
      if (!err) {
        console.log('Pagamento encontrado: ' + data);
        logger.info('Pagamento encontrado:' + data._id);
        res.json({ sucess: true, data: data });
      } else {
        console.log('Pagamento não encontrado');
        logger.info("Pagamento não encontrado");
        res.status(500).json({ err: err, sucess: false });
      }
    } else {
      console.log("HIT - valor: " + JSON.stringify(retorno));
      logger.info("Pagamento encontrado");
      res.json({ sucess: true, data: retorno});
    }
  });
}

exports.index = async (req, res) => {
  const data = await Model.find({});
  if (data) {
    res.json({ sucess: true, data: data })
  } else {
    res.json({ sucess: false })
  }
}

exports.confirm = async (req, res) => {
  const id = req.params.id;
  const model = await Model.findOne({ _id: id });

  if (model) {
    model.status = "CONFIRMADO";
    const data = await model.save();

    if (data) {
      const clientCached = memCachedClient();
      clientCached.set('pagamento-' + id, data, 60000, function (erro, ) {
        console.log('nova chave adicionada ao cache:  pagamento-' + id);
      });

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
    logger.info("Erros de validacao encontrados!");
    res.status(400).send("Erro: " + erros);
    return;
  }

  const pagamento = req.body.pagamento;
  console.log("Processando uma requisição de um novo pagamento");

  pagamento.status = "CRIADO";
  pagamento.data = new Date;

  const model = new Model(pagamento);
  const [err, data] = await to(model.save());

  if (!err) {
    const clientCached = memCachedClient();
    clientCached.set('pagamento-' + data._id, data, 60000, function (erro, ) {
      console.log('nova chave adicionada ao cache:  pagamento-' + data._id);
    });
    if (req.body.pagamento.forma_de_pagamento === 'cartao') {
      const cartao = req.body["cartao"];

      const client = await restify.createJSONClient({
        url: "http://localhost:3031",
      });

      client.post('/cartao/autoriza', cartao, (erro, requisicao, response, resposta) => {
        if (!erro) {
          console.log("pagamento criado com cartao");
          logger.info("pagamento criado com cartao");
          res.status(201).json({
            erro: erro, cartao: resposta, data: data,
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
          })
        } else {
          console.log("Erro ao inserir no banco: " + erro);
          logger.info("Erro ao inserir no banco: " + erro);
          res.status(400).json({ erro: erro });
        };
      });
    } else {
      console.log("pagamento criado");
      logger.info("pagamento criado");
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
    }
  } else {
    console.log("Erro ao inserir no banco: " + err);
    logger.info("Erro ao inserir no banco: " + err);
    res.status(500).json({ erro: err });
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id;
  const model = await Model.findOne({ _id: id });

  if (model) {
    model.status = "CANCELADO";
    const data = await model.save();

    if (data) {
      const clientCached = memCachedClient();
      clientCached.set('pagamento-' + id, data, 60000, function (erro, ) {
        console.log('nova chave adicionada ao cache:  pagamento-' + id);
      });

      res.status(204).json({ success: true, data, err: "Pagamento cancelado" });
      console.log('Pagamento cancelado');
      logger.info('Pagamento cancelado');
    } else {
      res.status(500).json({ success: false, data, err: "Erro ao salvar, tente novamente." });
      console.log('Erro ao salvar');
      logger.info('Erro ao salvar');
    }
  } else {
    console.log('Pagamento não encontrado.');
      logger.info('Pagamento não encontrado.');
      res.json({ success: false, data: model, err: "Pagamento não encontrado." });
  }
}