'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bullet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _unit = require('./unit');

var _unit2 = _interopRequireDefault(_unit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BULLET_SPEED = 10;

var Tank = function (_Unit) {
  _inherits(Tank, _Unit);

  function Tank(ui) {
    _classCallCheck(this, Tank);

    var _this = _possibleConstructorReturn(this, (Tank.__proto__ || Object.getPrototypeOf(Tank)).call(this, ui));

    _this._angle = 0;
    _this.bullets = [];
    _this.health = 100;

    _this.size = { x: 5, y: 3 };
    return _this;
  }

  _createClass(Tank, [{
    key: 'shoot',
    value: function shoot() {
      var bullet = new Bullet(this.output);
      bullet.go(this.x + 2, this.y - 2);
      bullet.velocity = this.normalize();

      this.bullets.push(bullet);
    }
  }, {
    key: 'draw',
    value: function draw() {
      if (this.dead) return;

      var x = this.x,
          y = this.y;

      if (this.color && this.color[0] === '#') {
        this.output.cursor.hex(this.color);
      } else if (this.color) {
        this.output.cursor[this.color]();
      }
      if (this.bold) this.output.cursor.bold();

      x = Math.round(x) + 2;
      y = Math.round(y) - 2;

      var cannon = void 0;
      if (this.angle < 35) cannon = '_';else if (this.angle < 70) cannon = '/';else if (this.angle < 115) cannon = '|';else if (this.angle < 160) cannon = '\\';else cannon = '_';

      this.output.cursor.goto(x + 2, y - 2);
      this.output.write(cannon);
      this.output.cursor.goto(x, y - 1);
      this.output.write('.===.');
      this.output.cursor.goto(x, y);
      this.output.write('o===o');
      this.output.cursor.reset();
    }
  }, {
    key: 'normalize',
    value: function normalize() {
      return [Math.cos(this._angle), Math.sin(this._angle) * -1];
    }
  }, {
    key: 'angle',
    set: function set(deg) {
      if (deg < 0) deg = 0;
      if (deg > 180) deg = 180;

      this._angle = _radian(deg);
    },
    get: function get() {
      return _degree(this._angle);
    }
  }], [{
    key: 'radian',
    value: function radian(deg) {
      return _radian(deg);
    }
  }, {
    key: 'degree',
    value: function degree(rad) {
      return _degree(rad);
    }
  }]);

  return Tank;
}(_unit2.default);

exports.default = Tank;

var Bullet = exports.Bullet = function (_Unit2) {
  _inherits(Bullet, _Unit2);

  function Bullet(ui) {
    _classCallCheck(this, Bullet);

    var _this2 = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, ui));

    _this2.velocity = [0, 0];

    _this2.shape = '•';
    _this2.color = 'red';

    _this2.dieOnExit = true;

    _this2.gravity = [0.8, 0.8];
    _this2.acceleration = [0, 0.015];
    return _this2;
  }

  _createClass(Bullet, [{
    key: 'speed',
    value: function speed() {
      this.velocity[0] += this.acceleration[0];
      this.velocity[1] += this.acceleration[1];

      var x = this.velocity[0] * this.gravity[0];
      var y = this.velocity[1] * this.gravity[1];
      return [x, y];
    }
  }, {
    key: 'collides',
    value: function collides(target) {
      var targetX = Math.round(target.x);
      var targetY = Math.round(target.y);
      var x = Math.round(this.x);
      var y = Math.round(this.y);

      return x > targetX - target.size.x && x < targetX + target.size.x && y > targetY - target.size.y && y < targetY + target.size.y;
    }
  }]);

  return Bullet;
}(_unit2.default);

function _radian(deg) {
  return deg * Math.PI / 180;
}

function _degree(rad) {
  return rad * 180 / Math.PI;
}
