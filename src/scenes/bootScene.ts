export default class BootScene extends Phaser.Scene {

  progressBar: Phaser.GameObjects.Graphics;

  constructor() {
    super('default');
    this.progressBar = null;
  }

  // init1(data) {
  //   console.log('init: ', data, 'this: ', this, 'END');
  // }

  // preload1() {
  //   this.load.image('sky', 'space3.png');
  //   this.load.image('logo', 'phaser3-logo.png');
  //   this.progressBar = this.add.graphics();
  //   this.load.on('progress', this.onLoadProgress, this);
  //   this.load.on('complete', this.onLoadComplete, this);
  // }

  // create1() {
  //   const sky = this.add.image(400, 300, 'sky');
  //   sky.alpha = 0.5;
  //   const logo = this.physics.add.image(400, 100, 'logo');
  //   logo.setVelocity(100, 200);
  //   logo.setBounce(1, 1);
  //   logo.setCollideWorldBounds(true);
  // }

  init(data) {
    console.log('init1: ', data, 'this: ', this, 'END');
  }

  preload() {
    // map tiles
    this.load.image('tiles', './map/spritesheet.png');

    // map in json format
    this.load.tilemapTiledJSON('map', './map/map.json');

    // our two characters
    this.load.spritesheet('player', './map/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
  }

  create() {
    // start the WorldScene
    // this.scene.start('WorldScene');
    console.log('create here');
  }




  // extend:

  onLoadComplete(loader, totalComplete, totalFailed) {
    console.log('complete', totalComplete);
    console.log('failed', totalFailed);
    this.progressBar.destroy();
  }

  onLoadProgress(progress) {
    console.log('progress', progress);
    this.progressBar
      .clear()
      .fillStyle(0xffffff, 0.75)
      .fillRect(0, 0, 800 * progress, 50);
  }
}
