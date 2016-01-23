/**
 * menu - bookmark
 * SAO ver.
 *
 * menu info {
 *      index
 *      icon
 *      desc
 *      callback / child
 * }
 */
if (!THESEED) {
    var THESEED = {};
}
if (!THESEED.plugin) {
    THESEED.plugin = {};
}
THESEED.plugin.bookmark = function() {
    var that = {};
    var menu = THESEED.plugin.menu;
    var bookmarkInfo;
    var favInfo;

    var bookmarkFunc = {
        'formatData' : function(parent, data) {
            var _name = 'bookmark' + data.id;
            var _info = {
                'index' : data.id,
                'text' : data.title,
                'dateAdded' : data.dateAdded
            };
            if (!data.children) {
                _info.icon = 'document';
                _info.href = data.url;
            }
            menu.add(parent, _name, _info);
            if (data.children) {
                for (var i = 0, j = data.children.length; i < j; i++) {
                    bookmarkFunc.formatData(_name, data.children[i]);
                }
            }
        },
        
        'formatData' : function(parent, data) {
            var _name = 'bookmark' + data.id;
            var _info = {
                'index' : data.id,
                'text' : data.title,
                'dateAdded' : data.dateAdded
            };
            if (!data.children) {
                _info.icon = 'document';
                _info.href = data.url;
            }
            // menu.add(parent, _name, _info);
            if (data.children) {
                _info.child = {};
                for (var i = 0, j = data.children.length; i < j; i++) {
                    bookmarkFunc.formatData(_info.child, data.children[i]);
                }
            }
            parent[_name] = _info;
        }
    };

    var bookmarkMenu = {
        'setBookmark' : function(data) {
            if (!menu) {
                return;
            }
            var _child = data.children[0].children;
            var _tmpBookmark = {};
            //重复了...
            for (var i = 0, j = _child.length; i < j; i++) {
                bookmarkFunc.formatData(_tmpBookmark, _child[i]);
            }
            menu.set('bookmark', null, {'child': _tmpBookmark});
        },
        'contextmenu' : function() {
            // THESEED.plugin.menu.set('bookmark', null, {
                // 'panel' : (function() {
                    // var _el = THESEED.plugin.ui.info({
                        // 'style' : {
                            // 'width' : '300px',
                            // 'height' : '180px'
                        // },
                        // 'nohr' : 1
                    // });
                    // $(_el).addClass('forPanel');
                    // return _el;
                // })()
            // });
        }
    };
    var init = function() {
        THESEED.plugin.port({
            'msg' : 'getbookmark'
        }, null, function(data) {
            bookmarkMenu.setBookmark(data.data[0]);
            bookmarkMenu.contextmenu();
        });
    };
    init();
    that.reset = init;
    that.save = '';
    that.recover = '';
    THESEED.plugin.bookmark = that;
}
THESEED.plugin.bookmark();
