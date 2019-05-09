'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _unit = require('./classes/unit');

var _unit2 = _interopRequireDefault(_unit);

var _interface = require('./classes/interface');

var _interface2 = _interopRequireDefault(_interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FRAME = 100;
var ui = new _interface2.default();

var snake = [];
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var head = createPart();
head.color = '#71da29';
head.dieOnExit = true;
createPart();
createPart();

var point = new _unit2.default(ui);
point.shape = '+';
point.color = '#f3ff6a';
point.random();

var score = 0;

var stop = false;
function loop() {
  if (stop) return;
  ui.clear();

  point.draw();

  snake.forEach(function (part, i) {
    part.draw();

    if (i > 0) part.findWay(i);

    part.move();
  });

  if (head.collides(point)) {
    point.random();
    createPart();
    score++;

    FRAME -= 5;
  }

  if (head.collides(snake.slice(2))) {
    gameover();
  }

  ui.cursor.goto(0, 0).yellow().write(i18n.__('Score') + ': ' + score);
  ui.cursor.reset();

  setTimeout(loop, FRAME);
}

loop();

ui.onKey('right', function () {
  changeDirection(RIGHT);
});
ui.onKey('down', function () {
  changeDirection(DOWN);
});
ui.onKey('up', function () {
  changeDirection(UP);
});
ui.onKey('left', function () {
  changeDirection(LEFT);
});

ui.onKey(function () {
  if (!stop) return;

  stop = false;
  snake = [];
  head = createPart();
  head.color = '#71da29';
  createPart();
  createPart();

  score = 0;

  point.random();

  loop();
});

function changeDirection(dir) {
  if (head.direction === UP && dir === DOWN || head.direction === DOWN && dir === UP || head.direction === LEFT && dir === RIGHT || head.direction === RIGHT && dir === LEFT) return;
  head.direction = dir;
}

function createPart() {
  var part = new _unit2.default(ui);
  var last = snake[snake.length - 1];

  var direction = void 0;
  if (!last) {
    direction = UP;
  } else {
    direction = last.direction;
  }

  part.shape = '•';
  part.color = '#bdfe91';
  part.direction = direction;
  part.changeTo = null;

  part.findWay = function (i) {
    var ahead = snake[i - 1];

    if (this.changeTo !== null) {
      this.direction = this.changeTo;
      this.changeTo = null;
    }
    if (this.direction !== ahead.direction) {
      this.changeTo = ahead.direction;
    }
  };

  part.speed = function () {
    var multiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var direction = part.direction;

    var x = direction == LEFT ? -1 : direction == RIGHT ? 1 : 0;
    var y = direction == UP ? -1 : direction == DOWN ? 1 : 0;

    return [x * multiplier, y * multiplier];
  };

  var _part$speed = part.speed(),
      _part$speed2 = _slicedToArray(_part$speed, 2),
      dX = _part$speed2[0],
      dY = _part$speed2[1];

  dX *= -1;
  dY *= -1;

  var x = last ? last.x + dX : ui.center.x;
  var y = last ? last.y + dY : ui.center.y;

  part.go(x, y);

  snake.push(part);
  return part;
}

function gameover() {
  var MSG = i18n.__('Game Over');
  ui.cursor.goto(ui.center.x - MSG.length / 2, ui.center.y);
  ui.cursor.red();
  ui.cursor.bold();
  ui.write(MSG);

  ui.cursor.reset();
  ui.cursor.hex('#f65590');
  var RETRY = i18n.__('Press any key to play again');
  ui.cursor.goto(ui.center.x - RETRY.length / 2, ui.center.y + 2);
  ui.write(RETRY);

  FRAME = 100;

  stop = true;
}

process.on('exit', function () {
  ui.cursor.horizontalAbsolute(0).eraseLine();
  ui.cursor.show();
});
