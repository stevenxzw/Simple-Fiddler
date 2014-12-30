/**
 * Created by wen on 14/12/23.
 * 初始化代理
 */

var http = require('http');
var path = require('path');
var httpProxy = require('http-proxy');
var zlib = require('zlib');
var url = require('url');
var config = require('./../config/base.js').config;
var respond = require('./../lib/remoteRespond.js').response;
var commonUtil = require('./../lib/common.js').cutil;
var _ = require('underscore');
//代理规则
global.currentRule = require('./../rule/test').rule;
var _socket;
global.io.sockets.on('connection', function (socket) {
    console.log('connect:'+socket.id);
    _socket = socket;
    socket.on('test', function(r, fn){
        socket.emit('test2')
        console.log('on-sendComment');
        //fn('success');

    })
});


var fs = require('fs');
//var txt = "以上程序使用fs.readFileSync从源路径读取文件内容，并使用fs.writeFileSync将文件内容写入目标路径。";


//读取文件
fs.readFile('/Users/wen/wspace/MyProxy/rule/test.js', 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
});


http.createServer(function(req, res){
    var urlObj = url.parse(req.url);
    urlObj.host = urlObj.hostname;
    urlObj.port = urlObj.port;
    var result = commonUtil.find(global.currentRule, req.url);

    _socket.emit('request-url', {url : req.url})
    if(result && result.isReplace){
        respond.remoteResponder(null, req, res, result);
        return;
    }
    var proxy = httpProxy.createProxyServer({});
    var proxyOptions = {
        target: {
            host: urlObj.host,
            port: urlObj.port
        }
    };
    // TODO: router with a proxy agent has errors
    // router ip should be visit without proxy agent

    proxy.web(req, res, proxyOptions, function(e) {
        // proxy error -> retry once

    });
    return;



    var callback = function(err, body) {
        notify.response(sid, req, res, body);
    };
    res.on('pipe', function(readStream) {
        // readStream = response.getResInfo(readStream);

        readStream.on('data', function(chunk) {
            chunks.push(chunk);
            res.write(chunk);
        });
        readStream.on('end', function() {

            var headers = readStream.headers || [];
            var buffer = Buffer.concat(chunks);
            var encoding = headers['content-encoding'];
            // handler gzip & defalte transport
            if (encoding == 'gzip') {
                zlib.gunzip(buffer, function(err, decoded) {
                    callback(err, decoded && decoded.toString('binary'));
                });
            } else if (encoding == 'deflate') {
                zlib.inflate(buffer, function(err, decoded) {
                    callback(err, decoded && decoded.toString('binary'));
                });
            } else {
                callback(null, buffer.toString('binary'));
            }
        });
    });
}).listen(config.remotePort, function(){
        console.log('remote init');
});




//logger.log('liveapp ui'.cyan + ' is ready, host: ' + uihost + ', port: ' + String(uiport).cyan);
//};

//liveapp.run();
