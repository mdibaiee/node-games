import Unit from './classes/unit';
import Interface from './classes/interface';

const FRAME = 20;
let ENEMY_SPAWN_RATE = 1000;
let RELOAD_TIME = 200;

let ui = new Interface();

let player = new Unit(ui);
player.go(1, ui.center.y);
player.shape = '=>';
player.color = '#77d6ff';
player.bold = true;
player.canShoot = true;

let explosion = new Unit(ui);
explosion.dead = true;

let missles = [];
let enemies = [];
let score = 0;
setInterval(() => {
  ui.clear();

  player.draw();

  missles.forEach((missle, i) => {
    missle.move(1, 0);
    missle.draw();

    let enemy = missle.collides(enemies)
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

  enemies.forEach((enemy, i) => {
    // move with speed
    enemy.move();
    enemy.draw();

    if (enemy.dead) {
      enemies.splice(i, 1);
    }

    if (enemy.killed == 3) enemy.dead = true;
    if (enemy.killed < 3) enemy.killed++;
  })

  ui.cursor.goto(0, 0).yellow().write(`${i18n.__('Score')}: ${score}`);
  ui.cursor.reset();
}, FRAME);


ui.onKey('right', () => {
  player.move(1, 0);
});
ui.onKey('down', () => {
  player.move(0, 1);
});
ui.onKey('up', () => {
  player.move(0, -1);
});
ui.onKey('left', () => {
  player.move(-1, 0);
});

ui.onKey('space', () => {
  if (!player.canShoot) return;

  player.canShoot = false;

  let missle = new Unit(ui);
  missle.go(player.x, player.y);
  missle.shape = '+';
  missle.dieOnExit = true;

  missles.push(missle);

  setTimeout(() => {
    player.canShoot = true;
  }, RELOAD_TIME)
});

(function loop() {
  let enemy = new Unit(ui);
  enemy.go(Math.random() * ui.output.columns, 0);
  enemy.shape = 'o';
  enemy.color = '#f7c71e';
  enemy.dieOnExit = true;

  enemy.speed = () => {
    return [Math.random() > 0.9 ? 0.4 : 0, 0.06];
  }

  enemies.push(enemy);

  setTimeout(loop, ENEMY_SPAWN_RATE);
}());

process.on('exit', function() {
  ui.cursor.horizontalAbsolute(0).eraseLine()
  ui.cursor.show();
});
