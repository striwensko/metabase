import { DecodedImage, Point, Position } from "types";

const sample64Avatar = [
  { x: 1 * 8, y: 1 * 8 },
  { x: 5 * 8, y: 1 * 8 },
  { x: 1 * 8, y: 5 * 8 },
  { x: 5 * 8, y: 5 * 8 },
  { x: 3 * 8, y: 3 * 8 },
  { x: 7 * 8, y: 3 * 8 },
  { x: 3 * 8, y: 7 * 8 },
  { x: 7 * 8, y: 7 * 8 },
];
const sample32Avatar = [
  { x: 1 * 4, y: 1 * 4 },
  { x: 5 * 4, y: 1 * 4 },
  { x: 1 * 4, y: 5 * 4 },
  { x: 5 * 4, y: 5 * 4 },
  { x: 3 * 4, y: 3 * 4 },
  { x: 7 * 4, y: 3 * 4 },
  { x: 3 * 4, y: 7 * 4 },
  { x: 7 * 4, y: 7 * 4 },
];
const sample24Avatar = [
  { x: 1 * 3, y: 1 * 3 },
  { x: 5 * 3, y: 1 * 3 },
  { x: 1 * 3, y: 5 * 3 },
  { x: 5 * 3, y: 5 * 3 },
  { x: 3 * 3, y: 3 * 3 },
  { x: 7 * 3, y: 3 * 3 },
  { x: 3 * 3, y: 7 * 3 },
  { x: 7 * 3, y: 7 * 3 },
];
const getSamplingGrid = (avatarSize: 24 | 32 | 64): Point[] => {
  if (avatarSize == 64) {
    return sample64Avatar;
  } else if (avatarSize == 32) {
    return sample32Avatar;
  }
  return sample24Avatar;
};
export const getColorsFromAvatar = (
  data: DecodedImage,
  avatarSize: 24 | 32 | 64
): Position[][] => {
  const cols = data.width / avatarSize;
  const rows = data.height / avatarSize;
  const sampleGrid = getSamplingGrid(avatarSize);
  const IMAGE_POOL: Position[][] = new Array(8 * 8 * 8);
  for (let iBucket = 0; iBucket < IMAGE_POOL.length; iBucket++) {
    IMAGE_POOL[iBucket] = [];
  }

  for (let col = 0; col < cols; col += 1) {
    for (let row = 0; row < rows; row += 1) {
      const offsetX = avatarSize * col;
      const offsetY = avatarSize * row;
      const colors = new Array(sampleGrid.length);

      for (let iPixel = 0; iPixel < colors.length; iPixel += 1) {
        const tmpX = offsetX + sampleGrid[iPixel].x;
        const tmpY = offsetY + sampleGrid[iPixel].y;
        const index = (tmpX + tmpY * data.width) * 4;

        colors[iPixel] = {
          red: data.data[index],
          green: data.data[index + 1],
          blue: data.data[index + 2],
        };
        //console.log(JSON.stringify(colors [iPixel]))
      }

      let minPixel = 0;
      let minDiff = 0xffffff;
      for (let iPixel = 0; iPixel < colors.length; iPixel++) {
        //color =
        colors[iPixel].diff = 0;
        for (let cPixel = 0; cPixel < colors.length; cPixel++) {
          colors[iPixel].diff += Math.abs(
            colors[iPixel].red - colors[cPixel].red
          );
          colors[iPixel].diff += Math.abs(
            colors[iPixel].green - colors[cPixel].green
          );
          colors[iPixel].diff += Math.abs(
            colors[iPixel].blue - colors[cPixel].blue
          );
        }
        //trace(colors[iPixel].diff);
        if (colors[iPixel].diff < minDiff) {
          minPixel = iPixel;
          minDiff = colors[iPixel].diff;
        }
      }

      const red = (colors[minPixel].red & 0xe0) >> 5;
      const green = (colors[minPixel].green & 0xe0) >> 5;
      const blue = (colors[minPixel].blue & 0xe0) >> 5;
      let poolID = (red << 6) + (green << 3) + blue;
      const item = { col, row };

      IMAGE_POOL[poolID].push(item);
      if (blue < 7) {
        poolID = (red << 6) + (green << 3) + (blue + 1);
        IMAGE_POOL[poolID].push(item);
      }
      if (blue > 0) {
        poolID = (red << 6) + (green << 3) + (blue - 1);
        IMAGE_POOL[poolID].push(item);
      }

      if (green < 7) {
        poolID = (red << 6) + ((green + 1) << 3) + blue;
        IMAGE_POOL[poolID].push(item);
      }
      if (green > 0) {
        poolID = (red << 6) + ((green - 1) << 3) + blue;
        IMAGE_POOL[poolID].push(item);
      }

      if (red < 7) {
        poolID = ((red + 1) << 6) + (green << 3) + blue;
        IMAGE_POOL[poolID].push(item);
      }
      if (red > 0) {
        poolID = ((red - 1) << 6) + (green << 3) + blue;
        IMAGE_POOL[poolID].push(item);
      }
    }
  }

  return IMAGE_POOL;
};
