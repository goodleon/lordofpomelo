require("./GameCode.js");
var CMajingBase_Exp = require("./CMajiangDoubleCard.js");
var g_ServeMathProxy = g_ServeMathProxy || {};


g_ServeMathProxy.getMajingBaseInstance = function() {
    if (null == g_ServeMathProxy.majingInstance) {
        g_ServeMathProxy.majingInstance = new CMajingBase_Exp()
    }
    return g_ServeMathProxy.majingInstance;
}

function TestServeJs() {
    g_ServeMathProxy.getMajingBaseInstance().TestHu()
}

TestServeJs()

//{"result":0,"pinfo":{"_id":869954,"uid":869954,"coin":0,"money":341,"appid":"com.coolgamebox.scmj","playNum":2197,"loginCode":"AG10rv","face":"avata:86","members":{},"sendTime":"2016-07-07T02:12:18.432Z","name":"VquO1J1N","email":"ozUH9w2QDci87Kzi2hFVAkLwnERk@weixin","openid":"osCVnv4v55a7itzZSzqYeVQ-gVak","nickname":"%u3001%u8FB2%u6751%u5A03.-","sex":1,"language":"zh_CN","city":"Jiulongpo","province":"Chongqing","country":"CN","headimgurl":"http://wx.qlogo.cn/mmopen/PiajxSqBRaEI4JNssicENST8lrLsFNdicIL5raQ1ibbNib8VbHSMzoozGjqLMc6ksbiaicfoeO0RvNlywE5UjodEtsjCA/0","privilege":[],"unionid":"ozUH9w2QDci87Kzi2hFVAkLwnERk","lType":"wx","resVersion":"1.216","app":{"appid":"com.coolgamebox.scmj","os":"iOS"},"__route__":"pkcon.handler.doLogin","appEnd":"scmj","remoteIP":"111.128.10. 16"},"gameInfo":{"majiang":{"round4":2,"round8":3},"scmj":{"round4":2,"round8":3}},"vipTable":2762050,"ingame":{"gameid":"scmj","roomid":"symj1","server":"pkroom2510"},"roomInfo":{"name":"symj1","scene":"","full":2,"type":"symj","removeLess":true,"reconnect":true,"vip":true}}