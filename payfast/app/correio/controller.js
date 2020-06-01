const soap = require('soap');


exports.calcPrazo = async (req, res) => {
  soap.createClient('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?WSDL',
    (err, client) => {
      console.log('client soap criado');
      client.CalcPrazo({
        'nCdServico': req.body.nCdServico,
        'sCepOrigem': req.body.sCepOrigem,
        'sCepDestino': req.body.sCepDestino
      },
        (erro, resultado) => {
          if(!erro){
          console.log(resultado);
          res.json({ resultado: resultado});
          }else{
            res.status(500).json({ err: erro })
          }
        })
    });
}