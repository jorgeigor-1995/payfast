const app = require('./config/custom-express')();

var config = require('./config');
require('./config/connection');
app.listen(config.initialPort, () =>{
  console.log('Servidor rodando na porta:'+ config.initialPort);
});




