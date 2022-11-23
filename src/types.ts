export type Settings = {
  avatarsUrl: string;
  avatarSize: 24 | 32 | 64;
  samplingUrl: string;
  coverUrl: string;
  coverGridSize: number;
  exportUrl: string;
  exportUrlJSON: string;
};
export type Color = {
  red: number;
  green: number;
  blue: number;
};
export type ColorsData = {
  data: Color[][];
  columns: number;
  rows: number;
};
export type ImageData = {
  buffer: Buffer;
  width: number;
  height: number;
};
export type DecodedImage = { width: number; height: number; data: Buffer };
export type Point = { x: number; y: number };
export type Position = { col: number; row: number };
