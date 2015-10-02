var http = require('http');
var _ = require('lodash');
var createRespondToWebhookRequest = require('./respond-to-webhook-request');

function createMicroserver(opts) {
  var port;

  if (opts) {
    port = opts.port;
  }

  if (!port) {
    port = 5678;
  }

  var respondToRequest = createRespondToWebhookRequest(
    _.pick(opts, 'validWebhookTokens', 'getResponseObject')
  );

  return http.createServer(respondToRequest).listen(port);
}

module.exports = createMicroserver;
