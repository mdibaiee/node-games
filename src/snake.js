import Unit from './classes/unit';
import Interface from './classes/interface';

let FRAME = 100;
let ui = new Interface();

let snake = [];
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
let head = createPart();
head.color = '#71da29';
head.dieOnExit = true;
createPart();
createPart();

let point = new Unit(ui);
point.shape = '+';
point.color = '#f3ff6a';
point.random();

let score = 0;

let stop = false;
function loop() {
  if (stop) return;
  ui.clear();

  point.draw();

  snake.forEach((part, i) => {
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

  ui.cursor.goto(0, 0).yellow().write(`${i18n.__('Score')}: ${score}`);
  ui.cursor.reset();

  setTimeout(loop, FRAME);
}

loop();

ui.onKey('right', () => {
  changeDirection(RIGHT);
});
ui.onKey('down', () => {
  changeDirection(DOWN);
});
ui.onKey('up', () => {
  changeDirection(UP);
});
ui.onKey('left', () => {
  changeDirection(LEFT);
});

ui.onKey(() => {
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
})

function changeDirection(dir) {
  if (head.direction === UP && dir === DOWN ||
      head.direction === DOWN && dir === UP ||
      head.direction === LEFT && dir === RIGHT ||
      head.direction === RIGHT && dir === LEFT) return;
  head.direction = dir;
}

function createPart() {
  let part = new Unit(ui);
  let last = snake[snake.length - 1];

  let direction;
  if (!last) {
    direction = UP;
  } else {
    direction = last.direction;
  }

  part.shape = '•';
  part.color = '#bdfe91';
  part.direction = direction;
  part.changeTo = null;

  part.findWay = function(i) {
    let ahead = snake[i - 1];

    if (this.changeTo !== null) {
      this.direction = this.changeTo;
      this.changeTo = null;
    }
    if (this.direction !== ahead.direction) {
      this.changeTo = ahead.direction;
    }
  }

  part.speed = function(multiplier = 1) {
    let { direction } = part;
    let x = direction == LEFT ? -1 :
            direction == RIGHT ? 1 : 0;
    let y = direction == UP ? -1 :
            direction == DOWN ? 1 : 0;

    return [x * multiplier, y * multiplier];
  }

  let [dX, dY] = part.speed();
  dX *= -1;
  dY *= -1;

  let x = last ? last.x + dX : ui.center.x;
  let y = last ? last.y + dY : ui.center.y;

  part.go(x, y);

  snake.push(part);
  return part;
}

function gameover() {
  const MSG = i18n.__('Game Over');
  ui.cursor.goto(ui.center.x - MSG.length / 2, ui.center.y);
  ui.cursor.red();
  ui.cursor.bold();
  ui.write(MSG);

  ui.cursor.reset();
  ui.cursor.hex('#f65590');
  const RETRY = i18n.__('Press any key to play again');
  ui.cursor.goto(ui.center.x - RETRY.length / 2, ui.center.y + 2);
  ui.write(RETRY);

  FRAME = 100;

  stop = true;
}

process.on('exit', function() {
  ui.cursor.horizontalAbsolute(0).eraseLine()
  ui.cursor.show();
});
