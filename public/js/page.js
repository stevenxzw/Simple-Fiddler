/**
 * Created by zhiwen on 14-10-30.
 */
'use strict';
(function(ang, M){
    var host = 'http://127.0.0.1', socket;

    var socketInit = function(){
        if(typeof io !== 'undefined' && !socket){
            socket = io.connect();
            //修复页面后刷新页面
            socket.on('reloadPage', function(file){
                console.log(file);
                location.reload();
            });
        }
    }

    var getAngularObject = function(dom){
        return angular.element(dom);
    }

    var getUriType = function(uri){
        var image = /([.png|.jpg|.gif]$)|[.png|.jpg|.gif]+\?/, js = /.js$|.js+\?/, css = /.css$|.css+\?/;
    }

    M.on('changeRule', function(p){
        socket.emit('client-rule-change', p);
        console.log(p);
    });


    var app = ang.module('app', ['DelegateEvents'], function($interpolateProvider) {
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
        }).filter('icon', function(){
            return function(v, p){
                switch(v){
                    case 'image/gif':
                    case 'image/png':
                    case 'image/jpeg':
                        return '/public/img/img.png';
                    break;
                    case 'text/css':
                        return '/public/img/css.png';
                    case 'application/javascript' :
                         return '/public/img/js.png';
                    case 'application/octet-stream':
                        return '/public/img/xhr.png';
                        break;
                    default :
                        return '/public/img/blank.png';
                        break;
                }
            }
        });

    app.controller('MainCtrl', function($scope) {
        app.filter('hasUri', function(){
            return function(v){
                for(var i= 0,l = rules.length;i<l;i++){
                    if(v === rules[i].targetUrl){
                        return '已存在';
                        break;
                    }
                }
                return '添加';
            }
        })
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
            $scope.$apply(function(){
                uris.push(p);
                //console.log('---:'+ p.url);
            });


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
            if($scope.modalData.targetUrl != '' && $scope.modalData.replaceWith != ''){
                var obj = {
                    id : rules[rules.length-1].id + 1,
                    replaceWith : $scope.modalData.replaceWith,
                    targetUrl : $scope.modalData.targetUrl,
                    compareType : $scope.modalData.compareType,
                    isChecked : true
                };
                rules.push(obj);
                M.fire('changeRule', rules);
                fn && fn();
            }
            return false;
        })


        var initModalData = function(targetUrl, replaceWith, compareType){
            return {
                targetUrl : targetUrl || '',
                replaceWith : replaceWith || '',
                compareType : compareType || 'compare',
                isChecked : true
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

        $scope.itemClick = function(e){
            var tagName = e.target.tagName;
            switch (tagName){
                case 'INPUT' :
                    //console.log(e.target.index)
                    var angObj = getAngularObject(e.target), id = angObj.parent().parent().attr('rel');
                    //console.log(angObj.prop('checked'))
                    for(var i= 0,len = rules.length;i<len;i++){
                        if(id == rules[i].id){
                            rules[i].isChecked = angObj.prop('checked');
                            //console.log(rules[i]);
                            M.fire('changeRule', rules);
                            break;
                        }
                    }
                    break;
                case 'SPAN' :
                    var angObj = getAngularObject(e.target), id = angObj.parent().parent().attr('rel');;
                    if(angObj.hasClass('del')){
                        for(var i= 0,len = rules.length;i<len;i++){
                            if(id == rules[i].id){
                                rules.splice(i, 1);
                                //console.log(rules);
                                M.fire('changeRule', rules);
                                break;
                            }
                        }
                    }
                    break;
            }
        }


    });

})(angular, MP);