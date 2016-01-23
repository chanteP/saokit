/** track@alpha:{"version":"0.3.11","build":"2016-01-24 01:04:37","hash":""} */
/*
    DOM扩展
*/
var parseEvtArgs = (...args) => {
    var params = {}, arg;
    for(var i = 0, j = args.length; i < j; i++){
        arg = args[i];
        if(typeof arg === 'string' && !params.evt){
            params.evt = arg;
        }
        else if(typeof arg === 'string' && !params.selector){
            params.selector = arg;
        }
        else if(typeof arg === 'function' && !params.callback){
            params.callback = arg;
        }
        else if(typeof arg === 'boolean' && !(params.capture)){
            params.capture = arg;
        }
    }
    return params;
}

var evtObject = {
    element : null,
    _add : function(evt, key, obj){
        if(!this._list){
            this._list = {};
        }
        this._list[evt] = this._list[evt] || {};
        this._list[evt][key] = this._list[evt][key] || [];
        this._list[evt][key].push(obj);
    },
    _remove : function(evt, key, check){
        if(!this._list || !this._list[evt] || !this._list[evt][key]){
            return;
        }
        var obj;
        for(var i = this._list[evt][key].length - 1; i >= 0; i--){
            obj = this._list[evt][key][i];
            if(check(obj)){
                this._list[evt][key].splice(i, 1);
            }
        }
    },
    _list : null,
    _each : function(evt, key, func){
        if(this._list && this._list[evt] && this._list[evt][key]){
            this._list[evt][key].forEach(func);
        }
    },
    on : function(...arg){
        var args = parseEvtArgs(...arg);
        var selector = args.selector,
            evt = args.evt,
            callback = args.callback,
            capture = args.capture;
        var element = this.element;
        if(!element){return this;}
        if(!$.isEventTarget(element)){
            this._add(evt, '@', callback);
            return this;
        }
        if(!selector){
            element.addEventListener(evt, callback, capture);
        }
        else{
            var cb = (e) => {
                var target = e.target;
                while(target && target !== element.parentNode){
                    if($.match(target, selector, element)){
                        callback.call(target, e);
                        return true;
                    }
                    target = target.parentNode;
                }
            }
            this._add(evt, selector, {
                cb : cb,
                func : callback
            });
            element.addEventListener(evt, cb, capture);
        }
        return this;
    },
    off : function(...arg){
        var args = parseEvtArgs(...arg);
        var selector = args.selector,
            evt = args.evt,
            callback = args.callback,
            capture = args.capture;
        var element = this.element;
        if(!element){return this;}
        if(!$.isEventTarget(element)){
            $._remove(evt, '@', function(obj){
                return obj === callback;
            });
            return this;
        }
        if(!selector){
            element.removeEventListener(evt, callback, capture);
        }
        else{
            this._remove(evt, selector, function(obj){
                if(!callback || obj.func === callback){
                    element.removeEventListener(evt, obj.cb, capture);
                    return true;
                }
            });
        }
        return this;
    }
}
var $ = {
    get : (data, ns) => {
        if(!ns){return data;}
        ns = ns.replace(/[\[|\]]/g, '.').replace(/(?:(?:^\.*)|\.{2,}|(?:\.*$))/g, '');
        var nsArr = ns.split('.'), key;
        while(nsArr.length){
            key = nsArr.shift();
            if(!data || typeof data !== 'object'){
                return undefined;
            }
            data = data[key];
        }
        return data;
    },
    set : (data, ns, value) => {
        if(typeof ns !== 'string'){return;}
        var nsArr = ns.split('.'), 
            key;
        while(nsArr.length > 1){
            key = nsArr.shift();
            if(!data[key] || typeof data[key] !== 'object'){
                data[key] = {};
            }
            data = data[key];
        }
        data[nsArr.pop()] = value;
    },
    merge : (...args) => {
        var resultObject, 
            currentObject;
        var checkHolder = typeof args[args.length - 1] === 'boolean';
        var hold = checkHolder && args[args.length - 1];
        resultObject = (checkHolder && hold) ? args[0] : {};
        for(var i = 0, j = args.length - +checkHolder; i < j; i++) {
            currentObject = args[i];
            if(typeof currentObject === 'object'){
                for(var key in currentObject){
                    if(currentObject.hasOwnProperty(key)){
                        resultObject[key] = currentObject[key];
                    }
                }
            }
        }
        return resultObject;
    },
    queryStringify : (obj, notEncode) => {
        if(typeof obj === 'string'){return obj;}
        var rs = [], key, val;
        for(var name in obj){
            if(!obj.hasOwnProperty(name)){continue;}
            key = notEncode ? name : encodeURIComponent(name);
            val = (obj[key] === undefined || obj[key] === null) ?
                '' :
                notEncode ? obj[key].toString() : encodeURIComponent(obj[key].toString());
            rs.push(key + '=' + val);
        }
        return rs.join('&');
    },
    queryParse : (str, notDecode) => {
        var rs = {};
        if(typeof str != 'string' || !str){
            return rs;
        }
        var rsArr = str.split('&'), unit, key, val;
        while(rsArr.length){
            unit = rsArr.pop().split('=');
            key = (notDecode ? unit[0] : decodeURIComponent(unit[0])).trim();
            val = unit[1] === undefined ? '' : (notDecode ? unit[1] : decodeURIComponent(unit[1])).trim();
            if(key in rs){
                rs[key] = [rs[key]];
                rs[key].push(val);
            }
            else{
                rs[key] = val;
            }
        }
        return rs;
    },
    querySearch : (...args) => {
        var key = args[0],
            value = args[1];
        if(args.length < 2){
            return $.queryParse(location.search.slice(1))[key];
        }
        else{
            var query = $.queryParse(location.search.slice(1));
            query[key] = value;
            return $.queryStringify(query);
        }
    },
    find : (selector, dom) => {
        return (dom || document).querySelector(selector);
    },
    findAll : (selector, dom) => {
        return (dom || document).querySelectorAll(selector);
    },
    contains : (root, el) => {
        if(root == el){return true;}
        return !!(root.compareDocumentPosition(el) & 16);
    },
    isNode : (value) => {
        return !!value && value.nodeType === 1;
    },
    firstElementChild : (outer) => {
        var target = outer.firstChild;
        while(target){
            if($.isNode(target)){
                return target;
            }
            target = target.nextSibling;
        }
        return null;
    },
    isEventTarget : (node) => {
        return node && node.addEventListener;
    },
    ancestor : (node, selector) => {
        while(node.parentNode){
            if($.match(node.parentNode, selector)){
                return node.parentNode;
            }
            node = node.parentNode;
        }
        return null;
    },
    create : (str) => {
        str = str.trim();
        if(str.slice(0, 1) === '<'){
            var template = document.createElement(str.slice(0, 3) === '<tr' ? 'tbody' : 'template');
            template.innerHTML = str;
            return $.firstElementChild(template.content ? template.content : template);
        }
        else{
            return document.createElement(str);
        }
    },
    remove : (node) => {
        if(node && node.parentNode){
            return node.parentNode.removeChild(node);
        }
    },
    match : (node, selector, context) => {
        var rs = $.findAll(selector, context);
        if(!rs){return false;}
        return [].indexOf.call(rs, node) >= 0;
    },
    listener : (element) => {
        element = element || window;
        if(element._evtObject){return element._evtObject;}
        element._evtObject = {element:element};
        element._evtObject.__proto__ = evtObject;
        return element._evtObject;
    },
    createEvent : (evtName, args) => {
        var e;
        try{
            e = new Event(evtName, $.merge({bubbles:true}, args || {}, true))
        }
        catch(err){
            e = document.createEvent('Event');
            // Define that the event name is 'build'.
            e.initEvent(evtName, true, true);
        }
        return e;
    },
    trigger : (element, evt, args) => {
        if(element && element.addEventListener){
            evt = typeof evt === 'string' ? 
                $.createEvent(evt, args) : 
                evt;
            element.dispatchEvent(evt);
        }
        else if(element._evtObject){
            element._evtObject._each(evt, '@', function(func){
                try{
                    func.apply(element, args);
                }
                catch(e){
                    console && console.log(e);
                }
            })
        }
    },
    channel : {
        topics : {},
        pub : (ch, args) => {
            $.trigger($.channel.topics, ch, args);
        },
        sub : (ch, func) => {
            $.trigger($.channel.topics).on(ch, func);
        },
        ubsub : (ch, func) => {
            $.trigger($.channel.topics).off(ch, func);
        }
    },
    domReady : ((doc) => {
        var readyList = [];
        doc.addEventListener('DOMContentLoaded', () => {
            while(readyList.length){
                readyList.pop()();
            }
        })
        return (func) => {
            if(doc.readyState === 'interactive' || doc.readyState === 'complete'){
                func();
            }
            else if(typeof func === 'function'){
                readyList.push(func);
            }
        }
    })(document),
    scrollTo : (pos, wrap, type) => {
        wrap = wrap || document.getElementById('wrapper') || document.body;
        var prop = 'scrollTop';
        if(Object.prototype.toString.call(pos) === '[object Array]'){
            prop = 'scrollLeft';
            pos = pos[0];
        }
        if(window.isNaN(pos)){return;}
        if(wrap.kitScrollAni){wrap.kitScrollAni.stop();}
        if($.tween){
            return wrap.kitScrollAni = $.tween({
                type : type || 'quart-easeout',
                begin: wrap[prop],
                end  : +pos,
                extra : [0.2],
                duration : 500,
                func : (num) => {
                    wrap[prop] = num;
                },
                endfunc : () => {
                    delete wrap.kitScrollAni;
                }
            });
        }
        else{
            wrap[prop] = pos;
        }
    },
    insertStyle : (css) => {
        var s = document.createElement('style');
        s.innerHTML = css;
        document.head.appendChild(s);
        return s;
    },
    load : (url, contentNode) => {
        var type = /\.([\w]+)$/.exec(url);
        type = type ? type[1] : '';
        typeof contentNode === 'string' && (type = contentNode, 1) && (contentNode = null);
        contentNode = contentNode || document.head;

        var returnValue;
        switch(type){
            case 'js' : 
                returnValue = document.createElement('script');
                returnValue.src = url;
                contentNode.appendChild(returnValue);
                break;
            case 'css' : 
                returnValue = document.createElement('link');
                returnValue.rel = 'stylesheet';
                returnValue.href = url;
                contentNode.appendChild(returnValue);
                break;
            case 'document' : 
                returnValue = document.createElement('iframe');
                returnValue.style.cssText = 'border:0;margin:0;padding:0;visibility:hidden;height:0;width:0;overflow:hidden;';
                returnValue.src = url;
                contentNode.appendChild(returnValue);
                break;
            default : 
                returnValue = new Image;
                returnValue.src = url;
                break;
        }
        return returnValue;
    }
}

$.domReady(function(){
    document.addEventListener('touchstart', () => {
        $.isTouched = true;
    })
    document.addEventListener('touchend', () => {
        $.isTouched = false;
    });
    document.addEventListener('touchcancel', () => {
        $.isTouched = false;
    }, true);
});
export default $
