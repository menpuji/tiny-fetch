var request = require('request');
var fs = require('fs'); // fs para escrever diretamente para o disco, much win
var Puid = require('puid');
var puid = new Puid(); // Isso aqui gera ID únicos, assim nunca vai sobreescrever
var path = require('path');
var Promise = require('bluebird');

var download = function(arquivo, pasta, callback) {
  var p = new Promise(function(resolve, reject) {
    var dest, id;
    var exists = fs.existsSync(pasta);

    if (exists) {
      var stat = fs.lstatSync(pasta);
      if (stat.isFile()) {
        dest = pasta;
      } else {
        id = puid.generate();
        dest = path.join(pasta, id);
      }
    } else {
      dest = pasta;
    }

    var writeStream = fs.createWriteStream(dest);

    // Avisando a promise que acabamos por aqui
    writeStream.on('finish', function() {
      resolve(id || pasta);
    });

    // Capturando erros da write stream
    writeStream.on('error', function(err) {
      fs.unlink(dest, reject.bind(null, err));
    });

    var readStream = request.get(arquivo);

    // Capturando erros da request stream
    readStream.on('error', function(err) {
      fs.unlink(dest, reject.bind(null, err));
    });

    // Iniciando a transferência de dados
    readStream.pipe(writeStream);
  });

  // Manter compatibilidade com callbacks
  if (!callback)
    return p;

  p.then(function(id) {
    callback(null, id);
  }).catch(function(err) {
    callback(err);
  });
};

module.exports = download;



// download(
//     'http:??/weixin/' +
//     wechatInfo.storeId + '.p12',
//     'D:/MyProject/menpuji-storesite/src/download/cert/' +
//     wechatInfo.storeId + '.p12')
//   .then(function(id) {
//     wechatInfo.pfx =
//       'D:/MyProject/menpuji-storesite/src/download/cert/' +
//       wechatInfo.storeId + '.p12';
//     ctx.Update(wechatInfo);
//
//     console.log('Arquivo gravado com id %s', id);
//   })
//   .catch(function(err) {
//     console.log('Deu pau..');
//     console.log(err.stack);
//   }).finally(function() {
//     wechatInfo = null;
//     ctx = null;
//   });
