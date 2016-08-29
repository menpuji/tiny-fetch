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
  if ((opts && opts.method) != "get") {
    defaultOptions.headers = {
      'Content-Type': "application/json"
    }
  }
  var options = lodash.extend(defaultOptions, config, opts);

  // headers: {
  //   'Content-Type': "application/json",
  //   'token': "V0VJWElOOiQqJTp3ZWl4aW4xMjM0NTZAIyQ"
  // },

  return promiseRequest(options, body);
}
