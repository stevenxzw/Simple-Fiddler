exports.rule=[
    {
        "id": 1,
        "targetUrl": "gaofen.js",
        "replaceWith": "http://dev.myweb.com/gaofen.js",
        "compareType": "regExp",
        "isChecked": true
    },
    {
        "id": 2,
        "targetUrl": "http://www.baidu.com/",
        "replaceWith": "http://dev.myweb.com/remote.js",
        "compareType": "compare",
        "isChecked": true
    },
    {
        "id": 4,
        "replaceWith": "2",
        "targetUrl": "1",
        "compareType": "compare",
        "isChecked": true
    },
    {
        "id": 5,
        "replaceWith": "22",
        "targetUrl": "11",
        "compareType": "compare",
        "isChecked": true
    }
]