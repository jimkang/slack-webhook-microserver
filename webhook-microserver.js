var http = require('http');
var _ = require('lodash');
var createRespondToWebhookRequest = require('./respond-to-webhook-request');

function createMicroserver(opts) {
  var port;
  var log;

  if (opts) {
    port = opts.port;
    log = opts.log;
  }

  if (!port) {
    port = 5678;
  }

  var respondToRequest = createRespondToWebhookRequest(
    _.pick(opts, 'validWebhookTokens', 'getResponseObject')
  );

  var server = http.createServer(respondToRequest).listen(port);
  if (log) {
    log('Slack webhook server started on port', port);
  }
  return server;
}

module.exports = createMicroserver;
