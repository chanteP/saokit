/**
 * 页面注入用js - 截图层
 *  太糟糕了...
 * opts:
 */
if (!THESEED) {
    var THESEED = {};
    THESEED.plugin = {};
} else if (!THESEED.plugin) {
    THESEED.plugin = {};
}
THESEED.plugin.printScreen = function() {
    var opts = THESEED.config.printScreen || {
        'stt' : 1
    };
    var that = {};
    var node;
    var nodeDE;

    var prefix = 'THESEED_ps_';

    //页面大小
    var screenSize;
    //当前页数据
    var scData;
    //dom
    var bodyCanvas, bodyImg;
    var gird = {}, areaBorder = {}, area;
    var funcBox;

    //data罐子
    var base64Can;

    //鼠标状态，暂无使用
    var mouseStt;

    //按钮列表
    var funcBtnList = {
        'exit' : {
            'icon' : '',
            'title' : '退出',
            'text' : '退出',
            'callback' : function() {
                that.hide();
            },
            'stt' : function() {
                return true;
            }
        },
        'save' : {
            'icon' : '',
            'title' : '存为图片',
            'text' : '保存',
            'callback' : function() {
                if (!area || !area.w || !area.h) {
                    return;
                }
                var _d = new Date();
                var _formatTime = _d.toUTCString();
                that.getData().canvas.toBlob(function(blob) {
                    saveAs(blob, document.title + ' @ ' + _formatTime + '.png');
                }, "image/png");
            },
            'stt' : function() {
                if (!area) {
                    return;
                }
                return true;
            }
        },
        'reset' : {
            'icon' : '',
            'title' : '重新选定',
            'text' : '重置',
            'callback' : function(e) {
                that.reset();
            },
            'stt' : function() {
                if (area) {
                    return true;
                }
            }
        },
        'fullScreen' : {
            'icon' : '',
            'title' : '获取全屏',
            'text' : '全屏',
            'callback' : function(e) {
                that.getFullScreen();
            },
            'stt' : function() {
                if (area) {
                    return true;
                }
            }
        }
    }

    var resizeTimer;

    var eventFuns = {
        /**
         * resize
         */
        'fixResize' : function() {
            //TODO hide其他
            that.hide();
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function() {
                THESEED.plugin.port({
                    'msg' : 'printScreen',
                    'show' : 'show'
                });
                resizeTimer = null;
            }, 300);
        },
        /**
         * 初始化绑定
         */
        'initBind' : function() {
            var _tmpDown = function(e) {
                bindDOMFuns.buildGird(e.clientX, e.clientY);
            };
            var _tmpMove = function(e) {
                bindDOMFuns.anchorGirdSize(null, null, e.clientX, e.clientY);
            };
            var _tmpUp = function(e) {
                bindDOMFuns.checkArea();
            };
            eventFuns.dragmove(bodyCanvas, _tmpDown, _tmpMove, _tmpUp, 1);
        },
        /**
         * 单次拖动，drag不好使
         */
        'dragmove' : function(el, funcDown, funcMove, funcUp, once) {
            typeof funcDown !== 'function' && ( funcDown = function() {
            });
            typeof funcMove !== 'function' && ( funcMove = function() {
            });
            typeof funcUp !== 'function' && ( funcUp = function() {
            });

            var _func = {
                'mousedownFunc' : function(e) {
                    e.stopPropagation();
                    mouseStt = 'press';
                    funcDown(e);
                    kit.addEvent(document.body, 'mousemove', funcMove);
                    kit.addEvent(document.body, 'mouseup', _func.mouseupFunc);
                },
                'mouseupFunc' : function(e) {
                    e.stopPropagation();
                    mouseStt = null;
                    funcUp(e);
                    kit.removeEvent(document.body, 'mousemove', funcMove);
                    if (once) {
                        kit.removeEvent(el, 'mousedown', _func.mousedownFunc);
                        kit.removeEvent(document.body, 'mouseup', _func.mouseupFunc);
                    }
                }
            }
            kit.addEvent(el, 'mousedown', _func.mousedownFunc);
        },
        //TODO 待完成
        /**
         * 检查大小
         */
        'checkSize' : function() {
            if (!area) {
                return;
            }
            switch (true) {
                case kit.between(area.w, 8) && kit.between(area.h, 8) :
                    that.reset();
                    return false;
                default :
                    return true;
            }
        },
        /**
         * 获取截取部分data
         *
         *  太乱....可优化
         */
        'getBase64' : function(type) {
            var _c = document.createElement('canvas');
            var ctx = _c.getContext('2d');
            _c.style.display = 'none';
            _c.width = area.w;
            _c.height = area.h;

            var _tmpData = bodyCanvas.innerHTML;
            bodyCanvas.appendChild(_c);

            var _img = new Image();
            _img.src = scData;
            ctx.drawImage(_img, area.x, area.y, area.w, area.h, 0, 0, area.w, area.h);

            return {
                'canvas' : _c,
                'base64' : _c.toDataURL(type)
            };
        },
        /**
         *  全部不可选择
         * 选择太影响了
         */
        'unBindSelect' : function() {
            var _unbindArr = [bodyCanvas, area, funcBox];
            for (var index = _unbindArr.length - 1; index >= 0; index--) {
                try {
                    _unbindArr[index].onselectstart = function(e) {
                        e.stopPropagation();
                        return false;
                    }
                } catch(e) {
                }
            }
        }
    };
    var bindDOMFuns = {
        /**
         * 建立按钮 - 零件
         */
        'buildBtn' : function() {
            funcBox = document.createElement('div');
            funcBox.className = prefix + 'bodyCanvasFuncbtnBox';
            for (var func in funcBtnList) {
                var _btn = document.createElement('button');

                _btn.style.backgroundImage = funcBtnList[func].icon;
                _btn.title = funcBtnList[func].title;
                _btn.innerHTML = funcBtnList[func].text;

                funcBtnList[func].dom = _btn;
                !funcBtnList[func].stt() ? _btn.className = prefix + 'btnHide' : funcBtnList[func].on = 1;

                funcBox.appendChild(_btn);
                (function(btnInfo) {
                    kit.addEvent(btnInfo.dom, 'click', function(e) {
                        btnInfo.stt() && btnInfo.callback(e);
                        bindDOMFuns.checkBtn();
                    });
                })(funcBtnList[func]);
            }
            bodyCanvas.appendChild(funcBox);
        },
        /**
         *  切换显示
         */
        'checkBtn' : function() {
            for (var func in funcBtnList) {
                funcBtnList[func].dom.className = !!(funcBtnList[func].on = +funcBtnList[func].stt()) ? '' : prefix + 'btnHide';
            }
        },
        /**
         *  检查
         */
        'checkArea' : function() {
            if (area) {
                area.tx = area.ty = null;
                eventFuns.checkSize();
            }
            bindDOMFuns.checkBtn();
        },
        /**
         * 建立area - 零件
         */
        'buildGird' : function(x, y) {
            area = document.createElement('div');
            area.className = prefix + 'bodyCanvasArea';
            area.style.backgroundImage = ' url(' + scData + ')';

            areaBorder.lt = document.createElement('div');
            areaBorder.lt.className = prefix + 'top ' + prefix + 'left ' + prefix + 'bodyCanvasAreaCtlPnt ' + prefix + 'cursor_nw';
            areaBorder.rt = document.createElement('div');
            areaBorder.rt.className = prefix + 'top ' + prefix + 'right ' + prefix + 'bodyCanvasAreaCtlPnt ' + prefix + 'cursor_ne';
            areaBorder.rb = document.createElement('div');
            areaBorder.rb.className = prefix + 'bottom ' + prefix + 'right ' + prefix + 'bodyCanvasAreaCtlPnt ' + prefix + 'cursor_se';
            areaBorder.lb = document.createElement('div');
            areaBorder.lb.className = prefix + 'bottom ' + prefix + 'left ' + prefix + 'bodyCanvasAreaCtlPnt ' + prefix + 'cursor_sw';
            areaBorder.l = document.createElement('div');
            areaBorder.l.className = prefix + 'left ' + prefix + 'height ' + prefix + 'bodyCanvasAreaCtlBor ' + prefix + 'cursor_w';
            areaBorder.t = document.createElement('div');
            areaBorder.t.className = prefix + 'top ' + prefix + 'width ' + prefix + 'bodyCanvasAreaCtlBor ' + prefix + 'cursor_n';
            areaBorder.r = document.createElement('div');
            areaBorder.r.className = prefix + 'right ' + prefix + 'height ' + prefix + 'bodyCanvasAreaCtlBor ' + prefix + 'cursor_e';
            areaBorder.b = document.createElement('div');
            areaBorder.b.className = prefix + 'bottom ' + prefix + 'width ' + prefix + 'bodyCanvasAreaCtlBor ' + prefix + 'cursor_s';

            //控制事件
            bindDOMFuns.bindGirdDrag();

            //赋值定位
            area.x = x;
            area.y = y;
            area.w = area.h = 0;
            bindDOMFuns.setGirdSize();
            //扔进去
            for (var part in areaBorder) {
                area.appendChild(areaBorder[part]);
            }
            bodyCanvas.appendChild(area);

            eventFuns.unBindSelect();
        },
        /**
         * 设置area大小
         */
        'setGirdSize' : function() {
            if (!area) {
                return;
            }
            area.x = Math.min(Math.max(area.x, 0), screenSize.width - area.w);
            area.y = Math.min(Math.max(area.y, 0), screenSize.height - area.h);

            // if(!eventFuns.checkSize()){return;}

            var _cssStr = 'top:' + area.y + 'px;left:' + area.x + 'px;width:' + area.w + 'px;height:' + area.h + 'px;';
            area.style.cssText += _cssStr;
            area.style.backgroundPosition = '-' + area.style.left + ' -' + area.style.top;
        },
        /**
         * 锚点运算
         */
        'anchorGirdSize' : function(x1, y1, x2, y2, move) {
            if (!area) {
                return;
            }

            typeof area.tx != 'number' && (area.tx = typeof x1 === 'number' ? area.x + area.w : area.x);
            typeof area.ty != 'number' && (area.ty = typeof y1 === 'number' ? area.y + area.h : area.y);

            var _x = typeof x2 === 'number' ? x2 : x1;
            var _y = typeof y2 === 'number' ? y2 : y1;

            if (!move) {
                _x && (area.x = Math.min(_x, area.tx), area.w = Math.abs(_x - area.tx));
                _y && (area.y = Math.min(_y, area.ty), area.h = Math.abs(_y - area.ty));
            } else {
                area.x = x1;
                area.y = y1;
            }

            //设置大小
            bindDOMFuns.setGirdSize();
        },
        /**
         * 截取全屏用
         */
        'setGirdFullScreen' : function() {
            if (!area) {
                return;
            }
            area.x = 0;
            area.y = 0;
            area.w = screenSize.width;
            area.h = screenSize.height;

            area.style.webkitTransition = 'all .1s ease';
            area.addEventListener('webkitTransitionEnd', function() {
                area.style.webkitTransition = '';
            });

            bindDOMFuns.setGirdSize();
        },
        /**
         * 绘制页面图片
         */
        'drawfullweb' : function() {
            var dataArr = base64Can.dataArr;
            var _len = dataArr.length;
            var _count = 0;

            var _can = document.createElement('canvas');
            var _ctx = _can.getContext('2d');
            _can.width = screenSize.width;
            _can.height = dataArr[_len - 1].top + screenSize.height;
            //防止页面缩放变黑
            var _color = document.body.style.backgroundColor || '#fff';
            _ctx.fillStyle = _color;
            _ctx.fillRect(0, 0, _can.width, _can.height);

            //抓取
            for (var i = 0, j = _len; i < j; i++) {
                var _i = new Image();
                _i.src = dataArr[i].data;
                _i.top = dataArr[i].top;
                _i.onload = _i.onerror = function() {
                    _ctx.drawImage(this, 0, this.top);
                    _count++;
                    if (_count == _len) {
                        var _d = new Date();
                        var _formatTime = _d.toUTCString();
                        _can.toBlob(function(blob) {
                            saveAs(blob, document.title + ' @ ' + _formatTime + '.png');
                        }, "image/png");
                    }
                }
            }
        },
        /**
         * 拖动控制点
         */
        'bindGirdDrag' : function() {
            var dragFunc = eventFuns.dragmove;
            var anchorFunc = bindDOMFuns.anchorGirdSize;
            var endFunc = bindDOMFuns.checkArea;

            dragFunc(areaBorder.lt, null, function(e) {
                anchorFunc(e.clientX, e.clientY)
            }, endFunc);
            dragFunc(areaBorder.rt, null, function(e) {
                anchorFunc(null, e.clientY, e.clientX)
            }, endFunc);
            dragFunc(areaBorder.rb, null, function(e) {
                anchorFunc(null, null, e.clientX, e.clientY)
            }, endFunc);
            dragFunc(areaBorder.lb, null, function(e) {
                anchorFunc(e.clientX, null, null, e.clientY)
            }, endFunc);
            dragFunc(areaBorder.l, null, function(e) {
                anchorFunc(e.clientX)
            }, endFunc);
            dragFunc(areaBorder.t, null, function(e) {
                anchorFunc(null, e.clientY)
            }, endFunc);
            dragFunc(areaBorder.r, null, function(e) {
                anchorFunc(null, null, e.clientX)
            }, endFunc);
            dragFunc(areaBorder.b, null, function(e) {
                anchorFunc(null, null, null, e.clientY)
            }, endFunc);

            dragFunc(area, function(e) {
                area.tempOffsetX = e.clientX - area.x;
                area.tempOffsetY = e.clientY - area.y;
            }, function(e) {
                var _x1 = e.clientX - area.tempOffsetX;
                var _y1 = e.clientY - area.tempOffsetY;
                anchorFunc(_x1, _y1, null, null, true);
            }, function(e) {
                if(!area){return;}
                area.tempOffsetX = area.tempOffsetY = null;
                endFunc();
            });
        },
        /*
         * 建立画布，把相关的全部东西扔进去
         */
        'buildCanvas' : function() {
            if (bodyCanvas) {
                return;
            }
            bodyCanvas = document.createElement('div');
            bodyCanvas.className = prefix + 'bodyCanvas ' + prefix + 'bodyCanvasCover';

            bindDOMFuns.buildBtn();

            document.body.appendChild(bodyCanvas);

            eventFuns.initBind();
        },
        /*
         * 贴上截屏图片
         */
        'postScreen' : function() {
            bodyImg = new Image();
            bodyImg.src = scData;

            bodyImg.className = prefix + 'bodyCanvasImg';
            document.body.appendChild(bodyImg);
        }
    };
    //对外api
    that.show = function(imgData) {
        if (!imgData) {
            THESEED.plugin.port({
                'msg' : 'printScreen',
                'show' : 'show'
            });
        } else {
            that.hide();
            that.onshow = 1;
            document.documentElement.style.overflow = 'hidden';

            screenSize = kit.winSize();
            scData = imgData;
            bindDOMFuns.buildCanvas();
            bindDOMFuns.postScreen();

            kit.addEvent(window, 'resize', eventFuns.fixResize);
        }
    };
    that.hide = function() {
        if (!bodyCanvas) {
            return;
        }
        document.documentElement.style.overflow = '';

        bodyCanvas && kit.remove(bodyCanvas);
        bodyImg && kit.remove(bodyImg);

        scData = bodyCanvas = bodyImg = area = funcBox = null;
        gird = {}, areaBorder = {};

        kit.removeEvent(window, 'resize', eventFuns.fixResize);
        that.onshow = 0;
    };
    that.reset = function() {
        kit.remove(area);
        area = null;
        eventFuns.initBind();
    };
    that.getFullScreen = function() {
        bindDOMFuns.setGirdFullScreen();
    };
    that.saveAllWeb = function() {
        var fixMix = function(bool) {
            //遍历fix
            var ns = document.body;
            var changeFix = bool ? function(el) {
                if (window.getComputedStyle(el).position == 'fixed') {
                    el.style.position = 'absolute';
                    el.setAttribute(prefix + 'oriFixed', '1');
                }
            } : function(el) {
                if (el.getAttribute(prefix + 'oriFixed')) {
                    el.style.position = 'fixed';
                    el.removeAttribute(prefix + 'oriFixed');
                }
            };
            var checkChildren = function(el) {
                changeFix(el);
                if (el.children) {
                    for (var i = el.children.length - 1; i >= 0; i--) {
                        checkChildren(el.children[i]);
                    }
                }
            }
            checkChildren(ns);
        };

        fixMix(1);

        that.hide();

        var _oriST = document.body.scrollTop;
        var _tmpData = scData;
        //清空状态
        base64Can = {
            'dataArr' : [],
            'stt' : 1
        };
        document.documentElement.style.overflow = 'hidden';

        screenSize = kit.winSize();
        //循环，从头到页面底部
        var _winST = 0;
        var _scCount = 0;
        var _getScData = function() {
            document.body.scrollTop = _winST;
            setTimeout(function() {
                base64Can.count = ++_scCount;
                THESEED.plugin.port({
                    'msg' : 'printScreen',
                    'top' : document.body.scrollTop
                });
                if (document.body.scrollTop + document.documentElement.clientHeight == document.body.scrollHeight) {
                    document.documentElement.style.overflow = '';
                    base64Can.stt = 0;
                    setTimeout(function() {
                        fixMix(0);
                        document.body.scrollTop = _oriST;
                    }, 320);
                } else {
                    _winST += screenSize.height;
                    _getScData();
                }
            }, 200);
        }
        _getScData();
    };
    that.getScreenImg = function(msg) {
        var imgData = msg.data;
        if (!base64Can) {
            return;
        }
        base64Can.dataArr.push({
            'data' : imgData,
            'top' : msg.param.top
        });

        // console.log(base64Can.stt , base64Can.dataArr.length , base64Can.count)
        base64Can.stt === 0 && base64Can.dataArr.length === base64Can.count && bindDOMFuns.drawfullweb();
    };
    that.getData = eventFuns.getBase64;
    THESEED.plugin.menu.add('kit', 'printScreen', {
        'index' : 2,
        'icon' : '',
        'text' : '页面截图',
        'desc' : '',
        'callback' : function() {
            try{
                THESEED.plugin.menu.hide(
                    function(){
                        setTimeout(that.show,300);
                    }
                );
            }catch(e){
                that.show();
            }
        }
    });
    THESEED.plugin.menu.add('kit', 'saveWebPic', {
        'index' : 2,
        'icon' : '',
        'text' : '网页存为图片',
        'desc' : '',
        'callback' : function() {
            try{
                THESEED.plugin.menu.hide(that.saveAllWeb);
            }catch(e){
                that.saveAllWeb();
            }
        }
    });
    THESEED.plugin.printScreen = that;
}
THESEED.plugin.printScreen();
