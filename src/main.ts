import 'phaser';
import WorldScene from './scenes/worldScene';

const game = new Phaser.Game({
  // See <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
  width: 480,
  height: 450,
  zoom: 2,
  resolution: 1,
  type: Phaser.AUTO,
  // parent: null,
  // canvas: null,
  // canvasStyle: null,
  // seed: null,
  title: '☕️ Webpack with Phaser and TypeScript', // 'My Phaser 3 Game'
  url: 'https://github.com/kollein/phaser-webpack-typescript',
  version: '0.0.1',
  // input: {
  //   keyboard: true,
  //   mouse: true,
  //   touch: true,
  //   gamepad: false
  // },
  // disableContextMenu: false,
  // banner: false
  banner: {
    // hidePhaser: false,
    // text: 'white',
    background: ['#e54661', '#ffa644', '#998a2f', '#2c594f', '#002d40']
  },
  // fps: {
  //   min: 10,
  //   target: 60,
  //   forceSetTimeout: false,
  // },
  // antialias: false,
  // pixelArt: false,
  // transparent: false,
  // clearBeforeRender: true,
  // backgroundColor: 0x000000, // black
  loader: {
    // baseURL: '',
    path: 'assets/',
    // maxParallelDownloads: 32,
    // crossOrigin: 'anonymous',
    // timeout: 0
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: true // set to true to view zones
    }
  },
  scene: [WorldScene]
});