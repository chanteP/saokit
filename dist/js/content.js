/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _dragTrigger = __webpack_require__(2);

	var _dragTrigger2 = _interopRequireDefault(_dragTrigger);

	var _menu = __webpack_require__(4);

	var _menu2 = _interopRequireDefault(_menu);

	(0, _dragTrigger2['default'])().then(function (pos) {
	    console.log('show');
	    _menu2['default'].show(pos);
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    输出一个promise
	    res的时候＝符合拖拽条件
	*/
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _libEnv = __webpack_require__(3);

	var _libEnv2 = _interopRequireDefault(_libEnv);

	//参数
	var xOffset = 50,
	    YDis = 180;
	//鼠标状态
	var stt;
	var startX, startY;

	exports['default'] = function () {
	    return new Promise(function (res, rej) {
	        if (document) {
	            document.addEventListener('mousedown', function (e) {
	                stt = 1;
	                startX = e.clientX;
	                startY = e.clientY;
	            }, true);
	            document.addEventListener('mouseup', function (e) {
	                clear();
	            }, true);
	            document.addEventListener('mousemove', function (e) {
	                if (!stt) {
	                    return;
	                }
	                //当前x轴offset
	                var curOffsetX = Math.abs(e.pageX - startX);
	                if (curOffsetX > 50) {
	                    clear();
	                    return;
	                }
	                if (e.clientY - startY >= YDis && e.clientY >= YDis) {
	                    clear();
	                    res({
	                        x: e.clientX,
	                        y: e.clientY
	                    });
	                }
	            }, true);
	        }
	    });
	};

	function clear() {
	    startX = startY = 0;
	    stt = 0;
	}
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	/** track@alpha:{"version":"0.2.43","build":"2015-12-18 22:34:52","hash":""} */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = {
	    envList: ['browser', 'APP'],
	    env: (function () {
	        if (navigator.platform.indexOf('MacIntel') >= 0 || navigator.platform.indexOf('Win') >= 0) {
	            return 'browser';
	        } else if (navigator.userAgent.indexOf('webview') >= 0 || navigator.userAgent.indexOf('mtnb') >= 0) {
	            return 'APP';
	        }
	        return 'APP';
	    })(),
	    osList: ['Android', 'IOS', 'Mac', 'Window'],
	    os: (function () {
	        if (navigator.platform.indexOf('MacIntel') >= 0) {
	            return 'Mac';
	        }
	        if (navigator.platform.indexOf('Win') >= 0) {
	            return 'Window';
	        }
	        if (/\bAndroid\b/i.test(navigator.userAgent)) {
	            return 'Android';
	        }
	        if (/\bip[honead]+\b/i.test(navigator.userAgent)) {
	            return 'IOS';
	        }
	        return '';
	    })(),
	    osVersion: (function () {
	        var ua = navigator.userAgent;
	        var androidVer = /\bAndroid\s([\d|\.]+)\b/i.exec(ua);
	        if (androidVer) {
	            return androidVer[1];
	        }
	        var IOSVer = /\biPhone\sOS\s([\d\_]+)\s/i.exec(ua);
	        if (androidVer) {
	            return IOSVer[1];
	        }
	        //其他有什么用...
	        return null;
	    })(),
	    isLocalhost: (function () {
	        return (/\b(localhost|127.0.0.1)\b/i.test(location.host)
	        );
	    })(),
	    deviceLevel: (function () {
	        //基本操作都跑不起来的程度
	        if (!Object.defineProperty) {
	            return 0;
	        }
	        //渲染动画会卡的程度
	        else if (!history.pushState) {
	                return 2;
	            }
	        //业界良心等级
	        return 9;
	    })()
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var currentPos;
	var wrapper;
	exports['default'] = {
	    show: function show(pos) {
	        currentPos = pos;
	        React.render(buildUI(pos), getWrapper());
	        document.body.appendChild(getWrapper());
	    },
	    hide: function hide() {}
	};

	function getWrapper() {
	    if (wrapper) {
	        return wrapper;
	    }
	    wrapper = document.createElement('div');
	    wrapper.className = 'theseed';
	    return wrapper;
	}
	function buildUI(pos) {
	    return React.createElement(
	        'div',
	        { className: 'wrapper-pos', style: {
	                left: pos.x + 'px',
	                bottom: -pos.y + 'px',
	                maxHeight: pos.y - 10 + 'px'
	            } },
	        React.createElement(
	            'ul',
	            { className: 'menu menu-main' },
	            React.createElement(
	                'li',
	                { className: 'item item-main' },
	                React.createElement('em', { className: 'ti-eye' })
	            ),
	            React.createElement(
	                'li',
	                { className: 'item item-main' },
	                React.createElement('em', { className: 'ti-eye' })
	            ),
	            React.createElement(
	                'li',
	                { className: 'item item-main' },
	                React.createElement('em', { className: 'ti-eye' })
	            ),
	            React.createElement(
	                'li',
	                { className: 'item item-main' },
	                React.createElement('em', { className: 'ti-eye' })
	            ),
	            React.createElement(
	                'li',
	                { className: 'item item-main' },
	                React.createElement('em', { className: 'ti-eye' })
	            )
	        )
	    );
	}
	module.exports = exports['default'];

/***/ }
/******/ ]);