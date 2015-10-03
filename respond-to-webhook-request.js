var qs = require('qs');

var accessControlHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

var postResponseHeaders = {
  'Content-Type': 'text/json'
};

function createRespondToWebhookRequest(opts) {
  var validWebhookTokens;
  var getResponseObject;

  if (opts) {
    validWebhookTokens = opts.validWebhookTokens;
    getResponseObject = opts.getResponseObject;
  }

  if (!getResponseObject) {
    throw new Error('getResponseObject not given to createRespondToRequest.');
  }

  function respondToWebhookRequest(req, res) {
    if (req.method === 'OPTIONS') {
      res.writeHead(200, accessControlHeaders);
      res.end('OK');
    }
    else if (req.method === 'POST') {
      streamBodyFromReq(req, respondToBody);
    }
    else {
      res.writeHead(304);
      res.end();
    }

    function respondToBody(error, body) {
      if (error) {
        res.writeHead(400);
        res.end();
        return;
      }

      var params = qs.parse(body);

      if (validWebhookTokens.indexOf(params.token) === -1) {
        res.writeHead(401);
        res.end();
      }
      else {
        getResponseObject(params, writeResponse);
      }
    }

    function writeResponse(error, response) {
      if (error) {
        res.writeHead(500);
        res.end(error.message);
      }
      else {
        res.writeHead(200, postResponseHeaders);
        res.end(JSON.stringify(response));
      }
    }
  }

  return respondToWebhookRequest;
}

function streamBodyFromReq(req, done) {
  var body = '';

  req.on('data', appendData);
  req.on('end', passBackBody);

  function appendData(data) {
    body += data;
  }

  function passBackBody() {
    done(null, body);
  }
}

module.exports = createRespondToWebhookRequest;
