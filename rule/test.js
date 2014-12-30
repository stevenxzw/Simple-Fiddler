/**
 * Created by wen on 14/12/24.
 *
 */
exports.rule = [{
        orgUrl : 'gaofen.js',
        targetUrl : 'http://dev.myweb.com/gaofen.js',
        compareType : 'regExp',//正则匹配
        isReplace : true
    },{
    orgUrl : 'http://www.baidu.com/',
    targetUrl : 'http://dev.myweb.com/remote.js',
    compareType : 'compare',//全匹配
    isReplace : true
}];