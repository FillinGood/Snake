import process from 'process';

const esc = '\u001b';
const csi = `${esc}[`;

const cnl = (n = 1) => `${csi}${n}E`;
const cup = (n = 1, m = 1) => `${csi}${n};${m}H`;
const ed = (n = 0) => `${csi}${n}J`;
const sgr = (n = 1) => `${csi}${n}m`;
const cus = () => `${csi}?25h`;
const cuh = () => `${csi}?25l`;

const colors = {
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,
  gray: 60,
  brightRed: 61,
  brightGreen: 62,
  brightYellow: 63,
  brightBlue: 64,
  brightMagenta: 65,
  brightCyan: 66,
  brightWhite: 67
};
export enum Color {
  Black = colors.black,
  Red = colors.red,
  Green = colors.green,
  Yellow = colors.yellow,
  Blue = colors.blue,
  Magenta = colors.magenta,
  Cyan = colors.cyan,
  White = colors.white,
  Gray = colors.gray,
  BrightRed = colors.brightRed,
  BrightGreen = colors.brightGreen,
  BrightYellow = colors.brightYellow,
  BrightBlue = colors.brightBlue,
  BrightMagenta = colors.brightMagenta,
  BrightCyan = colors.brightCyan,
  BrightWhite = colors.brightCyan
}
export type ColorName = keyof typeof colors;

export function move(x: number, y: number) {
  write(cup(y, x));
}
export function fg(color: ColorName): void;
export function fg(color: Color): void;
export function fg(color: Color | ColorName) {
  if (typeof color === 'string') color = colors[color];
  write(sgr(30 + color));
}
export function bg(color: ColorName): void;
export function bg(color: Color): void;
export function bg(color: Color | ColorName) {
  if (typeof color === 'string') color = colors[color];
  write(sgr(40 + color));
}
export function write(s: string) {
  process.stdout.write(s);
}
export function reset() {
  write(sgr(0));
  write(cnl());
  showCursor();
}
export function clear() {
  write(ed(2));
  write(cup());
}
export function showCursor() {
  write(cus());
}
export function hideCursor() {
  write(cuh());
}

export type InputHandler = (key: InputKey) => void;
export type InputKey = 'enter' | 'left' | 'up' | 'right' | 'down' | 'esc';
class Input {
  private handlers: InputHandler[] = [];

  constructor() {
    process.stdin.setRawMode(true);
    // bind создаст копию функции с закреплённым контекстом
    process.stdin.on('data', this.onData.bind(this));
  }

  private onData(data: Buffer) {
    const arr = [...data];
    if (arr.length === 1 && arr[0] === 27) this.emit('esc');
    else if (arr.length === 1 && arr[0] === 13) this.emit('enter');
    else if (arr.length === 3 && arr[0] === 27 && arr[1] === 91) {
      if (arr[2] === 68) this.emit('left');
      else if (arr[2] === 67) this.emit('right');
      else if (arr[2] === 65) this.emit('up');
      else if (arr[2] === 66) this.emit('down');
    }
  }
  on(handler: InputHandler) {
    this.handlers.push(handler);
  }
  emit(key: InputKey) {
    for (const handler of this.handlers) {
      handler(key);
    }
  }
}
export const input = new Input();
