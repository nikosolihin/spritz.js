/*!
* spritz.js 2.2.0 - Modern and delightful sprites animation library for JavaScript!
*
* @author       maoosi <hello@sylvainsimao.fr>
* @homepage     https://github.com/maoosi/spritz.js
* @copyright    Copyright (c) 2017 maoosi <hello@sylvainsimao.fr>
* @license      MIT
* @version      2.2.0
*/
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):t.Spritz=i()}(this,function(){"use strict";var t=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},i=function(){function i(t,i){return a[t]=a[t]||[],a[t].push(i),this}function e(t,e){return e._once=!0,i(t,e),this}function n(t){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return i?a[t].splice(a[t].indexOf(i),1):delete a[t],this}function r(t){for(var i=this,e=arguments.length,r=Array(e>1?e-1:0),s=1;s<e;s++)r[s-1]=arguments[s];var h=a[t]&&a[t].slice();return h&&h.forEach(function(e){e._once&&n(t,e),e.apply(i,r)}),this}var s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=Object.create(null);return t({},s,{on:i,once:e,off:n,emit:r})},e=function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")},n=function(){function t(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(i,e,n){return e&&t(i.prototype,e),n&&t(i,n),i}}(),r=function(){function t(){e(this,t),this.waitQueue=[],this.waitExecution=!1}return n(t,[{key:"handle",value:function(t,i){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return this.waitQueue.push({func:i,timeout:this._isAsyncFunc(i)?"async":e}),this.waitExecution||this._next(),t}},{key:"pause",value:function(t,i){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){};return this.handle(t,e,i)}},{key:"_isAsyncFunc",value:function(t){return t.toString().search("done()")>-1}},{key:"_exec",value:function(t){var i=this;t.call(this,function(){i._next()})}},{key:"_next",value:function(){var t=this;if(this.waitQueue.length>0){this.waitExecution=!0;var i=this.waitQueue.shift(),e=i.func,n=i.timeout;"async"===n?this._exec(e):n!==!1?(this._exec(e),setTimeout(function(){t._next()},n)):(this._exec(e),this._next())}else this.waitExecution=!1}}]),t}(),s=function(){for(var t=arguments.length,i=Array(t),e=0;e<t;e++)i[e]=arguments[e];return new(Function.prototype.bind.apply(r,[null].concat(i)))},a=function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")},h=function(){function t(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(i,e,n){return e&&t(i.prototype,e),n&&t(i,n),i}}(),o=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return a(this,t),this.options={picture:n.picture||[],steps:n.steps||1,rows:n.rows||1,init:"undefined"!=typeof n.init?n.init:1,testunit:n.testunit||!1},Array.isArray(this.options.picture)||(this.options.picture=[this.options.picture]),this.selector="string"==typeof e?document.querySelector(e):e,this.emitter=i(),this.waitter=s(),this.supportsWebP=this._supportsWebP(),this.initiated=!1,this.options.init>0?this.init(this.options.init):this}return h(t,[{key:"_globalVars",value:function(){this.canvas=!1,this.ctx=!1,this.loaded=!1,this._resetUntil(),this.anim=!1,this.columns=Math.ceil(this.options.steps/this.options.rows),this.currentFps=15,this.flipped=!1}},{key:"_throttle",value:function(t,i){var e=this,n=arguments,r=void 0,s=void 0;return function(){var a=e,h=+new Date,o=n;r&&h<r+i?(clearTimeout(s),s=setTimeout(function(){r=h,t.apply(a,o)},i)):(r=h,t.apply(a,o))}}},{key:"_bindEvents",value:function(){var t=this;this.resize=this._throttle(function(){t._resize()},250),window.addEventListener("resize",this.resize,!1)}},{key:"_unbindEvents",value:function(){window.removeEventListener("resize",this.resize,!1)}},{key:"_resize",value:function(){this._loadPicture(),this.emitter.emit("resize",this.pic)}},{key:"init",value:function(){var t=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.waitter.handle(this,function(){t.initiated||(t.initialStep=i,t.currentStep=i,t._globalVars(),t._bindEvents(),t._createCanvas(),t._loadPicture(),t.initiated=!0,t.emitter.emit("ready"))})}},{key:"destroy",value:function(){var t=this;return this.waitter.handle(this,function(){t.initiated&&(t.stop(),t._unbindEvents(),t.canvas.parentNode.removeChild(t.canvas),t.container.parentNode.removeChild(t.container),t.canvas=!1,t.ctx=!1,t.initiated=!1,t.emitter.emit("destroy"),t.emitter.off("ready"),t.emitter.off("destroy"),t.emitter.off("resize"),t.emitter.off("play"),t.emitter.off("load"),t.emitter.off("change"),t.emitter.off("wait"),t.emitter.off("flip"),t.emitter.off("pause"),t.emitter.off("stop"))})}},{key:"play",value:function(){var t=this,i=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return this.waitter.handle(this,function(){t.animDirection="backward"===i?"backward":"forward",t._startAnimation(),t.emitter.emit("play",t.animDirection)})}},{key:"playback",value:function(){var t=this;return this.waitter.handle(this,function(){t.animDirection="backward",t._startAnimation(),t.emitter.emit("play",t.animDirection)})}},{key:"pause",value:function(){var t=this,i=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return this.waitter.handle(this,function(){t._pauseAnimation(),i||t.emitter.emit("pause")})}},{key:"stop",value:function(){var t=this;return this.waitter.handle(this,function(){t.pause(!0),t.step(t.initialStep),t.emitter.emit("stop")})}},{key:"wait",value:function(){var t=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return this.waitter.handle(this,function(){t.emitter.emit("wait",i)},i)}},{key:"step",value:function(){var t=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.waitter.handle(this,function(){var e=t.currentStep;t.currentStep=i,t._draw(),t.emitter.emit("change",e,t.currentStep)})}},{key:"fps",value:function(t){var i=this;return this.waitter.handle(this,function(){i.currentFps=t})}},{key:"until",value:function(t){var i=this,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return this.waitter.handle(this,function(){i.stopAtStep=t,i.stopAtLoop=e})}},{key:"next",value:function(){var t=this;return this.waitter.handle(this,function(){t.animDirection="forward";var i=t.currentStep;t.currentStep=t._targetStep(),t._draw(),t.emitter.emit("change",i,t.currentStep)})}},{key:"prev",value:function(){var t=this;return this.waitter.handle(this,function(){t.animDirection="backward";var i=t.currentStep;t.currentStep=t._targetStep(),t._draw(),t.emitter.emit("change",i,t.currentStep)})}},{key:"get",value:function(t){var i=this,e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return this.waitter.handle(this,function(){switch(t){case"step":return e!==!1?e.call(i,i.currentStep):i.currentStep;case"picture":return e!==!1?e.call(i,i.pic):i.pic;default:return!1}})}},{key:"flip",value:function(){var t=this;return this.waitter.handle(this,function(){var i=t.flipped?"width:100%;height:100%;":"width:100%;height:100%;-webkit-transform:scale(-1, 1);-ms-transform:scale(-1, 1);transform:scale(-1, 1);-webkit-filter:FlipH;filter:FlipH;";t.container.setAttribute("style",i),t.flipped=!t.flipped,t.emitter.emit("flip")})}},{key:"on",value:function(){var t;return(t=this.emitter).on.apply(t,arguments)}},{key:"off",value:function(){var t;return(t=this.emitter).off.apply(t,arguments)}},{key:"_resetUntil",value:function(){this.stopAtLoop=!1,this.stopAtStep=!1}},{key:"_targetStep",value:function(){return"forward"===this.animDirection?this.currentStep<this.options.steps?this.currentStep+1:1:this.currentStep>1?this.currentStep-1:this.options.steps}},{key:"_animate",value:function(t){var i=this;if(this.initiated){void 0===this.animTime&&(this.animTime=t);var e=Math.floor((t-this.animTime)/(1e3/this.currentFps)),n=!1;if(e>this.animFrame){this.animFrame=e;var r=this.currentStep;this.currentStep=this._targetStep();var s=!0;this.currentStep===this.stopAtStep&&(this.currentLoop++,this.currentLoop===this.stopAtLoop&&(s=!1)),s?(this._draw(),this.emitter.emit("change",r,this.currentStep)):(this._draw(),this.pause(),n=!0)}n||this.requireStop||(this.anim=window.requestAnimationFrame(function(t){return i._animate(t)}))}}},{key:"_startAnimation",value:function(){var t=this;this.anim?(this.pause(),this.play(this.animDirection)):(this.requireStop=!1,this.animTime=void 0,this.animFrame=0,this.currentLoop=0,this.anim=window.requestAnimationFrame(function(i){return t._animate(i)}))}},{key:"_pauseAnimation",value:function(){this.anim&&(this._resetUntil(),this.requireStop=!0,window.cancelAnimationFrame(this.anim),this.anim=!1)}},{key:"_selectPicture",value:function(){for(var t=0;t<this.options.picture.length;t++){var i=this.options.picture[t];if(this._supportsFormat(i.srcset)&&this._matchesMedia(i.media))return this.pic=i,i.srcset}return!1}},{key:"_supportsFormat",value:function(t){var i=this._getExtension(t);return"webp"===i&&this.supportsWebP||"webp"!==i}},{key:"_supportsWebP",value:function(){var t=document.createElement("canvas");return t.width=t.height=1,t.toDataURL&&t.toDataURL("image/webp")&&0===t.toDataURL("image/webp").indexOf("data:image/webp")}},{key:"_getExtension",value:function(t){return/[.]/.exec(t)?/[^.]+$/.exec(t)[0]:void 0}},{key:"_matchesMedia",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,i=window.matchMedia(t);return void 0===t||i.matches}},{key:"_setDimensions",value:function(){this.stepWidth=this.pic.width/this.columns,this.stepHeight=this.pic.height/this.options.rows,this.stepRatio=this.stepWidth/this.stepHeight,this.parentWidth=this.selector.clientWidth,this.parentHeight=this.selector.clientHeight,this.parentRatio=this.parentWidth/this.parentHeight,"cover"===this.pic.objectFit?this.stepRatio>=this.parentRatio?(this.canvasHeight=this.parentHeight,this.canvasWidth=this.stepWidth*this.canvasHeight/this.stepHeight):(this.canvasWidth=this.parentWidth,this.canvasHeight=this.stepHeight*this.canvasWidth/this.stepWidth):this.stepRatio>=this.parentRatio?(this.canvasWidth=this.parentWidth,this.canvasHeight=this.stepHeight*this.canvasWidth/this.stepWidth):(this.canvasHeight=this.parentHeight,this.canvasWidth=this.stepWidth*this.canvasHeight/this.stepHeight),this.canvas.width=this.canvasWidth,this.canvas.height=this.canvasHeight}},{key:"_loadPicture",value:function(){var t=this;this.picture=new Image,this.picture.onload=function(){t.pic.width||(t.pic.width=t.picture.naturalWidth),t.pic.height||(t.pic.height=t.picture.naturalHeight),t.loaded||(t.emitter.emit("load",t.pic),t.loaded=!0),t._draw()},this.picture.src=this._selectPicture()}},{key:"_draw",value:function(){this.initiated&&(this._setDimensions(),this._drawPicture())}},{key:"_drawPicture",value:function(){var t=Math.floor((this.currentStep-1)%this.columns),i=Math.floor((this.currentStep-1)/this.columns),e=t*this.stepWidth,n=i*this.stepHeight;this.options.testunit||(this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight),this.ctx.drawImage(this.picture,Math.round(e),Math.round(n),this.stepWidth,this.stepHeight,0,0,this.canvasWidth,this.canvasHeight))}},{key:"_createCanvas",value:function(){this.canvas=document.createElement("canvas"),this.canvas.setAttribute("style","position:absolute;left:50%;top:50%;-webkit-transform:translateY(-50%) translateY(1px) translateX(-50%) translateX(1px);-ms-transform:translateY(-50%) translateY(1px) translateX(-50%) translateX(1px);transform:translateY(-50%) translateY(1px) translateX(-50%) translateX(1px);"),this.container=document.createElement("div"),this.container.setAttribute("style","width:100%;height:100%;position:relative;"),this.container.appendChild(this.canvas),this.selector.appendChild(this.container),this.ctx=this.canvas.getContext("2d")}}]),t}(),u=function(){for(var t=arguments.length,i=Array(t),e=0;e<t;e++)i[e]=arguments[e];return new(Function.prototype.bind.apply(o,[null].concat(i)))};return u});
//# sourceMappingURL=spritz.js.map
