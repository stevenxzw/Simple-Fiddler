/**
 * Created by wen on 14/12/24.
 * 初始化UI
 */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('../routes/index');
var users = require('../routes/users');
var http = require('http');
var path = require('path');
var httpProxy = require('http-proxy');
var zlib = require('zlib');
var url = require('url');
var config = require('./../config/base.js').config;
var _ = require('underscore');


// ui

var liveapp = express();


/*静态文件路径*/
liveapp.use('/public', express.static(path.join(__dirname, './../public')));

// view engine setup
liveapp.set('views', path.join(__dirname, './../public/views'));
liveapp.set('view engine', 'jade');

liveapp.use(bodyParser.json());
liveapp.use(bodyParser.urlencoded({ extended: false }));
liveapp.use(cookieParser());


liveapp.use('/', routes);
liveapp.use('/users', users);


var server = liveapp.listen(config.uiPort);

var io = require('socket.io').listen(server);
//var server = liveapp.listen(uiport, uihost);
liveapp.io = io;
global.io = io;
// browser connection -> keep only one socket connection
var _socket;
liveapp.io.sockets.on('connection', function(socket) {
    console.log('connect:' + socket.id);
    socket.on('test-link', function(e){
        //console.log('socket-link');
        socket.emit('link-ok');
    })
});

exports.app = liveapp;
console.log('ui init');