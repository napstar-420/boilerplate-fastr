export interface Circle {
  x: number;
  y: number;
  r: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Vector = [number, number];

export type Vector3D = [number, number, number];

export function force2DVector(position: Vector | Vector3D): Vector {
  if (!Array.isArray(position)) {
    return [-1, -1];
  }

  return [position[0], position[1]];
}

export function rgbToHex(rgb: [number, number, number]) {
  if (!Array.isArray(rgb) || rgb.length !== 3) {
    return 0;
  }

  return parseInt(((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1), 16);
}

export function rand(min: number, max: number) {
  if (isNaN(min)) {
    min = 0;
  }

  if (isNaN(max)) {
    max = 1;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function fixedArray<V>(length: number, value: any = null) {
  if (isNaN(length)) {
    length = 1;
  }

  return [...Array(length)].map(() => value);
}

export function clamp(value: number, min: number, max: number) {
  if (isNaN(value)) {
    value = 0;
  }

  if (isNaN(min)) {
    min = 0;
  }

  if (isNaN(max)) {
    max = 1;
  }

  return value < min ? min : value > max ? max : value;
}

export function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t;
}

export function capitalizeFirst(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function enumToString(value: string) {
  return `${value}`
    .split('_')
    .map(part => capitalizeFirst(part.toLowerCase()))
    .join(' ');
}

export async function sleep(length: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), length);
  });
}

export function decToHex(dec: number, padding = 6) {
  let hex = dec.toString(16);

  while (hex.length < padding) {
    hex = `0${hex}`;
  }

  return hex;
}

export function asc(a: number | string, b: number | string) {
  a = parseInt(`${a}`);
  b = parseInt(`${b}`);

  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }

  return 0;
}

export function desc(a: number | string, b: number | string) {
  a = parseInt(`${a}`);
  b = parseInt(`${b}`);

  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  }

  return 0;
}

export function pad(text: string | number, length: number, char = '0') {
  let newText = text.toString();

  while (`${newText}`.length < length) {
    newText = `${char}${newText}`;
  }

  return newText;
}

export function utf8ToHex(str: string) {
  return Array.from(str)
    .map(c => (c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()))
    .join('');
}

export function hexToUtf8(hex: string) {
  return decodeURIComponent(`%${hex.match(/.{1,2}/g)?.join('%')}`);
}

export function rectIntersects(rect1: Rect, rect2: Rect) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect2.x < rect1.x + rect1.width &&
    rect1.y < rect2.y + rect2.height &&
    rect2.y < rect1.y + rect1.height
  );
}

export function inRadius(circle: Circle, rect: Rect) {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > rect.width / 2 + circle.r || distY > rect.height / 2 + circle.r) {
    return false;
  }

  if (distX <= rect.width / 2 || distY <= rect.height / 2) {
    return true;
  }

  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;

  return dx * dx + dy * dy <= circle.r * circle.r;
}

export function inPolygon(point: Vector, vertices: Vector[]) {
  const total = vertices.length;
  let inside = false;

  for (let i = 0, j = total - 1; i < total; j = i++) {
    if (
      vertices[i][1] > point[1] != vertices[j][1] > point[1] &&
      point[0] < ((vertices[j][0] - vertices[i][0]) * (point[1] - vertices[i][1])) / (vertices[j][1] - vertices[i][1]) + vertices[i][0]
    ) {
      inside = !inside;
    }
  }

  return inside;
}
