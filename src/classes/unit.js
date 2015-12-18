export default class Unit {
  constructor(output) {
    this._health = 0;
    this.dead = false;
    this.output = output;

    this.dieOnExit = false;
  }

  set health(value) {
    this._health = Math.max(0, value);

    if (this.health === 0) {
      this.dead = true;
    }
  }

  get health() {
    return this._health;
  }

  set x(value) {
    this._x = value;

    if (this.dieOnExit && this._x > this.output.columns) {
      this.dead = true;
    }
  }

  get x() {
    return this._x;
  }

  set y(value) {
    this._y = value;

    if (this.dieOnExit && this._y > this.output.rows) {
      this.dead = true;
    }
  }

  get y() {
    return this._y;
  }

  move(x, y) {
    if (!x && !y) return this.move(...this.speed());
    this.x += x;
    this.y += y;
  }

  draw() {
    if (this.dead) return;

    let { x, y, shape } = this;
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

  go(x, y) {
    this.x = x;
    this.y = y;
  }

  random() {
    this.x = Math.max(1, Math.floor(Math.random() * this.output.columns));
    this.y = Math.max(1, Math.floor(Math.random() * this.output.rows));
  }

  speed() {
    let signs = [Math.random() > 0.5 ? -1 : 1, Math.random() > 0.5 ? -1 : 1];
    return [Math.random() * signs[0], Math.random() * signs[1]];
  }

  collides(target) {
    if (Array.isArray(target)) {
      return target.find(t => this.collides(t));
    }

    let targetX = Math.round(target.x);
    let targetY = Math.round(target.y);
    let x = Math.round(this.x);
    let y = Math.round(this.y);

    return x === targetX && y == targetY;
  }
}
