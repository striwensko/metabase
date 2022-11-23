import fs from "fs";
import pngjs from "pngjs";
import jpeg from "jpeg-js";

import {
  Settings,
  Color,
  ColorsData,
  ImageData,
  DecodedImage,
  Point,
  Position,
} from "types";
import { getAvatarsFromColor } from "./getAvatarsFromColor";
import { getColorsFromAvatar } from "./getColorFromAvatar";

const loadImage = (url: string): Promise<DecodedImage> => {
  const extension = (url.split(/\./).pop() ?? "").toLowerCase();

  if (extension === "png") {
    return new Promise((resolve: (image: DecodedImage) => void) => {
      fs.createReadStream(url)
        .pipe(
          new pngjs.PNG({
            filterType: 4,
          })
        )
        .on("parsed", function (img) {
          resolve(this);
        });
    });
  }
  return new Promise((resolve: (image: DecodedImage) => void) => {
    const jpegData = fs.readFileSync(url);
    const rawImageData = jpeg.decode(jpegData);
    resolve(rawImageData);
  });
};
const saveImage = (data: ImageData, url: string) => {
  const jpegImageData = jpeg.encode(
    {
      data: data.buffer,
      height: data.height,
      width: data.width,
    },
    100
  );
  fs.writeFile(url, jpegImageData.data, () => {});
};
const createBufferFromColors = (data: ColorsData) => {
  const { columns, rows, data: colors } = data;
  const bytes = Buffer.alloc(columns * rows * 4, 0xff);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const color = colors[col][row];
      const byte = 4 * (col + row * columns);
      bytes[byte + 0] = color.red << 5;
      bytes[byte + 1] = color.green << 5;
      bytes[byte + 2] = color.blue << 5;
    }
  }
  return bytes;
};
const extractColors = (settings: Settings, image: DecodedImage): ColorsData => {
  const columns = Math.floor(image.width / settings.coverGridSize);
  const rows = Math.floor(image.height / settings.coverGridSize);
  const colors: Color[][] = new Array(columns);
  for (let col = 0; col < columns; col++) {
    colors[col] = new Array(rows);
    for (let row = 0; row < rows; row++) {
      const x = (col * settings.coverGridSize + settings.coverGridSize / 2) | 0;
      const y = (row * settings.coverGridSize + settings.coverGridSize / 2) | 0;
      const index = (x + image.width * y) * 4;
      colors[col][row] = {
        blue: (image.data[index + 2] & 0xe0) >> 5,
        green: (image.data[index + 1] & 0xe0) >> 5,
        red: (image.data[index + 0] & 0xe0) >> 5,
      };
    }
  }
  return { data: colors, columns, rows };
};

const createMosaicFromColors = (
  settings: Settings,
  pools: Position[][],
  data: ColorsData,
  avatarsImage: DecodedImage
) => {
  const { avatarSize } = settings;
  const { columns, rows, data: colors } = data;
  const bytes = Buffer.alloc(
    avatarSize * avatarSize * columns * rows * 4,
    0xff
  );
  const colorRatio = 0.5;
  const imageRatio = 1 - colorRatio;
  const avatars: Position[][] = new Array(columns);
  for (let col = 0; col < columns; col++) {
    avatars[col] = new Array(rows);
    for (let row = 0; row < rows; row++) {
      const color = colors[col][row];
      const pool = getAvatarsFromColor(pools, color);

      const item = pool[Math.floor(pool.length * Math.random())];
      const imageX = item.col * avatarSize;
      const imageY = item.row * avatarSize;

      const red = (colorRatio * (color.red << 5)) | 0;
      const green = (colorRatio * (color.green << 5)) | 0;
      const blue = (colorRatio * (color.blue << 5)) | 0;

      avatars[col][row] = item;
      for (let x = 0; x < avatarSize; x += 1) {
        for (let y = 0; y < avatarSize; y += 1) {
          const _x = avatarSize * col + x;
          const _y = avatarSize * row + y;
          const byte = 4 * (_x + _y * columns * avatarSize);
          const avatarPixelPosition =
            (imageX + x + avatarsImage.width * (imageY + y)) * 4;
          bytes[byte + 0] =
            avatarsImage.data[avatarPixelPosition + 0] * imageRatio + red;
          bytes[byte + 1] =
            avatarsImage.data[avatarPixelPosition + 1] * imageRatio + green;
          bytes[byte + 2] =
            avatarsImage.data[avatarPixelPosition + 2] * imageRatio + blue;
          // console.log(item);
        }
      }
    }
  }
  return { bytes, avatars };
};
const buildMosaic = async (settings: Settings) => {
  const { avatarSize } = settings;
  const image = await loadImage(settings.coverUrl);
  const avatarsImage = await loadImage(settings.avatarsUrl);
  console.log(avatarsImage.width, avatarsImage.height);
  console.log(image.width, image.height, settings);
  const colors = extractColors(settings, image);
  const buffer = createBufferFromColors(colors);
  saveImage(
    { buffer, width: colors.columns, height: colors.rows },
    settings.samplingUrl
  );
  const pools = getColorsFromAvatar(avatarsImage, settings.avatarSize);

  const mosaic = createMosaicFromColors(settings, pools, colors, avatarsImage);
  saveImage(
    {
      buffer: mosaic.bytes,
      width: colors.columns * avatarSize,
      height: colors.rows * avatarSize,
    },
    settings.exportUrl
  );
  fs.writeFile(
    settings.exportUrlJSON,
    JSON.stringify(mosaic.avatars),
    () => {}
  );
};

buildMosaic({
  avatarSize: 32,
  avatarsUrl: "./albums/source.jpg",
  samplingUrl: "./albums/sampling.jpg",
  coverUrl: "./albums/Rihanna_-_Loud.png",
  exportUrl: "./albums/mosaic.jpg",
  exportUrlJSON: "./albums/avatars.json",
  // 300 image size we want 30 cols
  coverGridSize: 300 / 100,
});
