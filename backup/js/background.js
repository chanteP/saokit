/**
 * 后台脚本
 */
if (!THESEED) {
    var THESEED = {};
}
if (!THESEED.plugin) {
    THESEED.plugin = {};
}
THESEED.fn = {
    'switchMsg' : function(msg, port) {
        switch (msg.msg) {
            //书签
            case 'getbookmark' :
                chrome.tabs.getSelected(function(tab) {
                    chrome.bookmarks.getTree(function(bookmarkArr){
                        THESEED.plugin.port({
                            'msg' : 'getbookmark',
                            // 'data' : JSON.stringify(THESEED.plugin.config.get().bookmark)
                            'data' : bookmarkArr
                        },tab.id);
                    });
                });
                break;
            //截图
            case 'printScreen':
                chrome.tabs.getSelected(function(tab) {
                    chrome.tabs.captureVisibleTab(tab.windowId, {
                        'format' : 'png'
                    }, function(dataUrl) {
                        var _portMsg = {
                            'msg' : 'printScreen',
                            'data' : dataUrl,
                            'param' : msg
                        };
                        msg.show && (_portMsg.show = 'show');
                        THESEED.plugin.port(_portMsg, tab.id)
                    });
                });
                break;
        }
    },
    'context' : function() {
    }
};
//run
THESEED.plugin.port('background', THESEED.fn.switchMsg);
THESEED.fn.context();
