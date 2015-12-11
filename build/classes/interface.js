'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ansi = require('ansi');

var _ansi2 = _interopRequireDefault(_ansi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _process = process;
var stdout = _process.stdout;
var stdin = _process.stdin;

var listeners = [];

var prefix = '\u001b';
var keys = {
  right: prefix + '[C',
  up: prefix + '[A',
  left: prefix + '[D',
  down: prefix + '[B',
  exit: '\u0003',
  space: ' '
};

var Interface = (function () {
  function Interface() {
    var output = arguments.length <= 0 || arguments[0] === undefined ? stdout : arguments[0];
    var input = arguments.length <= 1 || arguments[1] === undefined ? stdin : arguments[1];

    _classCallCheck(this, Interface);

    this.output = output;
    this.input = input;

    this.input.setRawMode(true);
    this.input.setEncoding('utf8');

    this.cursor = (0, _ansi2.default)(this.output).hide();

    this.columns = this.output.columns;
    this.rows = this.output.rows;

    this.input.addListener('data', function (data) {
      var key = Object.keys(keys).find(function (value, i) {
        return keys[value] === data;
      });

      if (key === 'exit') process.exit();

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
      this.output.write('\u001b[2J\u001b[0;0H');
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
      listeners.push({ key: key, fn: fn });
    }
  }]);

  return Interface;
})();

exports.default = Interface;
