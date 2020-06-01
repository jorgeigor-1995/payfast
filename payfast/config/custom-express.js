const express = require('express');
const bodyParser = require("body-parser");
const consign = require('consign');
const morgan = require('morgan');
const logger = require('../services/loggers');

module.exports = () =>{
  const app = express();

  app.use(morgan("common", {
    stream: {
      write:function(mensagem) {
        logger.info(mensagem);
      }
    }
  }));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  
  app.use("/correio", require('../app/correio'));
  app.use("/pagamentos", require('../app/pagamentos'));
  app.use('/upload', require('../app/upload'));
  consign()
   .then('services')
   .into(app);
  
  
  return app;
}