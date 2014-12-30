/**
 * Created by zhiwen on 14-10-30.
 */
'use strict';
(function(ang, M){
    var host = 'http://127.0.0.1', socket;

    var socketInit = function(){
        if(typeof io !== 'undefined' && !socket)
            socket = io.connect();
    }

    M.on('addRule', function(p){
        socket.emit('client-addRule', p);
        console.log(p);
    });


    var app = ang.module('app', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
    }).filter('vNull', function(){
            return function(v) {
                if(v === '') return '-';
                if(v === undefined) return 0;
                return v;
            };
        }).filter('toTime', function(){
            return function(v){
                return util.timeToDate(v);
            }
        }).filter('cut', function(){
            return function(v, p){
                console.log(arguments);
                return v;
            }
        });

    app.controller('MainCtrl', function($scope) {
        socketInit();
        //console.log(socket.io.on);
        var uris = $scope.uris = [], rules = [], add_modal = angular.element(document.querySelector('#addModal'));
        rules = JSON.parse(M.config.content).rules;
        $scope.rules = rules;
            socket.on('link-ok', function(){
            console.log('link-ok');
        })
        socket.emit('test-links');

        socket.on('request-url', function(p){
            uris.push({uri: p.url, type: p.type||'js'});
            console.log('---:'+ p.url);
            $scope.$apply();

        })
        socket.emit('test', function(){

        })

        $scope.add_modal_btn = function(){
            $scope.$emit('add_modal_open');
        }

        $scope.$on('add_modal_open', function(){
            //console.log($scope.targetUrl);
            add_modal.css('display','block').addClass('in');
        });
        $scope.$on('add_modal_save', function(p, fn){

            if($scope.modalData.targetUrl != '' && $scope.modalData.replaceUrl != ''){
                var obj = {
                    orgUrl : $scope.modalData.replaceUrl,
                    targetUrl : $scope.modalData.targetUrl,
                    compareType : $scope.modalData.compareType,
                    isReplace : true
                };
                M.fire('addRule', obj);
                rules.push(obj);
                fn && fn();
            }
            return false;
        })


        var initModalData = function(targetUrl, replaceUrl, compareType){
            return {
                targetUrl : targetUrl || '',
                replaceUrl : replaceUrl || '',
                compareType : compareType || 'compare'
            }
        };
        //initModalData(22);
        $scope.modalData = initModalData();

        $scope.$on('add_modal_close', function(){
            add_modal.css('display','none').removeClass('in');
            //angular.forEach(add_modal.find('input'), function(dom, v){
            //    dom.value = '';
            //})

            $scope.$apply(function(){
                $scope.modalData = initModalData();
                //console.log($scope.modalData.targetUrl);
            });
        });

        var btn = angular.element(document.querySelector('#closebtn')),
            closeBtn = angular.element(document.querySelector('#closebtn2'));

        btn.bind('click', function(){
            $scope.$emit('add_modal_close');
        });
        closeBtn.bind('click', function(){
            $scope.$emit('add_modal_close');
        })
        angular.element(document.querySelector('#modal_save')).bind('click', function(){

            $scope.$emit('add_modal_save', function(e){
                $scope.$emit('add_modal_close');
            });
        })



    });

})(angular, MP)