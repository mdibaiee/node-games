'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Unit = function () {
  function Unit(output) {
    _classCallCheck(this, Unit);

    this._health = 0;
    this.dead = false;
    this.output = output;

    this.dieOnExit = false;
  }

  _createClass(Unit, [{
    key: 'move',
    value: function move(x, y) {
      if (!x && !y) return this.move.apply(this, _toConsumableArray(this.speed()));
      this.x += x;
      this.y += y;
    }
  }, {
    key: 'draw',
    value: function draw() {
      if (this.dead) return;

      var x = this.x,
          y = this.y,
          shape = this.shape;

      if (this.color && this.color[0] === '#') {
        this.output.cursor.hex(this.color);
      } else if (this.color) {
        this.output.cursor[this.color]();
      }
      if (this.bold) this.output.cursor.bold();

      this.output.cursor.goto(Math.round(x), Math.round(y));
      this.output.write(shape);
      this.output.cursor.reset();
    }
  }, {
    key: 'go',
    value: function go(x, y) {
      this.x = x;
      this.y = y;
    }
  }, {
    key: 'random',
    value: function random() {
      this.x = Math.max(1, Math.floor(Math.random() * this.output.columns));
      this.y = Math.max(1, Math.floor(Math.random() * this.output.rows));
    }
  }, {
    key: 'speed',
    value: function speed() {
      var signs = [Math.random() > 0.5 ? -1 : 1, Math.random() > 0.5 ? -1 : 1];
      return [Math.random() * signs[0], Math.random() * signs[1]];
    }
  }, {
    key: 'collides',
    value: function collides(target) {
      var _this = this;

      if (Array.isArray(target)) {
        return target.find(function (t) {
          return _this.collides(t);
        });
      }

      var targetX = Math.round(target.x);
      var targetY = Math.round(target.y);
      var x = Math.round(this.x);
      var y = Math.round(this.y);

      return x === targetX && y == targetY;
    }
  }, {
    key: 'health',
    set: function set(value) {
      this._health = Math.max(0, value);

      if (this.health === 0) {
        this.dead = true;
      }
    },
    get: function get() {
      return this._health;
    }
  }, {
    key: 'x',
    set: function set(value) {
      this._x = value;

      if (this.dieOnExit && this._x > this.output.columns) {
        this.dead = true;
      }
    },
    get: function get() {
      return this._x;
    }
  }, {
    key: 'y',
    set: function set(value) {
      this._y = value;

      if (this.dieOnExit && this._y > this.output.rows) {
        this.dead = true;
      }
    },
    get: function get() {
      return this._y;
    }
  }]);

  return Unit;
}();

exports.default = Unit;
