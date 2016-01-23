/**
 * 摄像头
 * opts:
 */
if (!THESEED) {
    var THESEED = {};
    THESEED.plugin = {};
} else if (!THESEED.plugin) {
    THESEED.plugin = {};
}
THESEED.plugin.userCamera = function() {
    var that = {};
    var prefix = 'THESEED_uc_';
    navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia);
    
    var cameraFrame;
    var mediaCan;
    var frame = {
        'create' : function() {
            var _d = document.createElement('div');
            mediaCan = document.createElement('video');
            mediaCan.autoplay = true;

            _d.className = prefix + 'box';
            _d.appendChild(mediaCan);

            frame.getMedia();
            return _d;
        },
        'getMedia' : function() {
            navigator.getUserMedia({
                'video' : true
            }, frame.media.succFunc, frame.media.errorFunc);
        },
        'media' : {
            'succFunc' : function(stream) {
                mediaCan.src = URL.createObjectURL(stream);
            },
            'errorFunc' : function() {

            }
        }
    }
    that.show = function() {
        THESEED.plugin.ui.frame({
            'title' : 'Camera',
            'cont' : frame.create(),
            'close' : 1,
            'style' : {
            },
            'btn' : [{
                'type' : 'func',
                'text' : '←→',
                'callback' : function(dom) {
                    dom.ltr = dom.ltr ? -dom.ltr : -1;
                    dom.cont.style.webkitTransform = 'scale('+ dom.ltr +',1)';
                }
            }, {
                'type' : 'cancel',
                'text' : 'X',
                'callback' : function(dom) {
                    dom.hide();
                }
            }]
        }).show();
    }
    THESEED.plugin.userCamera = that;
    THESEED.plugin.menu.add('kit', 'userCamera', {
        'index' : 8,
        'icon' : '',
        'text' : '摄像头',
        'desc' : '',
        'callback' : function() {
            that.show();
        }
    });
}
THESEED.plugin.userCamera();
