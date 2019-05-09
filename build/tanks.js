'use strict';

var _unit = require('./classes/unit');

var _unit2 = _interopRequireDefault(_unit);

var _tank = require('./classes/tank');

var _tank2 = _interopRequireDefault(_tank);

var _interface = require('./classes/interface');

var _interface2 = _interopRequireDefault(_interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FRAME = 50;
var ui = new _interface2.default();
var immoblize = false;

var one = new _tank2.default(ui);
one.go(10, ui.rows);

var two = new _tank2.default(ui);
two.go(ui.columns - 10, ui.rows);

var stop = false;

function loop() {
  if (stop) return;

  ui.clear();

  if (one.dead || two.dead) {
    var num = one.dead ? '2' : '1';
    var msg = i18n.__('Player %s won!', num);
    ui.cursor.red();
    ui.cursor.bold();

    ui.cursor.goto(ui.center.x - msg.length / 2, ui.center.y);
    ui.write(msg);

    stop = true;
    return;
  }

  one.draw();
  one.bullets.forEach(function (bullet, i) {
    if (bullet.dead) {
      immoblize = false;
      one.bullets.splice(i, 1);
      return;
    }
    bullet.move();
    bullet.draw();

    if (bullet.collides(two)) {
      two.health -= 10;
      bullet.dead = true;
    }
  });

  ui.cursor.goto(0, 1);
  if (turn() === one) ui.cursor.hex('#54ffff');
  ui.write(i18n.__('Player') + ' 1');
  ui.cursor.reset();
  ui.cursor.goto(0, 2);
  ui.write(i18n.__('Health') + ': ' + one.health);
  ui.cursor.goto(0, 3);
  ui.write(i18n.__('Angle') + ': ' + parseInt(one.angle));

  two.draw();
  two.bullets.forEach(function (bullet, i) {
    if (bullet.dead) {
      immoblize = false;
      two.bullets.splice(i, 1);
      return;
    }
    bullet.move();
    bullet.draw();

    if (bullet.collides(one)) {
      one.health -= 10;
      bullet.dead = true;
    }
  });

  ui.cursor.goto(ui.output.columns - 10, 1);
  if (turn() === two) ui.cursor.hex('#54ffff');
  ui.write(i18n.__('Player') + ' 2');
  ui.cursor.reset();
  ui.cursor.goto(ui.output.columns - 10, 2);
  ui.write(i18n.__('Health') + ': ' + two.health);
  ui.cursor.goto(ui.output.columns - 10, 3);
  ui.write(i18n.__('Angle') + ': ' + parseInt(two.angle));
  setTimeout(loop, FRAME);
}

loop();

ui.onKey('down', function () {
  if (immoblize) return;

  turn().angle -= 1;
});

ui.onKey('up', function () {
  if (immoblize) return;

  turn().angle += 1;
});

ui.onKey('left', function () {
  if (immoblize) return;

  turn().x -= 1;
});

ui.onKey('right', function () {
  if (immoblize) return;

  turn().x += 1;
});

ui.onKey('space', function () {
  if (immoblize) return;

  turn().shoot();

  immoblize = true;
  TURN = !TURN;
});

ui.onKey(function () {
  if (one.dead || two.dead) {
    one.go(10, ui.rows);
    two.go(ui.columns - 10, ui.rows);

    one.health = 100;
    two.health = 100;

    one.dead = false;
    two.dead = false;

    stop = false;

    loop();
  }
});

var TURN = true;
function turn() {
  if (TURN) return one;
  return two;
}
