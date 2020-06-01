const fs = require('fs');
const express = require('express');
const upload = express();

upload.use(function (req, res, next) {
  fs.createReadStream("imagem.jpg")
  .pipe(fs.createWriteStream('imagem-stream.jpg'))
  .on('finish', () => {
    console.log('Arquivo escrito com stream');
  });
});

module.exports = upload;

