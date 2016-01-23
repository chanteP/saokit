/**
 * menu
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
THESEED.plugin.ui = function() {
    var that = {};
    var _root = document.getElementById('THESEED') || document.body || document.documentElement;
    var _ui;
    var UIprefix = 'THESEED_ui_';

    var UIFloatArr = [];

    var ui = {
        'alert' : function(opts) {
            var uiType = 'alert';
            var cont = {};
            // checkExist(uiType);
            opts = kit.merge({
                'title' : 'Alert',
                'cont' : '????',
                'btn' : [{
                    'type' : 'ok',
                    'text' : '确认',
                    'callback' : function(ui) {
                        ui.hide();
                    }
                }],
                'style' : {
                    'width' : '380px'
                },
                'nohr' : true
            }, opts);
            return cont.ui = uiFunc.createContBase(uiType, opts);
        },
        'confirm' : function(opts) {
            var uiType = 'alert';
            var cont = {};
            // checkExist(uiType);
            opts = kit.merge({
                'title' : 'Confirm',
                'cont' : '????',
                'btn' : [{
                    'type' : 'ok',
                    'text' : '确认',
                    'callback' : function(ui) {
                        ui.hide();
                    }
                }, {
                    'type' : 'cancel',
                    'text' : '取消',
                    'callback' : function(ui) {
                        ui.hide();
                    }
                }],
                'style' : {
                    'width' : '380px'
                },
                'nohr' : true
            }, opts);
            return cont.ui = uiFunc.createContBase(uiType, opts);
        },
        'tips' : function(opts) {
            var uiType = 'tips';
            var cont = {};
            // checkExist(uiType);
            opts = kit.merge({
                'title' : 'Tips',
                'cont' : '????',
                'btn' : [{
                    'type' : 'ok',
                    'text' : '了解',
                    'callback' : function(ui) {
                        ui.hide();
                    }
                }],
                'style' : {
                    'width' : '280px'
                },
                'nohr' : true
            }, opts);
            return cont.ui = uiFunc.createContBase(uiType, opts);
        },
        'info' : function(opts) {
            var uiType = 'info';
            var cont = {};
            // checkExist(uiType);
            opts = kit.merge({
                'title' : '\20',
                'cont' : '????',
                'close' : 1,
                'style' : {
                }
            }, opts);
            return cont.ui = uiFunc.createContBase(uiType, opts);
        },
        'frame' : function(opts) {
            var uiType = 'frame';
            var cont = {};
            // checkExist(uiType);
            opts = kit.merge({
                'title' : '\20',
                'titlePos' : 'left',
                'cont' : '????',
                'close' : 1,
                'style' : {
                }
            }, opts);
            return cont.ui = uiFunc.createContBase(uiType, opts);
        },
        'maskBase' : function() {

        },
        'maskUI' : function() {

        }
    };
    var uiFunc = {
        'createContBase' : function(uiType, opts) {
            if (!opts) {
                return;
            }
            var outer = document.createElement('section');
            outer.className = UIprefix + 'dialog' + ' ' + UIprefix + uiType;
            outer.optionPatch = opts;
            //有标题
            opts.title && uiFunc.buildPart.title(outer, opts.title);
            opts.title && !opts.nohr && outer.appendChild(document.createElement('hr'));
            //内容
            opts.cont && uiFunc.buildPart.cont(outer, opts.cont);
            //按钮
            opts.btn && opts.cont && !opts.nohr && outer.appendChild(document.createElement('hr'));
            opts.btn && uiFunc.buildPart.btn(outer, opts.btn);
            //关闭的x
            opts.close && uiFunc.buildPart.close(outer, opts.close);
            //样式
            if (opts.style) {
                for (var css in opts.style) {
                    outer.style[css] = opts.style[css];
                }
            }
            outer.show = uiFunc.show;
            outer.hide = uiFunc.hide;
            _ui.appendChild(outer);
            uiFunc.bindPartEvt(outer, opts);
            outer.style.display = 'none';
            return outer;
        },
        'buildPart' : {
            'title' : function(box, info) {
                var title = document.createElement('div');
                title.className = UIprefix + 'title';
                var h4 = document.createElement('h4');
                h4.innerHTML = info;
                box.optionPatch.titlePos && (h4.style.textAlign = box.optionPatch.titlePos);
                title.appendChild(h4);
                box.appendChild(title);
                box.head = title;
            },
            'cont' : function(box, info) {
                var cont = document.createElement('div');
                cont.className = UIprefix + 'cont';
                if (kit.is(info, 'DOM')) {
                    cont.appendChild(info);
                } else if (kit.is(info, String)) {
                    cont.innerHTML = (function(str) {
                        var contArr = str.split('\n');
                        var _p = '', i = 0;
                        while (contArr.length) {
                            _p += '<p>' + contArr.shift() + '</p>';
                        }
                        return _p;
                    })(info);
                }
                box.appendChild(cont);
                box.cont = cont;
            },
            'btn' : function(box, info) {
                var btn = document.createElement('div');
                btn.className = UIprefix + 'btnbox';
                for (var i = 0, j = info.length; i < j; i++) {
                    var _btn = document.createElement('div');
                    var _info = info[i];
                    _btn.className = UIprefix + 'btn ' + UIprefix + 'btn_' + _info.type;
                    _btn.innerHTML = _info.text;
                    (function(func) {
                        _btn.addEventListener('click', function() {
                            func(box)
                        }, false);
                    })(_info.callback);
                    btn.appendChild(_btn);
                }
                box.appendChild(btn);
                box.btn = btn;
            },
            'close' : function(box, info) {
                var close = document.createElement('div');
                close.className = UIprefix + 'close';
                close.innerHTML = '×';
                close.addEventListener('click', function() {
                    box.hide();
                }, false);
                box.appendChild(close);
                box.close = close;
            }
        },
        'bindPartEvt' : function(box, info) {
            box.head && !info.static && (function(dragEl, movebox) {
                // dragEl.onselectstart = function(e){e.stopPropagation();return false;}
                var _tx, _ty;
                kit.drag(dragEl, {
                    'down' : function(e) {
                        _tx = e.clientX - movebox.offsetLeft;
                        _ty = e.clientY - movebox.offsetTop;
                    },
                    'move' : function(e) {
                        movebox.style.left = (e.clientX - _tx) + 'px';
                        movebox.style.top = (e.clientY - _ty) + 'px';
                    },
                    'up' : function(e) {
                        _tx = _ty = null;
                    }
                });
            })(box.head, box);
        },
        'checkExist' : function(uiType) {
            return $('[uiType = ' + uiType + ']', _root)[0];
        },
        'show' : function(x, y) {
            var el = this;
            el.style.webkitTransform = 'scale(1,0)';
            el.style.display = 'block';
            uiFunc.setPos(el, x, y);
            setTimeout(function() {
                el.style.webkitTransform = 'scale(1,1)';
            }, 10);
            UIFloatArr.push(el);
        },
        'hide' : function(hideOnly) {
            var el = this;
            el.style.webkitTransform = 'scale(1,0)';
            el.style.boxShadow = 'none';
            setTimeout(function() {
                el.style.display = 'none';
                !hideOnly && kit.remove(el);
            }, 130);
            UIFloatArr.splice(UIFloatArr.indexOf(el), 1);
        },
        'setPos' : function(el, x, y) {
            var _sc = kit.winSize();
            el.style.top = (x !== undefined ? x : (_sc.height - el.scrollHeight) / 2) + 'px';
            el.style.left = (y !== undefined ? y : (_sc.width - el.scrollWidth) / 2) + 'px';
        }
    };
    var init = function() {
        _ui = document.createElement('div');
        _ui.className = 'THESEED_ui';
        _root.appendChild(_ui);
    }
    init();
    that = ui;
    that.clear = '';
    THESEED.plugin.ui = that;
}
THESEED.plugin.ui();
// THESEED.plugin.ui.alert();
// THESEED.plugin.ui.confirm().show();
