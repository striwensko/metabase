import { Color, Position } from "types";

const getLevel0Explore = (
  IMAGE_POOL: Position[][],
  color: Color
): Position[] => {
  const { red, green, blue } = color;
  let pool: Position[] = [];

  pool = pool.concat(IMAGE_POOL[(red << 6) + (green << 3) + blue]);

  return pool;
};
const getLevel1Explore = (
  IMAGE_POOL: Position[][],
  color: Color
): Position[] => {
  const { red, green, blue } = color;
  let pool: Position[] = [];

  pool = pool.concat(IMAGE_POOL[(red << 6) + (green << 3) + blue]);

  if (red > 0) {
    pool = pool.concat(IMAGE_POOL[((red - 1) << 6) + (green << 3) + blue]);
  }
  if (green > 0) {
    pool = pool.concat(IMAGE_POOL[(red << 6) + ((green - 1) << 3) + blue]);
  }
  if (blue > 0) {
    pool = pool.concat(IMAGE_POOL[(red << 6) + (green << 3) + (blue - 1)]);
  }

  if (red < 7) {
    pool = pool.concat(IMAGE_POOL[((red + 1) << 6) + (green << 3) + blue]);
  }
  if (green < 7) {
    pool = pool.concat(IMAGE_POOL[(red << 6) + ((green + 1) << 3) + blue]);
  }
  if (blue < 7) {
    pool = pool.concat(IMAGE_POOL[(red << 6) + (green << 3) + (blue + 1)]);
  }

  return pool;
};
const getLevel2Explore = (
  IMAGE_POOL: Position[][],
  color: Color
): Position[] => {
  const { red, green, blue } = color;
  let pool: Position[] = [];

  if (red < 7 && green < 7) {
    pool = pool.concat(
      IMAGE_POOL[((red + 1) << 6) + ((green + 1) << 3) + blue]
    );
  }
  if (red < 7 && blue < 7) {
    pool = pool.concat(
      IMAGE_POOL[((red + 1) << 6) + (green << 3) + (blue + 1)]
    );
  }
  if (blue < 7 && green < 7) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green + 1) << 3) + (blue + 1)]
    );
  }

  if (red > 0 && green > 0) {
    pool = pool.concat(
      IMAGE_POOL[((red - 1) << 6) + ((green - 1) << 3) + blue]
    );
  }
  if (red > 0 && blue > 0) {
    pool = pool.concat(
      IMAGE_POOL[((red - 1) << 6) + (green << 3) + (blue - 1)]
    );
  }
  if (blue > 0 && green > 0) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green - 1) << 3) + (blue - 1)]
    );
  }

  if (red > 0 && green < 7) {
    pool = pool.concat(
      IMAGE_POOL[((red - 1) << 6) + ((green + 1) << 3) + blue]
    );
  }
  if (red > 0 && blue < 7) {
    pool = pool.concat(
      IMAGE_POOL[((red - 1) << 6) + (green << 3) + (blue + 1)]
    );
  }
  if (blue > 0 && green < 7) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green + 1) << 3) + (blue - 1)]
    );
  }

  if (red < 7 && green > 0) {
    pool = pool.concat(
      IMAGE_POOL[((red + 1) << 6) + ((green - 1) << 3) + blue]
    );
  }
  if (red < 7 && blue > 0) {
    pool = pool.concat(
      IMAGE_POOL[((red + 1) << 6) + (green << 3) + (blue - 1)]
    );
  }
  if (blue < 7 && green > 0) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green - 1) << 3) + (blue + 1)]
    );
  }

  if (red > 1) {
    pool = pool.concat(IMAGE_POOL[((red - 2) << 6) + (green << 3) + blue]);
  }
  if (green > 1) {
    pool = pool.concat(IMAGE_POOL[(red << 6) + ((green - 2) << 3) + blue]);
  }
  if (blue > 1) {
    pool = pool.concat(IMAGE_POOL[(red << 6) + (green << 3) + (blue - 2)]);
  }

  if (red < 6) {
    pool = pool.concat(IMAGE_POOL[((red + 2) << 6) + (green << 3) + blue]);
  }
  if (green < 6) {
    pool = pool.concat(IMAGE_POOL[(red << 6) + ((green + 2) << 3) + blue]);
  }
  if (blue < 6) {
    pool = pool.concat(IMAGE_POOL[(red << 6) + (green << 3) + (blue + 2)]);
  }

  return pool;
};
const getLevel3Explore = (
  IMAGE_POOL: Position[][],
  color: Color
): Position[] => {
  const { red, green, blue } = color;
  let pool: Position[] = [];

  if (red < 7 && green < 7 && blue < 7) {
    pool = pool.concat(
      IMAGE_POOL[((red + 1) << 6) + ((green + 1) << 3) + (blue + 1)]
    );
  }
  if (red > 0 && green > 0 && blue > 0) {
    pool = pool.concat(
      IMAGE_POOL[((red - 1) << 6) + ((green - 1) << 3) + (blue - 1)]
    );
  }

  if (red < 6 && green < 7) {
    pool = pool.concat(
      IMAGE_POOL[((red + 2) << 6) + ((green + 1) << 3) + blue]
    );
  }
  if (green < 6 && blue < 7) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green + 2) << 3) + (blue + 1)]
    );
  }
  if (blue < 6 && red < 7) {
    pool = pool.concat(
      IMAGE_POOL[((red + 1) << 6) + (green << 3) + (blue + 2)]
    );
  }

  if (red < 7 && green < 6) {
    pool = pool.concat(
      IMAGE_POOL[((red + 1) << 6) + ((green + 2) << 3) + blue]
    );
  }
  if (green < 7 && blue < 6) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green + 1) << 3) + (blue + 2)]
    );
  }
  if (blue < 7 && red < 6) {
    pool = pool.concat(
      IMAGE_POOL[((red + 2) << 6) + (green << 3) + (blue + 1)]
    );
  }

  if (red > 1 && green > 0) {
    pool = pool.concat(
      IMAGE_POOL[((red - 2) << 6) + ((green - 1) << 3) + blue]
    );
  }
  if (green > 1 && blue > 0) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green - 2) << 3) + (blue - 1)]
    );
  }
  if (blue > 1 && red > 0) {
    pool = pool.concat(
      IMAGE_POOL[((red - 1) << 6) + (green << 3) + (blue - 2)]
    );
  }

  if (red > 0 && green > 1) {
    pool = pool.concat(
      IMAGE_POOL[((red - 1) << 6) + ((green - 2) << 3) + blue]
    );
  }
  if (green > 0 && blue > 1) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green - 1) << 3) + (blue - 2)]
    );
  }
  if (blue > 0 && red > 1) {
    pool = pool.concat(
      IMAGE_POOL[((red - 2) << 6) + (green << 3) + (blue - 1)]
    );
  }

  if (red < 6 && green > 0) {
    pool = pool.concat(
      IMAGE_POOL[((red + 2) << 6) + ((green - 1) << 3) + blue]
    );
  }
  if (green < 6 && blue > 0) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green + 2) << 3) + (blue - 1)]
    );
  }
  if (blue < 6 && red > 0) {
    pool = pool.concat(
      IMAGE_POOL[((red - 1) << 6) + (green << 3) + (blue + 2)]
    );
  }

  if (red > 0 && green < 6) {
    pool = pool.concat(
      IMAGE_POOL[((red - 1) << 6) + ((green + 2) << 3) + blue]
    );
  }
  if (green > 0 && blue < 6) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green - 1) << 3) + (blue + 2)]
    );
  }
  if (blue > 0 && red < 6) {
    pool = pool.concat(
      IMAGE_POOL[((red + 2) << 6) + (green << 3) + (blue - 1)]
    );
  }

  if (red > 1 && green < 7) {
    pool = pool.concat(
      IMAGE_POOL[((red - 2) << 6) + ((green + 1) << 3) + blue]
    );
  }
  if (green > 1 && blue < 7) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green - 2) << 3) + (blue + 1)]
    );
  }
  if (blue > 1 && red < 7) {
    pool = pool.concat(
      IMAGE_POOL[((red + 1) << 6) + (green << 3) + (blue - 2)]
    );
  }

  if (red < 7 && green > 1) {
    pool = pool.concat(
      IMAGE_POOL[((red + 1) << 6) + ((green - 2) << 3) + blue]
    );
  }
  if (green < 7 && blue > 1) {
    pool = pool.concat(
      IMAGE_POOL[(red << 6) + ((green + 1) << 3) + (blue - 2)]
    );
  }
  if (blue < 7 && red > 1) {
    pool = pool.concat(
      IMAGE_POOL[((red - 2) << 6) + (green << 3) + (blue + 1)]
    );
  }

  return pool;
};

export const getAvatarsFromColor = (IMAGE_POOL: Position[][], color: Color) => {
  let pool = getLevel0Explore(IMAGE_POOL, color);
  if (pool.length > 6) {
    return pool;
  }
  pool = getLevel1Explore(IMAGE_POOL, color);
  if (pool.length > 6) {
    return pool;
  }
  pool = getLevel2Explore(IMAGE_POOL, color);
  if (pool.length > 6) {
    return pool;
  }
  return getLevel3Explore(IMAGE_POOL, color);
};
