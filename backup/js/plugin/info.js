/**
 * menu - info
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
THESEED.plugin.info = function() {
    var that = {};
    var prefix = 'THESEED_info_'
    var menu = THESEED.plugin.menu;

    var infoFunc = {
        'setCallback' : function() {
            THESEED.plugin.menu.set('info', null, {
                'callback' : function() {
                    infoFunc.showInfo();
                }
            });
        },
        'showInfo' : function() {
            var infoBox = THESEED.plugin.ui.info({
                'title' : 'Info',
                'titlePos' : 'left',
                'cont' : infoFunc.buildCont()
            }).show(30,30);
        },
        'buildCont' : function() {
            var _tmpBox = document.createElement('div');
            var clock_local = document.createElement('time');
            // var clock_server = document.createElement('time');
            //class
            _tmpBox.className = prefix + 'box';
            //数字
            infoFunc.clock.local(clock_local);
            // clock_server.innerHTML = infoFunc.clock.server();
            //append
            _tmpBox.appendChild(clock_local);
            // _tmpBox.appendChild(clock_server);
            return _tmpBox;
        },
        'clock' : {
            'local' : function(dom) {
                var d = new Date();
                dom.innerHTML = d.toLocaleTimeString();
                setTimeout(function(){
                    dom && infoFunc.clock.local(dom);
                },500);
            },
            'server' : function() {
                var d = new Date();
                return d.toTimeString();
            }
        },
        'count' : function(){
            
        }
    };
    var init = function() {
        infoFunc.setCallback();
    };
    init();
    that.reset = init;
    that.save = '';
    that.recover = '';
    THESEED.plugin.info = that;
}
THESEED.plugin.info();
