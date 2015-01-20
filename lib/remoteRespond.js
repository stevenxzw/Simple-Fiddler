/**
 * Created by wen on 14/12/24.
 */
var url = require('url');
var http = require('http');
var path = require('path');
exports.response = {

    remoteResponder : function(handler, req, res, options) {
        //var _url = 'http://dev.myweb.com/remote.js';
        var reqUrl = url.parse(options.replaceWith);
        //var reqUrl = url.parse(handler.action);

        var buffers = [];
        var options = {
            hostname: reqUrl.hostname,
            port: 80,
            path: reqUrl.pathname,
            method: 'GET'
        };


        var request = http.request(options, function(response) {
            response.pipe(res);
        });

        request.on('error', function(e) {
            logger.log('problem with request: ' + e.message);
        });

        request.end();
    }

}
