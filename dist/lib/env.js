/** track@alpha:{"version":"0.2.43","build":"2015-12-18 22:34:52","hash":""} */
export default {
    envList : ['browser', 'APP'],
    env : (() => {
        if(navigator.platform.indexOf('MacIntel') >= 0 || navigator.platform.indexOf('Win') >= 0){
            return 'browser';
        }
        else if(navigator.userAgent.indexOf('webview') >= 0 || navigator.userAgent.indexOf('mtnb') >= 0){
            return 'APP';
        }
        return 'APP';
    })(),
    osList : ['Android', 'IOS', 'Mac', 'Window'],
    os : (() => {
        if(navigator.platform.indexOf('MacIntel') >= 0){
            return 'Mac';
        }
        if(navigator.platform.indexOf('Win') >= 0){
            return 'Window';
        }
        if(/\bAndroid\b/i.test(navigator.userAgent)){
            return 'Android';
        }
        if(/\bip[honead]+\b/i.test(navigator.userAgent)){
            return 'IOS';
        }
        return '';
    })(),
    osVersion : (() => {
        var ua = navigator.userAgent;
        var androidVer = /\bAndroid\s([\d|\.]+)\b/i.exec(ua);
        if(androidVer){
            return androidVer[1];
        }
        var IOSVer = /\biPhone\sOS\s([\d\_]+)\s/i.exec(ua);
        if(androidVer){
            return IOSVer[1];
        }
        //其他有什么用...
        return null;
    })(),
    isLocalhost : (() => {
        return /\b(localhost|127.0.0.1)\b/i.test(location.host);
    })(),
    deviceLevel : (() => {
        //基本操作都跑不起来的程度
        if(!Object.defineProperty){
            return 0;
        }
        //渲染动画会卡的程度
        else if(!history.pushState){
            return 2;
        }
        //业界良心等级
        return 9;
    })()
}