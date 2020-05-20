const Model = require('./model');
const to = require('../../core/to');

exports.index = async (req, res) => {
  res.send('Ok');
}

exports.new = async (req, res) => {
  const pagamento = req.body;
  console.log("Processando uma requisição de um novo pagamento");
  
  pagamento.status = "CRIADO";
  pagamento.data = new Date;
  const model = new Model(pagamento);
  const [err, data] = await to(model.save());
  if(!err){
    console.log("pagamento criado");
  }
  res.json({ erro: err, data: data});
}