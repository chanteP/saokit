/**
 * 插件按钮列表
 */
// console.log(chrome);
(function($) {
    //port
    var ullist = document.getElementById('funclist');
    // console.log(wkCtSys.plugin.config.get())
    var config = THESEED.plugin.config.get() || {};
    //事件处理
    var eventFuns = {
        'createLi' : function(param) {
            var li = document.createElement('li');
            li.innerHTML = param.text;
            li.setAttribute('sort', param.sort);
            li.setAttribute('name', param.name);
            param.sort == 'option' && li.setAttribute('selected', +param.selected ? 1 : 0);
            ullist.appendChild(li);
            return li;
        },
        'toggleSlt' : function(el, paramname) {
            var bool = +!+el.getAttribute('selected');
            var _opts = config[paramname];
            _opts.stt = bool;

            el.setAttribute('selected', bool);

            THESEED.plugin.port({
                'msg' : 'setOpts',
                'plugin' : paramname,
                'opts' : _opts
            });
            // chrome.tabs.getCurrent(function(tab) {
            // chrome.pageAction.hide(tab.id);
            // });

            // setTimeout(function(){
            // chrome.pageAction.show(chrome.tabs.id);
            // },400)
            THESEED.plugin.port({
                'msg' : 'setStt',
                'plugin' : paramname,
                'stt' : bool
            });
        }
    };
    //按钮列表
    var btnlist = [
    // {
        // 'name' : 'index',
        // 'text' : '微刊首页',
        // 'sort' : 'redirect',
        // 'func' : function() {
            // // chrome.browserAction
            // window.open('http://kan.weibo.com', '_blank');
        // }
    // }, 
    {
        'name' : 'about',
        'text' : '关于',
        'sort' : 'about',
        'func' : function() {
            var _list = $('#funclist')[0];
            var _about = $('#about')[0];
            var body = document.body;
            body.style.cssText += 'width:400px;height:280px;';
            var _displayFunc = function() {
                _list.style.display = 'none';
                _about.style.display = 'block';
                body.removeEventListener('webkitTransitionEnd', _displayFunc, false);
            }
            body.addEventListener('webkitTransitionEnd', _displayFunc, false);
        }
    }];
    //初始化
    var init = function() {
        THESEED.plugin.port('pop', function(msg, port) {
        });
        for (var i = 0, j = btnlist.length; i < j; i++) {
            if (i && btnlist[i].sort !== btnlist[i - 1].sort) {
                ullist.appendChild(document.createElement('li'));
            }
            eventFuns.createLi(btnlist[i]).addEventListener('click', btnlist[i].func);
        }
    }
    init();
})($);
