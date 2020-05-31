const restify= require('restify-clients');

function clienteCartoes(){
  this._client = restify.createJSONClient({
    url:"http://localhost:3031",
  });
}

clienteCartoes.prototype.autoriza = (cartao, callback) =>{
  this._client.post('/cartao/autoriza', cartao , callback);
}



