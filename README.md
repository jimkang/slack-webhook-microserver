slack-webhook-microserver
=========================

A small web server that wraps around a function you provide to respond to Slack webhook calls.

Installation
------------

    npm install slack-webhook-microserver    

Usage
-----

Make a function that takes [Slack webhook params](https://api.slack.com/outgoing-webhooks) and passes a callback the response you want to send to Slack.

    function echoBackNumber(params, done) {
      var response = {
        text: 'You said: ' + params.number
      };

      callNextTick(done, null, response);
    }

Then, create the web server with it:

    var createMicroserver = require('slack-webhook-microserver');

    var server = createMicroserver({
      validWebhookTokens: ['good-token'],
      getResponseObject: echoBackNumber
    });

Then, when it receive a request, it will check the `token` params against `validWebhookTokens`. If it is a good token, the server will pass the request on to your function and pass back what it responds with to the http response.

When you're done:

    server.close();

(The `server` object returned is an instance of [http.Server](https://nodejs.org/api/http.html#http_class_http_server).)

Tests
-----

Run tests with `make test`.

License
-------

The MIT License (MIT)

Copyright (c) 2015 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
