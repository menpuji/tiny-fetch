var http = require('http');
var parse = require('url-parse')
var lodash = require('lodash');
var util = require('util');


function fetchApi(opts, postData) {
  return new Promise(function(resolve, reject) {
    var req = http.request(opts, (res) => {
      if (res.statusCode >= 400) {
        return reject(res);
      }
      res.setEncoding('utf8');
      var _data = '';
      res.on('data', (chunk) => {
        // console.log(`BODY: ${chunk}`);
        _data += chunk.toString();
      });
      res.on('end', () => {
        console.log('No more data in response.');

        resolve(util._extend(res, {
          data: opts.deserialize(_data)
        }));
      });
      res.on('error', (err) => {
        console.log(err);
        reject(err);
      })
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
      reject(e);
    });

    // write data to request body
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}


module.exports = function(url, opts) {

  var config = parse(url);
  var postData;
  var op1;
  var _opt = {
    method: 'get',
    serialize: JSON.stringify,
    deserialize: JSON.parse
  }
  config.path = config.pathname;
  op1 = lodash.extend(_opt, config, opts);
  if (opts && opts.body) {
    postData = op1.serialize(opts.body)
  }

  op1.headers = {
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'token': "V0VJWElOOiQqJTp3ZWl4aW4xMjM0NTZAIyQ"
  };
  return fetchApi(op1, postData)
}
