/**
 * Created by wen on 14/12/23.
 * 初始化代理
 */

var http = require('http');
var path = require('path');
var httpProxy = require('http-proxy');
var zlib = require('zlib');
var mime = require('mime');
var url = require('url');
var config = require('./../config/base.js').config;
var respond = require('./../lib/remoteRespond.js').response;
var commonUtil = require('./../lib/common.js').cutil;
var _ = require('underscore');
var ruleCmp = require('./../lib/common').RuleCmp;




//代理规则
var ruleFile = global.ruleFile = '/Users/wen/wspace/simple-proxy/rule/test.js';
var currentRule = global.currentRule = require(ruleFile).rule;
var _socket;

global.io.sockets.on('connection', function (socket) {
    console.log('connect:'+socket.id);
    _socket = socket;
    socket.on('test', function(r, fn){
        socket.emit('test2')
        //console.log('on-sendComment');
        //fn('success');
    });

    socket.on('client-rule-change', function(newRule){
        _.each(newRule, function(item){
            delete item['$$hashKey'];
        });
        global.currentRule = currentRule = newRule;
        ruleCmp.write(ruleFile, 'exports.rule=' + JSON.stringify(currentRule, null, 4), function(){

        })
    });
    socket.on('client-changeRule', function(p){

    })


    //console.log(__dirname);
//自动帐新页面
    livereload = require('node-livereload');
    livereload.createServer();
    event = livereload.watch({
        exts: ['jade','css','js'],
        path : __dirname.replace('/lib','')+'/public'
    });
    event.on('change', function(file){
        console.log('============');
        _socket.emit('reloadPage', file);
    });

});

/*
var fs = require('fs');
var txt = "以上程序使用fs.readFileSync从源路径读取文件内容，并使用fs.writeFileSync将文件内容写入目标路径。";


//读取文件
fs.readFile('/Users/wen/wspace/simple-proxy/rule/test.js', 'utf8', function (err, data) {
    if (err) throw err;
    //console.log(data);
    //写入文件
    fs.writeFile('/Users/wen/wspace/simple-proxy/rule/test2.js', data, function (err) {
        if (err) throw err;
        console.log('It\'s saved!'); //文件被保存
    });

});
*/

var uriInfo = {}, sid = 0, idHeader = 'sid_';

http.createServer(function(req, res){
    var urlObj = url.parse(req.url);
    urlObj.host = urlObj.hostname;
    urlObj.port = urlObj.port;
    var result = commonUtil.find(global.currentRule, req.url),
        idx = ++sid;

    var miniInfo = uriInfo[idHeader+idx] = {
        sid : idHeader+idx,
        idx : idx,
        result: '',
        contentType : res.getHeader('content-type') || mime.lookup(urlObj.pathname),
        protocol: urlObj.protocol.replace(':', '').toUpperCase(),
        host: req.headers.host,
        uri: req.url,
        path: urlObj.path,
        pathname: urlObj.pathname,
        req: {
            method: req.method,
            httpVersion: req.httpVersion
        },
        reqHeaders: req.headers,
        reqTime: +new Date
    };
    _socket.emit('request-url', miniInfo);
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
    var chunks = [];
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
            //console.log(headers);
            // handler gzip & defalte transport
            if (encoding == 'gzip') {
                zlib.gunzip(buffer, function(err, decoded) {
                    uriInfo[idHeader+idx]['result'] = (decoded && decoded.toString('binary'));
                    //console.log(decoded && decoded.toString('binary'));
                    //callback(err, decoded && decoded.toString('binary'));
                });
            } else if (encoding == 'deflate') {
                zlib.inflate(buffer, function(err, decoded) {
                    uriInfo[idHeader+idx]['result'] = (decoded && decoded.toString('binary'));
                    //console.log(decoded && decoded.toString('binary'));
                    //callback(err, decoded && decoded.toString('binary'));
                });
            } else {
                uriInfo[idHeader+idx]['result'] = buffer.toString('binary');
                //console.log(buffer.toString('binary'));
                //callback(null, buffer.toString('binary'));
            }
        });
    });
}).listen(config.remotePort, function(){
        console.log('remote init');
});




//logger.log('liveapp ui'.cyan + ' is ready, host: ' + uihost + ', port: ' + String(uiport).cyan);
//};

//liveapp.run();
