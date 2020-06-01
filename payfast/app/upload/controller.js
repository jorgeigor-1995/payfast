const fs = require('fs');

exports.imagem = async (req, res) => {
  console.log('recebendo imagem');

  let nameFile = req.headers.filename;
  const body = req.pipe(fs.createWriteStream('uploads/img/' + nameFile))
  .on('finish', function () {
    console.log('arquivo escrito');
    res.status(201).json({ err: 'sucess', nameFile });
  });
}