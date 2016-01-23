/*
    输出一个promise
    res的时候＝符合拖拽条件
*/
import env from '../../lib/env'

//参数
var xOffset = 50,
    YDis = 180;
//鼠标状态
var stt;
var startX, startY;
export default () => {
    return new Promise((res, rej) => {
        if(document){
            document.addEventListener('mousedown', (e) => {
                stt = 1;
                startX = e.clientX;
                startY = e.clientY;
            }, true);   
            document.addEventListener('mouseup', (e) => {
                clear();
            }, true);   
            document.addEventListener('mousemove', (e) => {
                if(!stt){return;}
                //当前x轴offset
                var curOffsetX = Math.abs(e.pageX - startX);
                if (curOffsetX > 50) {
                    clear();
                    return;
                }
                if (e.clientY - startY >= YDis && e.clientY >= YDis) {
                    clear();
                    res({
                        x : e.clientX, 
                        y : e.clientY
                    });
                }
            }, true);   
        }
    });
}

function clear(){
    startX = startY = 0;
    stt = 0;
}