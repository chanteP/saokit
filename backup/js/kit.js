/**
 *  np kit @chante
 *  ver 0.1.3
 *  last fix @ 121205
 */
var kit = {
    //const
    'emptyfunc' : function() {
    },
    //ani...还是用jquery的吧...
    'tween' : function(from, to, time, opts) {
        var tween = {};
        from = +from;
        to = +to;
        time = +time;
        opts = kit.merge({
            'obj' : {},
            'type' : 'cubic',
            'swing' : 'easeIn',
            'space' : 30,
            'anchor' : function(num) {
            },
            'end' : function() {
            }
        }, opts, 0);
        if (!Tween) {
            opts.anchor(to);
            opts.end();
            return;
        }
        var tweenFunc = opts.swing ? Tween()[opts.type][opts.swing] : Tween()[opts.type];
        var control, timer = 0, turn = 0, calc = Math.round(time / opts.space), _tmpcalc;
        var obj = opts.obj;
        if (from > to) {
            var t = to;
            to = from;
            from = t;
            turn = 1;
        }
        var aniFunc = function() {
            //奇怪的bug
            _tmpcalc = Math.min(Math.max(tweenFunc(timer++, from, to, calc), from), to);
            !turn ? opts.anchor(_tmpcalc) : opts.anchor(to + from - _tmpcalc);
            if (timer > calc) {
                opts.end();
                return;
            }
            control = setTimeout(aniFunc, opts.space);
        }
        aniFunc();
        tween.stop = function() {
            if (control) {
                clearTimeout(control);
                control = null;
            }
        }
        tween.play = function() {
            if (control) {
                return;
            }
            aniFunc();
        }
        tween.toEnd = function() {
            tween.stop();
            opts.anchor(to);
        }
        obj.tween = tween;
        return tween;
    },
    //event
    'addEvent' : function(obj, type, func, capture) {
        obj.addEventListener && (obj.addEventListener(type, func, capture), 1) || obj.attachEvent(type, func);
    },
    'removeEvent' : function(obj, type, func, capture) {
        obj.removeEventListener && (obj.removeEventListener(type, func, capture), 1) || obj.detachEvent(type, func);
    },
    'fixEvent' : function(e) {

    },
    'fixWindow' : function(el, min, force) {
        var fixFunc = function() {
            var winSize = kit.winSize();
            // el.style.width =
        }
    },
    'hover' : function(el, func, delay) {//func = {funcIn, funcOut} delay = {delayIn, delayOut}
        func = kit.merge({
            'funcIn' : null,
            'funcOut' : null
        }, func);
        delay = kit.merge({
            'delayIn' : 0,
            'delayOut' : 0
        }, delay);
        var timer, related, contains = kit.contains;
        var checkHover = function(e, callback, delay) {
            if (!contains(el, e.target)) {
                return;
            }
            related = e.relatedTarget;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function() {
                if (!related || (related !== el && !contains(el, related))) {
                    callback(e, el);
                }
            }, delay);
        }
        typeof func.funcIn === 'function' && kit.addEvent(el, 'mouseover', function(e) {
            checkHover(e, func.funcIn, delay.delayIn)
        });
        typeof func.funcOut === 'function' && kit.addEvent(el, 'mouseout', function(e) {
            checkHover(e, func.funcOut, delay.delayOut)
        });
    },
    'drag' : function(el, func, opts) {
        func = kit.merge({
            'down' : kit.emptyfunc,
            'move' : kit.emptyfunc,
            'up' : kit.emptyfunc
        }, func);
        opts = kit.merge({
            'button' : 0, //all,0,1,2
            'once' : false
        }, opts);
        var funcDown = func.down, funcMove = func.move, funcUp = func.up;
        var body = document.documentElement || document.body;
        el || ( el = body);

        var _func = {
            'mousedownFunc' : function(e) {
                if (opts.button !== 'all' && e.button !== opts.button) {
                    return;
                }
                funcDown(e);
                kit.addEvent(body, 'mousemove', funcMove);
                kit.addEvent(body, 'mouseup', _func.mouseupFunc);
                e.preventDefault();
            },
            'mouseupFunc' : function(e) {
                if (opts.button !== 'all' && e.button !== opts.button) {
                    return;
                }
                funcUp(e);
                kit.removeEvent(body, 'mousemove', funcMove);
                if (opts.once) {
                    kit.removeEvent(el, 'mousedown', _func.mousedownFunc);
                    kit.removeEvent(body, 'mouseup', _func.mouseupFunc);
                }
            }
        }
        kit.addEvent(el, 'mousedown', _func.mousedownFunc);
    },
    //dom
    'animateEnd' : function(dom, callback, once) {
        if (kit.browser('isLow')) {
            return callback();
        }
        var evtName;
        if (kit.browser('CHROME')) {
            evtName = 'webkitTransitionEnd';
        } else if (kit.browser('FIREFOX')) {
            evtName = 'transitionend';
        } else if (kit.browser('OPERA')) {
            evtName = 'oTransitionEnd';
        } else if (kit.browser('IE')) {
            evtName = 'MSTransitionEnd';
        }

        if (once) {
            var _cb = function() {
                callback();
                dom.removeEventListener(evtName, _cb, false);
            }
            dom.addEventListener(evtName, _cb, false);
        } else {
            dom.addEventListener(evtName, _cb, false);
        }
    },
    'remove' : function(dom) {
        dom.parentNode.removeChild(dom);
    },
    'contains' : function(root, el) {
        if (root.compareDocumentPosition)
            return root === el || !!(root.compareDocumentPosition(el) & 16);
        if (root.contains && el.nodeType === 1) {
            return root.contains(el) && root !== el;
        }
        while (( el = el.parentNode))
        if (el === root)
            return true;
        return false;
    },
    'parseNode' : function(node) {//获取node节点内所有node属性元素
        var nodes = {};
        var tmpNode;
        var recurFunc = function(dom, func) {
            if (!dom.tagName) {
                return;
            }
            func(dom);
            if (dom.children) {
                for (var i in dom.children) {
                    recurFunc(dom.children[i], func);
                }
            }
        }
        var getNode = function(dom) {
            if ( tmpNode = dom.getAttribute('node')) {
                nodes[tmpNode] = nodes[tmpNode] ? [].concat(nodes[tmpNode]).concat(dom) : dom;
            }
        }
        recurFunc(node, getNode);
        return nodes;
    },
    'position' : function(el) {
        return el.getBoundingClientRect && el.getBoundingClientRect();
    },
    //arr
    'queue' : function(index, len, offset) {
        return (index + len + offset) % len;
    },
    'inArray' : function(elem, array) {
        for (var i = 0, j = array.length; i < j; i++) {
            if (elem === array[i]) {
                return true;
            }
        }
        return false;
    },
    'deff' : function(arr1, arr2) {
        var _deff = [];
        var _same = [];
        var _t1, _t2;
        _t1 = kit.clone(arr1);
        _t2 = kit.clone(arr2);
        while (_t1.length) {
            var _el1 = _t1.shift();
            if (!_t2.length) {
                _deff.push(_el1);
                continue;
            }
            for (var j = _t2.length - 1; j >= 0; j--) {
                if (_el1 == _t2[j]) {
                    _same.push(_el1);
                    _t2.splice(_t2.indexOf(_t2[j]), 1);
                    break;
                } else if (!j) {
                    _deff.push(_el1);
                }
            }
        }
        if (_t1.length) {
            _deff = _deff.concat(_t1);
        }
        if (_t2.length) {
            _deff = _deff.concat(_t2);
        }
        return {
            'same' : _same,
            'deff' : _deff
        }
    },
    //string
    'trim' : function(obj) {
        if ( typeof obj == 'string') {
            return obj.trim ? obj.trim() : obj.replace(/^\s*/g, '').replace(/\s*$/g, '');
        }
        return obj;
    },
    'trimHTML' : function(str) {//简单过滤，待补充
        // var tags = /[^<>]+|<(\/?)([A-Za-z0-9]+)([^<>]*)>/g;
        var tags = /^(<[\w|:]+>)?([\s|\S]*)(<\/[\w|:]+>)?$/;
        var mt = str.match(tags);
        return {
            'tag' : []
        }
    },
    //obj
    'merge' : function(json1, json2, notdeep) {
        var json = json1 || {};
        for (var key in json2) {
            if (json[key] !== undefined && (kit.is(json2[key], Object) || kit.is(json2[key], Array)) && !notdeep) {
                kit.merge(json[key], json2[key]);
            } else {
                json[key] = json2[key];
            }
        }
        return json;
    },
    'clone' : function(obj) {//对象复制
        if (kit.is(obj, Array)) {
            var _a = [];
            for (var i = 0, j = obj.length; i < j; i++) {
                _a.push(obj[i]);
            }
            return _a;
        } else if (kit.is(obj, Object)) {
            return kit.merge({}, obj);
        }
        return obj;
    },
    'isEmptyObj' : function(obj) {
        for (var i in obj) {
            return false;
        }
        return true;
    },
    //util
    'is' : function(target, param) {
        switch (param) {
            case Array :
                return target instanceof Array;
            case String :
            case Number :
            case Function :
                return typeof target === param.name.toLowerCase();
            case Object :
                return target !== null && typeof target === 'object' && !kit.is(target, 'DOM');
            case 'DOM' :
                return target.nodeType || false;
            default :
                return target === param;
        }
    },
    'has' : function(obj, can, deep) {
        var tmpCan = [];
        if (kit.is(can, Array)) {
            if (!deep) {
                for (var i = 0, j = can.length; i < j; i++) {
                    if (can[i] === obj) {
                        return obj;
                    }
                }
                return false;
            } else {
                for (var i = 0, j = can.length; i < j; i++) {
                    if (can[i] === obj) {
                        tmpCan.push(obj);
                    }
                }
                if (tmpCan.length) {
                    return tmpCan;
                } else {
                    return false;
                }
            }
        } else if (kit.is(can, Object)) {
            var checkFunc = function(obj, can) {
                if ( obj in can) {
                    return can[obj];
                } else {
                    for (var key in can) {
                        if (kit.is(can[key], Object)) {
                            var _rs = checkFunc(obj, can[key]);
                            if (_rs) {
                                return _rs;
                            }
                        }
                    }
                }
            }
            return checkFunc(obj, can);
        }
    },
    'length' : function(param, opts) {
        opts = opts || {};
        if (kit.is(param, String)) {
            var _defCount = function(str) {
                var count = 0;
                for (var i = 0, j = param.length; i < j; i++) {
                    if (param[i].charCodeAt() > 255) {
                        count = count + 2;
                    } else {
                        count++;
                    }
                }
            }
            switch (true) {
                case !!opts.EN_CN :
                    return param.length;
                case !!opts.EN :
                    return _defCount(param);
                case !!opts.CN :
                    return _defCount(param) / 2;
            }
        }
        if (kit.is(param, Object)) {
            //偷懒中
        }
    },
    'winSize' : function() {
        var doc = document.documentElement;
        return {
            'width' : doc.clientWidth,
            'height' : doc.clientHeight
        };
    },
    'between' : function(num, area) {//数字, 是否在某个区间
        if ( typeof area === 'number') {
            return num >= 0 && num <= area;
        }
        if ( area instanceof Array) {
            return num >= area[0] && num <= area[1];
        }
        return false;
    },
    'browserPrefix' : function() {
        if (kit.browser('CHROME')) {
            return '-webkit-';
        } else if (kit.browser('FIREFOX')) {
            return '-moz-';
        } else if (kit.browser('OPERA')) {
            return '-o-';
        } else if (kit.browser('IE')) {
            return '-ms-';
        }
    },
    'browser' : function(param) {
        var ua = navigator.userAgent;
        var test = {//项目里搬的(╯﹏╰)b
            'IE' : /msie/i.test(ua),
            'OPERA' : /opera/i.test(ua),
            'MOZ' : /gecko/i.test(ua) && !/(compatible|webkit)/.test(ua),
            'IE5' : /msie 5 /i.test(ua),
            'IE55' : /msie 5.5/i.test(ua),
            'IE6' : /msie 6/i.test(ua),
            'IE7' : /msie 7/i.test(ua),
            'IE8' : /msie 8/i.test(ua),
            'IE9' : /msie 9/i.test(ua),
            'SAFARI' : !/chrome\/([\d.]*)/i.test(ua) && /\/([\d.]*) safari/.test(ua),
            'CHROME' : /chrome\/([\d.]*)/i.test(ua),
            'IPAD' : /\(ipad/i.test(ua),
            'IPHONE' : /\(iphone/i.test(ua),
            'ITOUCH' : /\(itouch/i.test(ua),
            'MOBILE' : /mobile/i.test(ua)
        }
        function msieversion() {
            var msie = ua.indexOf("MSIE ");
            if (msie > 0)// If Internet Explorer, return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
            else// If another browser, return 0
                return 99;
        }

        if ( param instanceof Array) {//判断数组
            for (var i = param.length - 1; i >= 0; i--) {
                //if(param[i] in test){//没有匹配的话还是放行好了...
                if (test[param[i]]) {
                    return true;
                }
                //}
            }
        } else if ( typeof param === 'string') {//ie的话true则返回版本
            if (/^ie$/i.test(param)) {
                return msieversion();
            } else if (/^isLow$/.test(param)) {//ie9以下,待补充
                return kit.browser('IE') < 9;
            } else if (/^html5$/.test(param)) {//支持html5部分特性
                try {
                    var list = [CanvasRenderingContext2D, history.pushState];
                    for (var i = list.length - 1; i >= 0; i--) {
                        if (!list[i]) {
                            return false;
                        }
                    }
                    return true;
                } catch(e) {
                    return false;
                }
            } else {
                return test[param];
            }
        }
    },
    'keyMap' : function(param) {
        var map = {
            8 : 'backspace',
            9 : 'tab',
            13 : 'enter',
            16 : 'shift',
            17 : 'ctrl',
            18 : 'alt',
            19 : 'pause',
            20 : 'capslock',
            27 : 'esc',
            32 : 'space',
            33 : 'pageup',
            34 : 'pagedown',
            35 : 'end',
            36 : 'home',
            37 : 'left',
            38 : 'up',
            39 : 'right',
            40 : 'down',
            45 : 'insert',
            46 : 'delete',
            91 : 'win',
            93 : 'menu',
            96 : 'num 0',
            97 : 'num 1',
            98 : 'num 2',
            99 : 'num 3',
            100 : 'num 4',
            101 : 'num 5',
            102 : 'num 6',
            103 : 'num 7',
            104 : 'num 8',
            105 : 'num 9',
            106 : '*',
            107 : '=',
            109 : '-',
            110 : '.',
            111 : '/',
            112 : 'f1',
            113 : 'f2',
            114 : 'f3',
            115 : 'f4',
            116 : 'f5',
            117 : 'f6',
            118 : 'f7',
            119 : 'f8',
            120 : 'f9',
            121 : 'f10',
            122 : 'f11',
            123 : 'f12',
            144 : 'numlock',
            145 : 'scrollclock',
            186 : ';',
            187 : '=',
            188 : ',',
            189 : '-',
            190 : '.',
            191 : '/',
            192 : '`',
            219 : '[',
            220 : '\\',
            221 : ']',
            222 : '\'',
            255 : 'fn',
        };
        if ( typeof param === 'number') {
            if ( param in map)
                return map[param];
            else if (/[A-Z0-9]/.test(String.fromCharCode(param)))
                return String.fromCharCode(param);
            else
                return false;
        }
        if ( typeof param === 'string') {
            for (var key in map) {
                if (map[key] == param)
                    return +key;
            }
            if (/[A-Z0-9]/.test(param))
                return param.charCodeAt();
            return false;
        }
    }
};
