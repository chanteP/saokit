/**
 * 插件数据传输用js
 *
 */
if (!THESEED) {
    var THESEED = {};
}
if (!THESEED.plugin) {
    THESEED.plugin = {};
}
THESEED.plugin.port = function(name, action) {
    var that = {};
    var link = chrome.extension.connect({
        'name' : name
    });

    var switchMsg = action || function() {};
    var newListener = function(port) {
        port.onMessage.addListener(function(data) {
            switchMsg(data, port);
            that.callback && that.callback(data);
        });
    }
    var portTrans = function(msg, id, callback) {
        that.callback = callback || null;
        if (!id) {
            link.postMessage(msg);
            // newListener(link);
        } else {
            var tablink = chrome.tabs.connect(id, {
                'name' : name
            });
            tablink.postMessage(msg);
            // newListener(tablink);
        }
    }
    chrome.extension.onConnect.addListener(function(port) {
        newListener(port);
    });

    THESEED.plugin.port = portTrans;
}