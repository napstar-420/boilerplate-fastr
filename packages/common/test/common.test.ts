import { expect, suite, test } from 'vitest';

import {
  asc,
  capitalizeFirst,
  clamp,
  decToHex,
  desc,
  enumToString,
  fixedArray,
  force2DVector,
  hexToUtf8,
  inPolygon,
  inRadius,
  lerp,
  pad,
  rand,
  rectIntersects,
  rgbToHex,
  sleep,
  utf8ToHex,
  type Circle,
  type Rect,
  type Vector,
} from '../src';

suite('force2DVector', () => {
  test.concurrent('should output a 2d vector if given a 3d vector input', () => {
    expect(force2DVector([1, 2, 3])).toStrictEqual([1, 2]);
  });

  test.concurrent('should output a 2d vector if given a 2d vector input', () => {
    expect(force2DVector([1, 2])).toStrictEqual([1, 2]);
  });

  test.concurrent('should output something if given invalid input', () => {
    // @ts-expect-error
    expect(force2DVector('hi')).toStrictEqual([-1, -1]);
  });
});

suite('rgbToHex', () => {
  test.concurrent('should output a valid hex integer given rgb input (red)', () => {
    expect(rgbToHex([255, 0, 0])).toStrictEqual(0xff0000);
  });

  test.concurrent('should output a valid hex integer given rgb input (green)', () => {
    expect(rgbToHex([0, 255, 0])).toStrictEqual(0x00ff00);
  });

  test.concurrent('should output a valid hex integer given rgb input (blue)', () => {
    expect(rgbToHex([0, 0, 255])).toStrictEqual(0x0000ff);
  });

  test.concurrent('should output a valid hex integer given rgb input (yellow)', () => {
    expect(rgbToHex([255, 255, 0])).toStrictEqual(0xffff00);
  });

  test.concurrent('should output a valid hex integer given invalid input (type)', () => {
    // @ts-expect-error
    expect(rgbToHex('hi')).toStrictEqual(0x000000);
  });

  test.concurrent('should output a valid hex integer given invalid input (lack of blue channel)', () => {
    // @ts-expect-error
    expect(rgbToHex([255, 255])).toStrictEqual(0x000000);
  });
});

suite('rand', () => {
  test.concurrent('should give a number output', () => {
    expect(rand(0, 2)).toBeTypeOf('number');
  });

  test.concurrent('should give a number output if given invalid minimum', () => {
    // @ts-expect-error
    expect(rand('x', 2)).toBeTypeOf('number');
  });

  test.concurrent('should give a number output if given invalid maximum', () => {
    // @ts-expect-error
    expect(rand(0, 'x')).toBeTypeOf('number');
  });
});

suite('fixedArray', () => {
  test.concurrent('should output an empty array of the given length', () => {
    expect(fixedArray(10)).toHaveLength(10);
  });

  test.concurrent('should output an empty array of the given value and length', () => {
    expect(fixedArray(10, 1)[0]).toBe(1);
  });

  test.concurrent('should output an array given invalid length', () => {
    // @ts-expect-error
    expect(fixedArray('x')).toHaveLength(1);
  });
});

suite('clamp', () => {
  test.concurrent('should properly clamp at lowest potential value', () => {
    expect(clamp(10, 15, 25)).toEqual(15);
  });

  test.concurrent('should properly clamp at lowest highest value', () => {
    expect(clamp(30, 15, 25)).toEqual(25);
  });

  test.concurrent('should not clamp when in range of clamp params', () => {
    expect(clamp(20, 15, 25)).toEqual(20);
  });

  test.concurrent('should properly clamp at lowest potential value (negative)', () => {
    expect(clamp(-30, -25, -15)).toEqual(-25);
  });

  test.concurrent('should properly clamp at highest potential value (negative)', () => {
    expect(clamp(-10, -25, -15)).toEqual(-15);
  });

  test.concurrent('should not clamp when in range of clamp params (negative)', () => {
    expect(clamp(-20, -25, -15)).toEqual(-20);
  });

  test.concurrent('should clamp given invalid input', () => {
    // @ts-expect-error
    expect(clamp()).toEqual(0);
  });
});

suite('lerp', () => {
  test.concurrent('should interpolate equally between given values', () => {
    expect(lerp(1, 2, 0.5)).toEqual(1.5);
  });
});

suite('capitalizeFirst', () => {
  test.concurrent('should capitalize start of a word', () => {
    expect(capitalizeFirst('hi')).toEqual('Hi');
  });

  test.concurrent('should capitalize start of a sentence', () => {
    expect(capitalizeFirst('hi world')).toEqual('Hi world');
  });

  test.concurrent('should capitalize start of a multi-line sentence', () => {
    expect(
      capitalizeFirst(`hello
world
123`),
    ).toEqual(`Hello
world
123`);
  });
});

suite('enumToString', () => {
  test.concurrent('should properly convert an enum string', () => {
    expect(enumToString('HELLO_WORLD')).toEqual('Hello World');
  });

  test.concurrent('should properly convert an enum string given invalid input', () => {
    // @ts-expect-error
    expect(enumToString(5)).toStrictEqual('5');
  });
});

suite('sleep', () => {
  test.concurrent('should sleep for the given time', () => {
    expect(sleep(0.5)).resolves.toStrictEqual(undefined);
  });
});

suite('decToHex', () => {
  test.concurrent('should properly output a color string (red)', () => {
    expect(decToHex(0xff0000)).toStrictEqual('ff0000');
  });

  test.concurrent('should properly output a color string (green)', () => {
    expect(decToHex(0x00ff00)).toStrictEqual('00ff00');
  });

  test.concurrent('should properly output a color string (blue)', () => {
    expect(decToHex(0x0000ff)).toStrictEqual('0000ff');
  });

  test.concurrent('should properly output a hex string with additional padding', () => {
    expect(decToHex(0x0000ff, 8)).toStrictEqual('000000ff');
  });
});

suite('asc', () => {
  const mixedArr = [5, '2', '9', 0];
  const arr = [5, 2, 8, 1];

  test.concurrent('should sort an array of integers', () => {
    expect(arr.sort((a, b) => asc(a, b))).toStrictEqual([1, 2, 5, 8]);
  });

  test.concurrent('should sort an array of mixed integer types', () => {
    expect(mixedArr.sort((a, b) => asc(a, b))).toStrictEqual([0, '2', 5, '9']);
  });
});

suite('desc', () => {
  const mixedArr = [5, '2', '9', 0];
  const arr = [5, 2, 8, 1];

  test.concurrent('should sort an array of integers', () => {
    expect(arr.sort((a, b) => desc(a, b))).toStrictEqual([8, 5, 2, 1]);
  });

  test.concurrent('should sort an array of mixed integer types', () => {
    expect(mixedArr.sort((a, b) => desc(a, b))).toStrictEqual(['9', 5, '2', 0]);
  });
});

suite('pad', () => {
  test.concurrent('should properly pad a string', () => {
    expect(pad('hi', 10)).toStrictEqual('00000000hi');
  });

  test.concurrent('should properly pad a string given a number', () => {
    expect(pad(1, 10)).toStrictEqual('0000000001');
  });

  test.concurrent('should properly pad a string with a custom char', () => {
    expect(pad('hi', 10, 'h')).toStrictEqual('hhhhhhhhhi');
  });
});

suite('utf8ToHex', () => {
  test.concurrent('should properly convert a simple emoji to its utf8 contents', () => {
    expect(utf8ToHex('😀')).toStrictEqual('f09f9880');
  });

  test.concurrent('should properly convert a complex emoji to its utf8 contents', () => {
    expect(utf8ToHex('🏳️‍⚧️')).toStrictEqual('f09f8fb3efb88fe2808de29aa7efb88f');
  });
});

suite('hexToUtf8', () => {
  test.concurrent('should properly convertutf8 content to a simple emoji', () => {
    expect(hexToUtf8('f09f9880')).toStrictEqual('😀');
  });

  test.concurrent('should properly convertutf8 content to a complex emoji', () => {
    expect(hexToUtf8('f09f8fb3efb88fe2808de29aa7efb88f')).toStrictEqual('🏳️‍⚧️');
  });
});

suite('rectIntersects', () => {
  const rect1: Rect = {
    x: 0,
    y: 0,
    width: 3,
    height: 3,
  };
  const rect2: Rect = {
    x: 5,
    y: 0,
    width: 1,
    height: 1,
  };

  test.concurrent('should know two rects do not intersect', () => {
    expect(rectIntersects(rect1, rect2)).toStrictEqual(false);
  });

  test.concurrent('should know two rects do intersect on x axis', () => {
    expect(rectIntersects(rect1, { ...rect2, x: 1 })).toStrictEqual(true);
  });

  test.concurrent('should know two rects do intersect on y axis', () => {
    expect(rectIntersects(rect1, { ...rect2, x: 0, y: 1 })).toStrictEqual(true);
  });
});

suite('inRadius', () => {
  const circle: Circle = {
    x: 0,
    y: 0,
    r: 3,
  };
  const rect: Rect = {
    x: 5,
    y: 0,
    width: 1,
    height: 1,
  };

  test.concurrent('should know two objects do not intersect', () => {
    expect(inRadius(circle, rect)).toStrictEqual(false);
  });

  test.concurrent('should know two objects do intersect', () => {
    expect(inRadius(circle, { ...rect, x: 1 })).toStrictEqual(true);
  });
});

suite('inPolygon', () => {
  const polygon: Vector[] = [
    [1, 1],
    [5, 2],
    [5, 5],
    [2, 3],
  ];

  test.concurrent('should know two objects do not intersect', () => {
    expect(inPolygon([0, 0], polygon)).toStrictEqual(false);
  });

  test.concurrent('should know two objects do intersect', () => {
    expect(inPolygon([2, 2], polygon)).toStrictEqual(true);
  });
});
