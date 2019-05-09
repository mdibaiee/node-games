'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ansi = require('ansi');

var _ansi2 = _interopRequireDefault(_ansi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _process = process,
    stdout = _process.stdout,
    stdin = _process.stdin;


var listeners = [];

var prefix = '\x1B';
var keys = {
  right: prefix + '[C',
  up: prefix + '[A',
  left: prefix + '[D',
  down: prefix + '[B',
  exit: '\x03',
  space: ' '
};

var Interface = function () {
  function Interface() {
    var _this = this;

    var output = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : stdout;
    var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : stdin;

    _classCallCheck(this, Interface);

    this.output = output;
    this.input = input;

    this.input.setRawMode(true);
    this.input.setEncoding('utf8');

    this.cursor = (0, _ansi2.default)(this.output).hide();

    this.input.addListener('data', function (data) {
      var always = listeners.filter(function (listener) {
        return listener.key === '';
      });

      always.forEach(function (listener) {
        return listener.fn();
      });

      var key = Object.keys(keys).find(function (value, i) {
        return keys[value] === data;
      });

      if (key === 'exit') {
        _this.output.write('\x1B[2J\x1B[0;0H');
        process.exit();
      }

      var match = listeners.filter(function (listener) {
        return listener.key === key || listener.key === data;
      });

      match.forEach(function (listener) {
        return listener.fn();
      });
    });
  }

  _createClass(Interface, [{
    key: 'clear',
    value: function clear() {
      this.output.write('\x1B[2J\x1B[0;0H');
    }
  }, {
    key: 'write',
    value: function write() {
      var _cursor;

      (_cursor = this.cursor).write.apply(_cursor, arguments);
    }
  }, {
    key: 'onKey',
    value: function onKey(key, fn) {
      if (typeof key === 'function') {
        fn = key;
        key = '';
      }
      listeners.push({ key: key, fn: fn });
    }
  }, {
    key: 'line',
    value: function line(from, to) {
      var delta = {
        x: to.x - from.x,
        y: to.y - from.y
      };

      var error = 0;

      var deltaerr = Math.abs(delta.y / delta.x);

      var y = from.y;


      for (var x = from.x; x < to.x; x++) {
        this.cursor.goto(x, y);
        this.write('.');
        error += deltaerr;

        while (error >= 0.5) {
          this.cursor.goto(x, y);
          this.write('.');
          y += Math.sign(delta.y);

          error -= 1;
        }
      }
    }
  }, {
    key: 'columns',
    get: function get() {
      return this.output.columns;
    }
  }, {
    key: 'rows',
    get: function get() {
      return this.output.rows;
    }
  }, {
    key: 'center',
    get: function get() {
      return {
        x: this.output.columns / 2,
        y: this.output.rows / 2
      };
    }
  }]);

  return Interface;
}();

exports.default = Interface;
