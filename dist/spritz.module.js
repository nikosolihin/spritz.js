/*!
* spritz.js 2.0.0 - A small, modern, responsive, sprites animation library.
* Copyright (c) 2016 maoosi <hello@sylvainsimao.fr> - https://github.com/maoosi/spritz.js
* License: MIT
*/

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var knot = (function () {
  var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var events = {};

  function on(name, handler) {
    events[name] = events[name] || [];
    events[name].push(handler);
    return this;
  }

  function once(name, handler) {
    handler._once = true;
    on(name, handler);
    return this;
  }

  function off(name) {
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    handler ? events[name].splice(events[name].indexOf(handler), 1) : delete events[name];

    return this;
  }

  function emit(name) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // cache the events, to avoid consequences of mutation
    var cache = events[name] && events[name].slice();

    // only fire handlers if they exist
    cache && cache.forEach(function (handler) {
      // remove handlers added with 'once'
      handler._once && off(name, handler);

      // set 'this' context, pass args to handlers
      handler.apply(_this, args);
    });

    return this;
  }

  return _extends({}, object, {

    on: on,
    once: once,
    off: off,
    emit: emit
  });
});

var Wait = function () {
    function Wait() {
        classCallCheck(this, Wait);

        // initiate wait vars
        this.waitQueue = [];
        this.waitTimer = false;
        this.waitExecution = false;
    }

    createClass(Wait, [{
        key: 'handle',
        value: function handle(func) {
            var milliseconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            // handle wait
            this.waitQueue.push({
                'func': func,
                'timeout': milliseconds
            });

            if (!this.waitExecution) {
                this.next();
            }
        }
    }, {
        key: 'next',
        value: function next() {
            var _this = this;

            // execute next
            if (this.waitQueue.length > 0) {
                var c = this.waitQueue.shift();
                var f = c['func'];
                var t = c['timeout'];

                if (t !== false) {
                    f();
                    this.waitExecution = true;
                    this.waitTimer = setTimeout(function () {
                        _this.next();
                    }, t);
                } else {
                    f();
                    this.waitExecution = false;
                    this.next();
                }
            }
        }
    }]);
    return Wait;
}();

var Spritz = function () {

    /**
        --- CORE ---
    **/

    function Spritz(selector) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, Spritz);

        // instance constructor
        this.options = {
            picture: options.picture || [],
            width: options.width || 0,
            height: options.height || 0,
            steps: options.steps || 1,
            rows: options.rows || 1
        };

        this.selector = typeof selector === 'string' ? document.querySelector(selector) : selector;

        this.emitter = knot();
        this.waitter = new Wait();
        this.supportsWebP = this._supportsWebP();

        this.initiated = false;

        return this;
    }

    createClass(Spritz, [{
        key: '_globalVars',
        value: function _globalVars() {
            // global vars
            this.canvas = false;
            this.ctx = false;
            this.loaded = false;

            this.columns = this.options.steps / this.options.rows;
        }
    }, {
        key: '_throttle',
        value: function _throttle(callback, delay) {
            var _this = this,
                _arguments = arguments;

            // throttle function
            var last = void 0;
            var timer = void 0;

            return function () {
                var context = _this;
                var now = +new Date();
                var args = _arguments;

                if (last && now < last + delay) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        last = now;
                        callback.apply(context, args);
                    }, delay);
                } else {
                    last = now;
                    callback.apply(context, args);
                }
            };
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this2 = this;

            // create events listeners
            this.resize = this._throttle(function (event) {
                _this2._resize();
            }, 250);

            window.addEventListener('resize', this.resize, false);
        }
    }, {
        key: '_unbindEvents',
        value: function _unbindEvents() {
            // remove events listeners
            window.removeEventListener('resize', this.resize, false);
        }
    }, {
        key: '_resize',
        value: function _resize() {
            // viewport resize triggered
            this._loadPicture();
            this.emitter.emit('resize');
        }

        /**
            --- API ---
        **/

    }, {
        key: 'init',
        value: function init() {
            var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            // init vars, canvas, and snake
            if (!this.initiated) {
                this.step = step;

                this._globalVars();
                this._bindEvents();
                this._createCanvas();
                this._loadPicture();

                this.initiated = true;
                this.emitter.emit('init');
            }

            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var _this3 = this;

            // destroy snake & instance
            this.waitter.handle(function () {
                if (_this3.initiated) {
                    // stop stuff
                    _this3.stop();
                    _this3._unbindEvents();

                    // reset & remove canvas
                    _this3.canvas.parentNode.removeChild(_this3.canvas);
                    _this3.canvas = false;
                    _this3.ctx = false;

                    // turn initiated to false
                    _this3.initiated = false;

                    // emitt destroy
                    _this3.emitter.emit('destroy');

                    // turn off emitters
                    _this3.emitter.off('init');
                    _this3.emitter.off('destroy');
                    _this3.emitter.off('resize');
                    _this3.emitter.off('play');
                    _this3.emitter.off('load');
                    _this3.emitter.off('playback');
                    _this3.emitter.off('wait');
                    _this3.emitter.off('pause');
                    _this3.emitter.off('stop');
                }
            });

            return this;
        }
    }, {
        key: 'play',
        value: function play(fps) {
            var _this4 = this;

            // play animation
            this.waitter.handle(function () {
                _this4._playAnimation();

                console.log('playing');

                _this4.emitter.emit('play');
            });

            return this;
        }
    }, {
        key: 'playback',
        value: function playback(fps) {
            var _this5 = this;

            // play animation
            this.waitter.handle(function () {
                _this5._playAnimation();

                console.log('playing backwards');

                _this5.emitter.emit('playback');
            });

            return this;
        }
    }, {
        key: 'pause',
        value: function pause() {
            var _this6 = this;

            var silent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            // stop animation
            this.waitter.handle(function () {
                _this6._pauseAnimation();

                if (!silent) {
                    console.log('paused');
                    _this6.emitter.emit('pause');
                }
            });

            return this;
        }
    }, {
        key: 'stop',
        value: function stop() {
            var _this7 = this;

            // stop animation
            this.waitter.handle(function () {
                _this7.pause(true);
                _this7._resetAnimation();

                console.log('stopped');

                _this7.emitter.emit('stop');
            });

            return this;
        }
    }, {
        key: 'wait',
        value: function wait() {
            var _this8 = this;

            var milliseconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            // chainable timeout
            this.waitter.handle(function () {
                _this8.emitter.emit('wait');
                console.log('waiting for ' + milliseconds + 'ms');
            }, milliseconds);

            return this;
        }
    }, {
        key: 'step',
        value: function step() {
            var _this9 = this;

            var _step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            // Change the current frame/step
            this.waitter.handle(function () {
                _this9.step = _step;
                _this9._draw();
            });

            return this;
        }
    }, {
        key: 'on',
        value: function on() {
            var _emitter;

            return (_emitter = this.emitter).on.apply(_emitter, arguments);
        }
    }, {
        key: 'off',
        value: function off() {
            var _emitter2;

            return (_emitter2 = this.emitter).off.apply(_emitter2, arguments);
        }
    }, {
        key: 'once',
        value: function once() {
            var _emitter3;

            return (_emitter3 = this.emitter).once.apply(_emitter3, arguments);
        }

        /**
            --- ANIMATE ---
        **/

    }, {
        key: '_resetAnimation',
        value: function _resetAnimation() {
            // reset animation to its initial state

        }
    }, {
        key: '_playAnimation',
        value: function _playAnimation() {
            // start animation
            this.anim = window.requestAnimationFrame(function (timestamp) {
                // this._animStep(timestamp)
            });
        }
    }, {
        key: '_pauseAnimation',
        value: function _pauseAnimation() {
            // pause animation
            if (this.anim) {
                window.cancelAnimationFrame(this.anim);
                this.anim = false;
                this.animStarter = false;
            }
        }

        /**
            --- DETECT & CALCULATE ---
        **/

    }, {
        key: '_selectPicture',
        value: function _selectPicture() {
            // select picture src from list
            for (var i = 0; i < this.options.picture.length; i++) {
                var pic = this.options.picture[i];
                if (this._supportsFormat(pic.srcset) && this._matchesMedia(pic.media)) {
                    this.pic = pic;
                    return pic.srcset;
                }
            }
            return false;
        }
    }, {
        key: '_supportsFormat',
        value: function _supportsFormat(filename) {
            // return true if filename is a supported format
            var ext = this._getExtension(filename);
            return ext === 'webp' && this.supportsWebP || ext !== 'webp';
        }
    }, {
        key: '_supportsWebP',
        value: function _supportsWebP() {
            // return true if webP is supported
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            return canvas.toDataURL && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
    }, {
        key: '_getExtension',
        value: function _getExtension(filename) {
            // return filename extension
            return (/[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined
            );
        }
    }, {
        key: '_matchesMedia',
        value: function _matchesMedia() {
            var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            // return true if matches the media query
            var mq = window.matchMedia(query);
            return query !== undefined ? mq.matches : true;
        }
    }, {
        key: '_setDimensions',
        value: function _setDimensions() {
            // calculate sprite dimensions
            this.stepWidth = this.pic.width / this.columns;
            this.stepHeight = this.pic.height / this.options.rows;
            this.stepRatio = this.stepWidth / this.stepHeight;

            this.parentWidth = this.selector.clientWidth;
            this.parentHeight = this.selector.clientHeight;
            this.parentRatio = this.parentWidth / this.parentHeight;

            if (this.stepRatio >= this.parentRatio) {
                this.canvasWidth = this.parentWidth;
                this.canvasHeight = this.stepHeight * this.canvasWidth / this.stepWidth;
            } else {
                this.canvasHeight = this.parentHeight;
                this.canvasWidth = this.stepWidth * this.canvasHeight / this.stepHeight;
            }

            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
        }

        /**
            --- CREATE & DRAW ---
        **/

    }, {
        key: '_loadPicture',
        value: function _loadPicture() {
            var _this10 = this;

            // load source picture
            this.picture = new Image();
            this.picture.onload = function () {
                if (!_this10.loaded) {
                    _this10.emitter.emit('load');
                    _this10.loaded = true;
                }
                _this10._draw();
            };
            this.picture.src = this._selectPicture();
            console.log(this.picture.src);
        }
    }, {
        key: '_draw',
        value: function _draw() {
            // draw sprite
            this._setDimensions();
            this._drawPicture();
        }
    }, {
        key: '_drawPicture',
        value: function _drawPicture() {
            // draw picture into canvas
            var targetColumn = this.step % this.columns;
            var targetRow = Math.ceil(this.step / this.columns);

            var posX = (targetColumn - 1) * this.stepWidth;
            var posY = (targetRow - 1) * this.stepHeight;

            console.log(targetColumn);
            console.log(targetRow);
            console.log(posX);
            console.log(posY);

            this.ctx.drawImage(this.picture, posX, posY, this.stepWidth, this.stepHeight, 0, 0, this.canvasWidth, this.canvasHeight);
        }
    }, {
        key: '_createCanvas',
        value: function _createCanvas() {
            // create html5 canvas
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('style', 'position:absolute;left:50%;top:50%;z-index:1;transform:translateY(-50%) translateY(1px) translateX(-50%) translateX(1px);');
            this.selector.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }
    }]);
    return Spritz;
}();

export default Spritz;
