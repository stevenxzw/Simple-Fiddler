/**
 * Created by wen on 14/12/24.
 *
 */
exports.rule = [{
        targetUrl : 'gaofen.js',
        replaceWith : 'http://dev.myweb.com/gaofen.js',
        compareType : 'regExp',//正则匹配
        isReplace : true
    },{
    targetUrl : 'http://www.baidu.com/',
    replaceWith : 'http://dev.myweb.com/remote.js',
    compareType : 'compare',//全匹配
    isReplace : true
}];