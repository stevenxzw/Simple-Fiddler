/*
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var http = require('http');
var path = require('path');
//var app = express();
var httpProxy = require('http-proxy');
var zlib = require('zlib');
var url = require('url');


//app.use('/', routes);
//app.use('/users', users);




//web ui

var liveapp = express();

var publicPath = __dirname + '/public',
    viewPath = __dirname + '/views';

// create tmp folder

function createSocketFolder() {
    var _path = path.join(config.global.tempDir, _socket.id);
    if (!util.exists(_path)) {
        util.mkdirpSync(_path);
    }
};

function removeSocketFolder() {
    var path = config.global.tempDir;
    try {
        rimraf.sync(path);
    } catch (e) {

    }
};


// view engine setup
liveapp.set('views', path.join(__dirname, 'views'));
liveapp.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
liveapp.use(bodyParser.json());
liveapp.use(bodyParser.urlencoded({ extended: false }));
liveapp.use(cookieParser());


liveapp.use('/', routes);
liveapp.use('/users', users);

//liveapp.run = function() {


    //var server = http.createServer(liveapp);
    //server.listen(4001);
    var server = liveapp.listen(4001);

    var io = require('socket.io').listen(server);
    //var server = liveapp.listen(uiport, uihost);
    liveapp.io = io;

    // browser connection -> keep only one socket connection
    liveapp.io.sockets.on('connection', function(socket) {
        console.log('connect:' + socket.id);
        _socket = socket;
        exports.socket = _socket;
    });

    console.log('run init')


//自动刷新
livereload = require('node-livereload');
livereload.createServer();
event = livereload.watch({
    exts: ['jade','css','js'],
    path : __dirname+'/public/'
});
event.on('change', function(file){
    console.log('========');
});
//livereload -p ./ -e js,jade,css
*/
require('./lib/uiInit.js');

//console.log(__dirname);
require('./lib/remoteInit.js');


//
//var assert = require("assert");
//describe('Array', function(){
//    describe('#indexOf()', function(){
//        it('should return -1 when the value is not present', function(){
//            assert.equal(-1, [1,2,3].indexOf(5));
//            //assert.equal(-1, [1,0,2,3,0].indexOf(0));
//        })
//    })
//});