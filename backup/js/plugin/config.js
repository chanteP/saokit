/**
 * 选项、配置
 */
if (!THESEED) {
    var THESEED = {};
    THESEED.plugin = {};
} else if (!THESEED.plugin) {
    THESEED.plugin = {};
}
THESEED.plugin.config = function() {
    //储存清单
    localStorage.clear();
    //{name:{def:默认值},...}
    var that = {};
    var optsList = {
        'menu' : {
            'stt' : 1
        },
        'bookmark' : {}
    };
    //基础get和set, 可能改调用chrome的storage的api
    that.set = function(newConfig) {
        // console.log(localStorage);
        localStorage.config = JSON.stringify(kit.merge(localStorage.config ? JSON.parse(localStorage.config) : null, newConfig));
    }
    that.get = function() {
        return localStorage.config ? JSON.parse(localStorage.config) : null;
    }
    var init = that.reset = function() {
        if (!localStorage.config) {
            that.set(optsList);
        }
    }
    init();
    THESEED.plugin.config = that;
}
THESEED.plugin.config();
