import * as cli from './cli';

type Direction = 'up' | 'down' | 'left' | 'right';
type Hit = 'none' | 'wall' | 'tail' | 'food' | 'head';

const snake = '\u2588';
const wall = '\u2591';
const food = '\u25c4\u25ba';

function rng(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export default class Snake {
  private static debug = true;
  private static offX = 2;
  private static offY = 2;
  private static width = 10;
  private static height = 10;
  private x = 5;
  private y = 5;
  private foodX = 0;
  private foodY = 0;
  private direction: Direction = 'up';
  private alive = true;
  private interval: NodeJS.Timeout;

  constructor() {
    cli.hideCursor();
    cli.clear();
    cli.input.on(this.onKey.bind(this));
    this.interval = setInterval(this.loop.bind(this), 600);
    this.createFood();
  }

  private loop() {
    if (this.direction === 'up') --this.y;
    else if (this.direction === 'down') ++this.y;
    else if (this.direction === 'left') --this.x;
    else if (this.direction === 'right') ++this.x;

    const hit = this.checkHit(this.x, this.y);

    if (Snake.debug) {
      cli.bg('black');
      cli.fg('gray');
      cli.move(Snake.width * 2 + 8, 2);
      cli.write(`${this.x},${this.y}  `);
      cli.move(Snake.width * 2 + 8, 3);
      cli.write(`${this.foodX},${this.foodY}  `);
      cli.move(Snake.width * 2 + 8, 4);
      cli.write(hit);
    }

    if (hit === 'wall' || hit === 'tail') {
      this.die();
      return;
    }
    if (hit === 'food') {
      this.createFood();
    }
    this.draw();
  }

  private createFood() {
    const food = [rng(1, 10), rng(1, 10)];
    while (this.checkHit(food[0], food[1]) !== 'none') {
      food[0] = rng(1, 10);
      food[1] = rng(1, 10);
    }
    this.foodX = food[0];
    this.foodY = food[1];
  }

  private checkHit(x: number, y: number): Hit {
    if (x <= 0 || x > Snake.width || y <= 0 || y > Snake.height) {
      return 'wall';
    }
    if (x === this.foodX && y === this.foodY) return 'food';
    if (x === this.x && y === this.y) return 'head';
    return 'none';
  }

  private die() {
    clearInterval(this.interval);
    this.alive = false;
    cli.reset();
    cli.move(1, Snake.height + Snake.offY + 1);
    process.exit(0);
  }

  private draw() {
    for (let x = 1; x <= Snake.width; ++x) {
      for (let y = 1; y <= Snake.height; ++y) {
        if (x === this.x && y === this.y) this.drawHead(x, y);
        else if (x === this.foodX && y === this.foodY) this.drawFood(x, y);
        else this.drawEmpty(x, y);
      }
    }
    for (let i = 0; i <= Snake.width + 1; ++i) {
      this.drawWall(i, 0);
      this.drawWall(i, Snake.height + 1);
    }
    for (let i = 1; i < Snake.height + 1; ++i) {
      this.drawWall(0, i);
      this.drawWall(Snake.width + 1, i);
    }
  }

  private onKey(key: cli.InputKey) {
    if (key === 'left') this.direction = 'left';
    else if (key === 'right') this.direction = 'right';
    else if (key === 'up') this.direction = 'up';
    else if (key === 'down') this.direction = 'down';
  }

  private drawWall(x: number, y: number) {
    cli.move(x * 2 + Snake.offX, y + Snake.offY);
    cli.bg('gray');
    cli.fg('white');
    cli.write(wall);
    cli.write(wall);
  }
  private drawHead(x: number, y: number) {
    cli.move(x * 2 + Snake.offX, y + Snake.offY);
    cli.bg('black');
    cli.fg('white');
    cli.write(snake);
    cli.write(snake);
  }
  private drawTail(x: number, y: number) {
    cli.move(x * 2 + Snake.offX, y + Snake.offY);
    cli.bg('black');
    cli.fg('gray');
    cli.write(snake);
    cli.write(snake);
  }
  private drawEmpty(x: number, y: number) {
    cli.move(x * 2 + Snake.offX, y + Snake.offY);
    cli.bg('black');
    cli.fg('gray');
    cli.write('  ');
  }
  private drawFood(x: number, y: number) {
    cli.move(x * 2 + Snake.offX, y + Snake.offY);
    cli.bg('black');
    cli.fg('brightGreen');
    cli.write(food);
  }
}
