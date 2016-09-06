'use strict';

var http = require('http'),
  https = require('https'),
  util = require('util');


// returns a promise of an http request

module.exports = function(options, body) {
  var _options = {
    scheme: 'http',
    serialize: JSON.stringify,
    deserialize: JSON.parse
  };
  options = util._extend(_options, options);
  return new Promise(function(resolve, reject) {
    var module = options.scheme === 'https' ? https : http;
    var request = module.request(options, function(response) {
      if (response.statusCode >= 400) {
        return reject(response);
      }
      var _data = '';
      response.on('data', function(data) {
        _data += data.toString();
      });
      response.on('end', function() {
        resolve(util._extend(response, {
          data: options.deserialize(_data)
        }));
      });
      response.on('error', function(error) {
        error.options = options;
        reject(error);
      });
    });
    request.on('error', function(e) {
      e.options = options;
      reject(e);
    });

    if (body) {
      request.write(body);
    }
    request.end();
  });
};
