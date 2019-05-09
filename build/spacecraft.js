'use strict';

var _unit = require('./classes/unit');

var _unit2 = _interopRequireDefault(_unit);

var _interface = require('./classes/interface');

var _interface2 = _interopRequireDefault(_interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FRAME = 20;
var ENEMY_SPAWN_RATE = 1000;
var RELOAD_TIME = 200;

var ui = new _interface2.default();

var player = new _unit2.default(ui);
player.go(1, ui.center.y);
player.shape = '=>';
player.color = '#77d6ff';
player.bold = true;
player.canShoot = true;

var explosion = new _unit2.default(ui);
explosion.dead = true;

var missles = [];
var enemies = [];
var score = 0;
setInterval(function () {
  ui.clear();

  player.draw();

  missles.forEach(function (missle, i) {
    missle.move(1, 0);
    missle.draw();

    var enemy = missle.collides(enemies);
    if (enemy) {
      enemy.killed = 1;
      enemy.color = 'red';
      enemy.shape = '*';
      missle.dead = true;

      ENEMY_SPAWN_RATE -= 5;

      score++;
    }

    if (missle.dead) {
      missles.splice(i, 1);
    }
  });

  enemies.forEach(function (enemy, i) {
    // move with speed
    enemy.move();
    enemy.draw();

    if (enemy.dead) {
      enemies.splice(i, 1);
    }

    if (enemy.killed == 3) enemy.dead = true;
    if (enemy.killed < 3) enemy.killed++;
  });

  ui.cursor.goto(0, 0).yellow().write(i18n.__('Score') + ': ' + score);
  ui.cursor.reset();
}, FRAME);

ui.onKey('right', function () {
  player.move(1, 0);
});
ui.onKey('down', function () {
  player.move(0, 1);
});
ui.onKey('up', function () {
  player.move(0, -1);
});
ui.onKey('left', function () {
  player.move(-1, 0);
});

ui.onKey('space', function () {
  if (!player.canShoot) return;

  player.canShoot = false;

  var missle = new _unit2.default(ui);
  missle.go(player.x, player.y);
  missle.shape = '+';
  missle.dieOnExit = true;

  missles.push(missle);

  setTimeout(function () {
    player.canShoot = true;
  }, RELOAD_TIME);
});

(function loop() {
  var enemy = new _unit2.default(ui);
  enemy.go(Math.random() * ui.output.columns, 0);
  enemy.shape = 'o';
  enemy.color = '#f7c71e';
  enemy.dieOnExit = true;

  enemy.speed = function () {
    return [Math.random() > 0.9 ? 0.4 : 0, 0.06];
  };

  enemies.push(enemy);

  setTimeout(loop, ENEMY_SPAWN_RATE);
})();

process.on('exit', function () {
  ui.cursor.horizontalAbsolute(0).eraseLine();
  ui.cursor.show();
});
