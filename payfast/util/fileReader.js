const fs = require('fs');
//buffer mode
fs.readFile('imagem.jpg', (error, buffer) => {
  console.log('Arquivo lido');

  fs.writeFile('imagem2.jpg', buffer, (err) => {
    console.log('Arquivo escrito');
  });
});