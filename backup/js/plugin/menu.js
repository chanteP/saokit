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
THESEED.plugin.menu = function() {
    if (THESEED.config.menu && THESEED.config.menu.stt != 1) {
        return;
    }
    var _root = document.getElementById('THESEED') || document.body || document.documentElement;

    var that = {};

    var menuOn;
    //dom
    var menu, panel, funcbtn, col;
    var overTimer;
    var curLi, liHoverArr = [], liLeaveTimer;
    //鼠标动作配置
    var dragInfo = {
        //滑动距离
        'dist' : 180,
        //x轴修正
        'xFix' : 50,
        //最低高度
        'mintop' : 300
    }
    //菜单列表信息
    //根目录是按钮
    var menuInfo = {
        'info' : {
            'index' : 1,
            'icon' : 'info',
            'desc' : ''
        },
        'ui' : {
            'index' : 2,
            'icon' : 'ui',
            'desc' : '',
            'child' : {
                'alert' : {
                    'text' : 'alert',
                    'callback' : function() {
                        THESEED.plugin.ui.alert().show();
                    }
                },
                'confirm' : {
                    'text' : 'confirm',
                    'callback' : function() {
                        THESEED.plugin.ui.confirm().show();
                    }
                },
                'info' : {
                    'text' : 'info',
                    'callback' : function() {
                        THESEED.plugin.ui.info({
                            'style' : {
                                'width' : '300px',
                                'height' : '400px'
                            }
                        }).show();
                    }
                }
            }
        },
        'kit' : {
            'index' : 3,
            'icon' : 'kit',
            'desc' : ''
        },
        'bookmark' : {
            'index' : 6,
            'icon' : 'bookmark',
            'desc' : '',
            'panel' : {
            }
        },
        'config' : {
            'index' : 10,
            'icon' : 'config',
            'desc' : 'hide the menu',
            'callback' : function() {
                that.hide();
            }
        }
    }
    //
    var evtFunc = {
        'frame' : {
            'create' : function() {
                //主框架
                menu = document.createElement('div');
                menu.className = 'THESEED_menu';
                //按钮
                funcbtn = document.createElement('div');
                funcbtn.className = 'THESEED_func';
                //面板
                panel = document.createElement('div');
                panel.className = 'THESEED_panel';
                //列表
                col = document.createElement('div');
                col.className = 'THESEED_col';
                //添加栏目
                menu.appendChild(funcbtn);
                menu.appendChild(panel);
                menu.appendChild(col);

                //添加
                menu.col = col;
                evtFunc.menu.create();

                _root.appendChild(menu);
            },
            /**
             * 隐藏框架
             */
            'hide' : function(callback) {
                if (!menu) {
                    return;
                }
                menu.style.opacity = 0;
                liHoverArr = [];
                
                var _rootLi = $('.THESEED_menu .THESEED_col ul[list-for=root] > li');
                var _len = _rootLi.length;
                _rootLi.each(function(index, el) {
                    setTimeout(function() {
                        el.style.bottom = '600px';
                    }, index * 70);
                });
                kit.animateEnd(menu, function() {
                    menu && menu.parentNode.removeChild(menu);
                    menu = null;
                    kit.is(callback, Function) && callback();
                }, 1);
            },
            /**
             * 显示框架
             */
            'show' : function(x, y) {
                if (menu) {
                    return;
                }
                //设置位置
                var winsize = kit.winSize();
                evtFunc.frame.create();
                $('[list-for=root]').css({
                    'opacity' : '1',
                    'display' : 'block'
                });
                setTimeout(function() {
                    menu.style.opacity = 1;
                    menu.style.bottom = (winsize.height - y) + 'px';
                    menu.style.right = (winsize.width - x) + 'px';

                    var _rootLi = $('.THESEED_menu .THESEED_col ul[list-for=root] > li');
                    var _len = _rootLi.length;
                    _rootLi.each(function(index, el) {
                        setTimeout(function() {
                            $(el).css({
                                'bottom' : '0'
                            });
                        }, (_len - index - 1) * 70);
                    });
                }, 0);
            }
        },
        'menu' : {
            'create' : function() {
                evtFunc.menu.buildCol('root', menuInfo);
            },
            //ul
            'buildCol' : function(forName, list) {
                var _ul = document.createElement('ul');
                _ul.setAttribute('list-for', forName);
                if (forName !== 'root') {
                    _ul.setAttribute('scroll-target', '1');
                }

                for (var key in list) {
                    evtFunc.menu.buildList(_ul, key, list[key]);
                }

                menu.col.appendChild(_ul);
            },
            //panel
            'buildPan' : function(forName, dom) {
                if (!dom || !dom.nodeType) {
                    return;
                }
                dom.setAttribute('panel-for', forName);
                menu.col.appendChild(dom);
            },
            //li
            'buildList' : function(parent, name, info) {
                var _li = document.createElement('li');

                evtFunc.menu.setListAttr(_li, name, info);
                _li.setAttribute('list-name', name);
                //TODO index顺序
                parent.appendChild(_li);
                if (info.child || info.panel) {
                    info.child && evtFunc.menu.buildCol(name, info.child);
                    info.panel && evtFunc.menu.buildPan(name, info.panel);
                }
                evtFunc.menu.bindList(_li, name, info);
                if (info.callback) {
                    _li.addEventListener('click', info.callback, false);
                }
                if (info.contextmenu) {
                    _li.addEventListener('contextmenu', info.contextmenu, false);
                }
            },
            /**
             * 属性设置
             */
            'setListAttr' : function(liEl, name, info) {
                //选项文本
                if (info.text !== undefined) {
                    //好像记得有个css是加...的......
                    (function(el, info) {
                        var _text = info.text;
                        var _len = 10;
                        var _suff = '';
                        var _unknownText = '???????????????';
                        var _textCount = _len * 2, _index = 0;
                        if (_text) {
                            while (_textCount > 0 && _text[_index]) {
                                _text[_index].charCodeAt() > 255 ? _textCount = _textCount - 2 : _textCount--;
                                _index++;
                            }
                            if (_index > _len) {
                                _suff = '...';
                                el.title = _text;
                            }
                            if (info.href) {
                                el.innerHTML = '<a href="' + info.href + '" target="_blank">' + _text.substr(0, _index) + _suff + '</a>';
                            } else {
                                el.innerHTML = _text.substr(0, _index) + _suff;
                            }
                        } else {
                            el.innerHTML = _unknownText;
                        }
                    })(liEl, info);
                }
                //icon
                //懒得切图片做sprite了..../image/xx.png && xx_hover.png
                if (info.icon) {
                    liEl.icon = info.icon;
                    liEl.style.backgroundImage = 'url(' + THESEED.ROOT + 'image/icon/' + liEl.icon + '.png)';
                }
            },
            /**
             * li
             * hover事件绑定
             */
            'bindList' : function(liEl, name, info) {
                if (!menu || !menu.col) {
                    return;
                }
                liEl.listname = name;
                liEl.show = function() {
                    evtFunc.menu.toggleLiInfo(this, this.listname, 1);
                }
                liEl.hide = function() {
                    evtFunc.menu.toggleLiInfo(this, this.listname, 0);
                }
                kit.hover(liEl, {
                    'funcIn' : function(e, el) {
                        evtFunc.menu.checkListLink(el, name, 1);
                    },
                    'funcOut' : function(e, el) {
                        evtFunc.menu.checkListLink(el, name, 0);
                    }
                }, {
                    'delayIn' : 100,
                    'delayOut' : 103
                });
            },
            //每次hover都检测上下级
            'checkListLink' : function(el, elName, stt) {
                if(liLeaveTimer){
                    clearTimeout(liLeaveTimer);
                    liLeaveTimer = null;
                }
                var _getChain = function(liEl) {
                    var _arr = [];
                    var _listFor;
                    while (liEl && ( _listFor = liEl.parentNode.getAttribute('list-for'))) {
                        _arr.push(liEl);
                        liEl = $('[list-name=' + _listFor + ']', menu.col)[0];
                    }
                    return _arr;
                }
                //显示
                if (stt) {
                    curLi = el;
                    var _showArr = _getChain(el);
                    var _ctlArrObj = kit.deff(_showArr, liHoverArr);

                    for (var i = _ctlArrObj.deff.length - 1; i >= 0; i--) {
                        if (!kit.inArray(_ctlArrObj.deff[i], _showArr)) {
                            _ctlArrObj.deff[i].hide();
                        } else {
                            _ctlArrObj.deff[i].show();
                        }
                    }
                    liHoverArr = _showArr;
                }
                //完全离开 
                else if(curLi == el) {
                    try{
                        if(el.parentNode.getAttribute('list-for') == 'root' && !$('[list-for='+el.listname+']',menu.col).length){
                            curLi = null;
                            el.hide();
                            liHoverArr = [];
                        }
                        else{
                            liLeaveTimer = setTimeout(function(){
                                curLi = null;
                                while(liHoverArr.length){
                                    liHoverArr.pop().hide();
                                }
                            },3000);
                        }
                    }catch(e){
                        //col
                    }
                }
            },
            //上下级，panel的toggle
            'toggleLiInfo' : function(el, name, stt) {
                if(!menu){return;}
                var _childUl = $('ul[list-for='+name+']',menu.col)[0];
                var _childPanel = $('[panel-for='+name+']',menu.col)[0];
                
                var _setIconArr = function(el, url) {
                    el.style.backgroundImage = 'url(' + THESEED.ROOT + 'image/icon/' + url + '.png)';
                }
                var _togglePart = function(name, fix, stt) {
                    if (!name) {
                        return;
                    }
                    var _commFunc = function(el) {
                        el.style.display = stt ? 'block' : 'none';
                        setTimeout(function(){
                            el.style.opacity = +stt;
                        },0);
                        el.style.top = (fix.top - .5 * el.clientHeight + .5 * fix.height) + 'px';
                    }
                    if (_childUl) {
                        _commFunc(_childUl);
                        _childUl.style.left = (fix.left - _childUl.clientWidth - 36) + 'px';
                    }
                    if (_childPanel) {
                        _commFunc(_childPanel);
                        _childPanel.style.left = (fix.left + fix.width + 7) + 'px';
                    }
                }
                //好像有个toggle...
                _childUl && $(el)[stt ? 'addClass' : 'removeClass']('on');
                el.icon && _setIconArr(el, stt ? el.icon + '_hover' : el.icon);
                
                var _pos = kit.position(el);
                _togglePart(name, _pos, stt);
            }
        }
    };
    var bindFunc = {
        //api
        'showMenu' : function(x, y) {
            menuOn = 1;
            evtFunc.frame.show(x, y);
            //隐藏计时
            var resetTimerFunc = function(stt) {
                //带stt表示删除计时
                if (overTimer) {
                    clearTimeout(overTimer);
                    overTimer = null;
                }
                if (!stt) {
                    overTimer = setTimeout(that.hide, 10000);
                }
            };
            resetTimerFunc();
            menu.addEventListener('mouseover', function() {
                resetTimerFunc(1)
            }, false);
            menu.addEventListener('mouseout', function() {
                resetTimerFunc()
            }, false);
            //滚动限制
            menu.addEventListener('mousewheel', function(e) {
                e.preventDefault();
                var _target = e.target;
                while ((!_target.getAttribute || !_target.getAttribute('scroll-target')) && _target != menu) {
                    _target = _target.parentNode;
                }
                if (_target == menu) {
                    return;
                } else {
                    _target.scrollTop -= 47 * Math.abs(e.wheelDelta) / e.wheelDelta;
                }
            }, false);
        },
        'hideMenu' : function(callback) {
            if (menuOn === 0) {
                return;
            }
            menuOn = 0;
            evtFunc.frame.hide(callback);
        },
        /**
         * 外接菜单
         */
        'add' : function(parent, name, info) {//接入节点，菜单名，菜单信息
            if (!parent || parent === 'root') {
                menuInfo[name] = info;
            } else {
                var parentCol = kit.has(parent, menuInfo);
                if (parentCol) {
                    parentCol.child || (parentCol.child = {});
                    parentCol.child[name] = info;
                }
            }
        },
        'set' : function(name, index, attr) {//
            var menuCol = kit.has(name, menuInfo);
            index = +index || 0;
            if (menuCol) {
                for (var key in attr) {
                    menuCol[key] = attr[key];
                }
            }
        },
        //出现条件
        'checkDrag' : function() {
            var start = {};
            var dist = dragInfo.dist;
            var mintop = dragInfo.mintop;
            var val = 0;
            kit.drag(null, {
                'down' : function(e) {
                    val = 1;
                    start.x = e.clientX;
                    start.y = e.clientY;
                },
                'move' : function(e) {
                    if (val === 0) {
                        return;
                    }
                    if (!kit.between(Math.abs(e.pageX - start.x), dragInfo.xFix)) {
                        val = 0;
                        return;
                    }
                    if (e.clientY - start.y >= dist && e.clientY >= mintop) {
                        val = 0;
                        var _tmpShowFunc = function(e) {
                            that.show(e.clientX, e.clientY);
                            document.documentElement.removeEventListener('mouseup', _tmpShowFunc, false);
                        };
                        document.documentElement.addEventListener('mouseup', _tmpShowFunc, false);
                    }
                },
                'up' : function(e) {
                    val = 0;
                    start = {};
                }
            }, {
                'button' : 2
            });
        },
        'checkContext' : function(e) {
            menuOn && e.preventDefault();
        }
    };
    var init = function() {
        bind();
    };
    var bind = function() {
        bindFunc.checkDrag();
        kit.addEvent(document.documentElement, 'contextmenu', bindFunc.checkContext);
    };
    init();
    that.show = bindFunc.showMenu;
    that.hide = bindFunc.hideMenu;
    that.add = bindFunc.add;
    that.set = bindFunc.set;
    that.list = menuInfo;
    that.ui = THESEED.plugin.ui;
    THESEED.plugin.menu = that;
}
THESEED.plugin.menu();
