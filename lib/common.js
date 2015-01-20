/**
 * Created by wen on 14/12/25.
 */
(function(){
    var _ = require('underscore');
    var fs = require('fs');
    var util = {
        compareUrl : function(org, url){

        },
        find : function(list, url){

            return _.find(list, function(item){
//                if(url.indexOf('jquery')>-1){
//                   var v = 1;
//                }
                if(item.compareType === 'regExp')
                    return new RegExp(item.targetUrl).test(url);
                else
                    return url === item.targetUrl;
            })
        }
    }
    exports.cutil = util;
    exports.RuleCmp = {
        write : function(filePath, json, fn){
            fs.writeFile(filePath, json, function (err) {
                if (err) throw err;
                console.log('It\'s saved!'); //文件被保存
                fn && fn();
            });
        }
    }
})()