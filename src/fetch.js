'use strict';
var parse = require('url-parse')
var lodash = require('lodash');
var promiseRequest = require('./promise-request');

module.exports = function(url, opts) {
  var config = parse(url);
  config.scheme = config.protocol.slice(0, 4);
  config.path = config.pathname;
  var body = (opts && opts.body) || null;
  var defaultOptions = {
    method: 'get',
    scheme: "http",
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    protocol: "http",
    port: "80"
  }
  var options = lodash.extend(defaultOptions, config, opts);
  var posData = body && JSON.stringify(body);
  if ((options && options.method) != "get") {
    options.headers =  options.headers || {};
    options.headers['Content-Length'] = Buffer.byteLength(posData);
    options.headers['Content-Type'] = "application/json"
  }

  // headers: {
  //   'Content-Type': "application/json",
  //   'token': "V0VJWElOOiQqJTp3ZWl4aW4xMjM0NTZAIyQ"
  // },

  return promiseRequest(options, posData);
}
