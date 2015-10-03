var test = require('tape');
var createMicroserver = require('../../webhook-microserver');
var request = require('request');
var callNextTick = require('call-next-tick');

var serverURL = 'http://localhost:5678';

test('Bad token', function badToken(t) {
  t.plan(3);

  function getTestObject(done) {
    var response = {
      test: 'ok'
    };
    callNextTick(done, null, response);
  }

  var server = createMicroserver({
    validWebhookTokens: ['test-token'],
    getResponseObject: getTestObject
  });

  request(
    {
      url: serverURL,
      method: 'POST',
      json: true,
      form: {
        token: 'bad-token'
      }
    },
    checkResponse
  );

  function checkResponse(error, response, body) {
    t.ok(!error, 'No error from request call.');
    t.equal(response.statusCode, 401, 'Returns a 401 error.');
    t.ok(!body, 'No body is returned.');
    server.close();
  }
});

test('Good token', function goodToken(t) {
  t.plan(4);

  function getTestObject(params, done) {
    t.deepEqual(
      params,
      {
        token: 'good-token',
        number: '5'
      },
      'Params are passed to the getResponseObject function.'
    );

    var response = {
      test: 'ok',
      number: params.number
    };

    callNextTick(done, null, response);
  }
  
  var server = createMicroserver({
    validWebhookTokens: ['good-token'],
    getResponseObject: getTestObject
  });

  request(
    {
      url: serverURL,
      method: 'POST',
      json: true,
      form: {
        token: 'good-token',
        number: 5
      }
    },
    checkResponse
  );

  function checkResponse(error, response, body) {
    t.ok(!error, 'No error from request call.');
    t.equal(response.statusCode, 200, 'Returns a 200 OK status code.');
    t.deepEqual(
      body,
      {
        test: 'ok',
        number: '5'
      },
      'Response is what is returned by getResponseObject.'
    ),
    server.close();
  }
});
