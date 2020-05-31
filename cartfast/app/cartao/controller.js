const Model = require('./model');
const to = require('../../core/to');

exports.index = async (req, res) => {
  const data = await Model.find({});
  if(data){
    res.json({ sucess: true, data: data})
  }
}



exports.new = async (req, res) => {
  const erros = [];
  if(!req.body || !req.body.numero || !req.body.bandeira || !req.body.ano_expiracao || !req.body.mes_expiracao || !req.body.cvv){
    erros.push("Todos os dados obrigatorio");
  }
  
  if(erros.length > 0){
    console.log('Erros de validacao encontrados!');
    res.status(400).send("Erro: " + erros);
    return;
  }

  const cartao = req.body;
  console.log("Processando cartao");

  const model = new Model(cartao);
  const [err, data] = await to(model.save());
  if(!err){
    console.log("cartao criado");
    res.status(201).json({ erro: err, data: data });
  }else{
    console.log("Erro ao inserir no banco: " + err );
    res.status(500).json({ erro: err });
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id;
  const model = await Model.findOne({ _id: id});

  if (model) {
    model.status = "CANCELADO";
    const data = await model.save();

    if (data) {
      res.status(204).json({ success: true, data, err: "Pagamento cancelado" });
      console.log('cartao cancelado');
    } else {
      res.status(500).json({ success: false, data, err: "Erro ao salvar, tente novamente."});
      console.log('Erro ao salvar');
    }
  } else {
    res.json({ success: false, data: model, err: "cartao não encontrado."});
  }
}