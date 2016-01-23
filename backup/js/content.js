/**
 * 页面注入用js
 *
 * 貌似插件加载逻辑有点问题...
 */
if(!THESEED){
    var THESEED = {};
    THESEED.plugin = {};
}
else if(!THESEED.plugin){
    THESEED.plugin = {};
}
THESEED.config = {};
THESEED.ROOT = chrome.extension.getURL('/');
THESEED.fn = {
    'switchMsg' : function(msg, port) {
        switch(msg.msg){
            case 'getbookmark' :
                return msg.data;
                break;
            case 'printScreen' : 
                if(!THESEED.plugin.printScreen){return;}
                if(!THESEED.plugin.printScreen.show){return;}
                if(THESEED.plugin.printScreen.onshow){return;}
                if(msg.show){
                    THESEED.plugin.printScreen.show(msg.data);
                }
                else{
                    THESEED.plugin.printScreen.getScreenImg(msg);
                }
                break;
        }
    },
    'css' : {
        'load' : function(route, id) {
            if (!id || !document.getElementById(id)) {
                var l = document.createElement('link');
                l.type = "text/css";
                l.rel = "stylesheet";
                l.href = chrome.extension.getURL(route);
                l.id = id;
                (document.head || document.body).appendChild(l);
            }
        },
        'unload' : function(id) {
            var csslink = document.getElementById(id);
            csslink && (document.head || document.body).removeChild(csslink);
        }
    },
    'config' : {
        'set' : function(){
            
        },
        'get' : function(){
        }
    },
    'run' : function(){
    },
    'init' : function(){
        var _root = document.getElementById('THESEED');
        if(_root){
            return;
        }
        _root = document.createElement('section');
        _root.id = 'THESEED';
        (document.body || document.documentElement).appendChild(_root);
    }
};

THESEED.fn.init();
THESEED.plugin.port('cont',THESEED.fn.switchMsg);
THESEED.fn.config.get();
