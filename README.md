## Installation

To install the project be sure you have node and npm installed
Node Version used: v16.13.2
Npm Version used: 8.1.2

## Run the project

Use `npm run mosaic albums/rihanna` to build the project which will be located at `/albums/rihanna/settings.json`.

## Config

An example of the settings for the project is the following:

```
{
  avatarSize: 32,
  avatarsUrl: './demo/source.jpg',
  samplingUrl: './demo/sampling.jpg',
  mosaicColumns: 100,
  coverUrl: './demo/Rihanna_-_Loud.png',
  exportUrl: './demo/mosaic.jpg',
  exportUrlJSON: './demo/avatars.json'
}
```

avatarSize: The size of avatar in px inside avatars url
avatarsUrl: The url that contains the collection of avatars
samplingUrl: Url where the colors used for the mosaic will be exported
mosaicColumns: The number of columns desired for the mosaic
coverUrl: The image from which the mosaic will be build
exportUrl: Path where the mosaic will be exported
exportUrlJSON: Path where the json representation of the mosaic will be exported.

## Demo

This project has a demo which can be run with the following command:
`npm run mosaic demo`
