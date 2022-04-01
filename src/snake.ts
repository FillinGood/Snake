import * as cli from './cli';

type Direction = 'up' | 'down' | 'left' | 'right';
type Hit = 'none' | 'wall' | 'tail' | 'food';

const square = '\u25A0';

export default class Snake {
  private static offX = 2;
  private static offY = 2;
  private static width = 10;
  private static height = 10;
  private x = 5;
  private y = 5;
  private direction: Direction = 'up';
  private alive = true;
  private interval: NodeJS.Timeout;

  constructor() {
    cli.hideCursor();
    cli.clear();
    cli.input.on(this.onKey.bind(this));
    this.interval = setInterval(this.loop.bind(this), 750);
  }

  private loop() {
    if (this.direction === 'up') --this.y;
    else if (this.direction === 'down') ++this.y;
    else if (this.direction === 'left') --this.x;
    else if (this.direction === 'right') ++this.x;

    const hit = this.checkHit();

    if (hit === 'wall' || hit === 'tail') {
      this.die();
      return;
    }
    this.draw();
  }

  private checkHit(): Hit {
    if (
      this.x <= 0 ||
      this.x > Snake.width ||
      this.y <= 0 ||
      this.y > Snake.height
    ) {
      return 'wall';
    }
    return 'none';
  }

  private die() {
    clearInterval(this.interval);
    this.alive = false;
    cli.reset();
    process.exit(0);
  }

  private draw() {
    for (let x = 1; x <= Snake.width; ++x) {
      for (let y = 1; y <= Snake.height; ++y) {
        if (x === this.x && y === this.y) this.drawHead(x, y);
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
    cli.move(x + Snake.offX, y + Snake.offY);
    cli.bg('gray');
    cli.fg('white');
    cli.write(square);
  }
  private drawHead(x: number, y: number) {
    cli.move(x + Snake.offX, y + Snake.offY);
    cli.bg('black');
    cli.fg('white');
    cli.write(square);
  }
  private drawTail(x: number, y: number) {
    cli.move(x + Snake.offX, y + Snake.offY);
    cli.bg('black');
    cli.fg('gray');
    cli.write(square);
  }
  private drawEmpty(x: number, y: number) {
    cli.move(x + Snake.offX, y + Snake.offY);
    cli.bg('black');
    cli.fg('gray');
    cli.write(' ');
  }
}
