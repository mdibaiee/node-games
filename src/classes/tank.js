import Unit from './unit';

const BULLET_SPEED = 10;

export default class Tank extends Unit {
  constructor(ui) {
    super(ui);

    this._angle = 0;
    this.bullets = [];
    this.health = 100;

    this.size = { x: 5, y: 3 };
  }

  set angle(deg) {
    if (deg < 0) deg = 0;
    if (deg > 180) deg = 180;

    this._angle = radian(deg);
  }

  get angle() {
    return degree(this._angle);
  }

  shoot() {
    let bullet = new Bullet(this.output);
    bullet.go(this.x + 2, this.y - 2);
    bullet.velocity = this.normalize();

    this.bullets.push(bullet);
  }

  draw() {
    if (this.dead) return;

    let { x, y } = this;
    if (this.color && this.color[0] === '#') {
      this.output.cursor.hex(this.color);
    } else if (this.color) {
      this.output.cursor[this.color]();
    }
    if (this.bold) this.output.cursor.bold();


    x = Math.round(x) + 2;
    y = Math.round(y) - 2;

    let cannon;
    if (this.angle < 35) cannon = '_';
    else if (this.angle < 70) cannon = '/';
    else if (this.angle < 115) cannon = '|';
    else if (this.angle < 160) cannon = '\\';
    else cannon = '_';

    this.output.cursor.goto(x + 2, y - 2);
    this.output.write(cannon);
    this.output.cursor.goto(x, y - 1);
    this.output.write('.===.');
    this.output.cursor.goto(x, y);
    this.output.write('o===o');
    this.output.cursor.reset();
  }

  normalize() {
    return [Math.cos(this._angle), Math.sin(this._angle) * -1];
  }

  static radian(deg) {
    return radian(deg);
  }

  static degree(rad) {
    return degree(rad);
  }
}

export class Bullet extends Unit {
  constructor(ui) {
    super(ui);

    this.velocity = [0, 0];

    this.shape = '•';
    this.color = 'red';

    this.dieOnExit = true;

    this.gravity = [0.8, 0.8];
    this.acceleration = [0, 0.015];
  }

  speed() {
    this.velocity[0] += this.acceleration[0];
    this.velocity[1] += this.acceleration[1];

    let x = this.velocity[0] * this.gravity[0];
    let y = this.velocity[1] * this.gravity[1];
    return [x, y];
  }

  collides(target) {
    let targetX = Math.round(target.x);
    let targetY = Math.round(target.y);
    let x = Math.round(this.x);
    let y = Math.round(this.y);

    return x > targetX - target.size.x && x < targetX + target.size.x &&
           y > targetY - target.size.y && y < targetY + target.size.y;
  }
}

function radian(deg) {
  return deg * Math.PI / 180;
}

function degree(rad) {
  return rad * 180 / Math.PI;
}
