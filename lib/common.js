/**
 * Created by wen on 14/12/25.
 */
(function(){
    var _ = require('underscore');
    var util = {
        compareUrl : function(org, url){

        },
        find : function(list, url){

            return _.find(list, function(item){
                if(item.compareType === 'regExp')
                    return new RegExp(item.orgUrl).test(url);
                else
                    return url === item.orgUrl;
            })
        }
    }
    exports.cutil = util;
})()