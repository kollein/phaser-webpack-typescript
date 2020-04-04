import RealtimeService from '../services/realtime';

// const realtimeService = new RealtimeService();

export default class WorldScene extends Phaser.Scene {

  progressBar: Phaser.GameObjects.Graphics;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  spawns: Phaser.Physics.Arcade.Group;
  realtimeService: RealtimeService;
  player: Phaser.Physics.Arcade.Sprite;
  player2: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super('default');
    this.progressBar = null;
    this.realtimeService = new RealtimeService();
  }

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
    // create the map
    const map = this.make.tilemap({ key: 'map' });

    // first parameter is the name of the tilemap in tiled
    const tiles = map.addTilesetImage('spritesheet', 'tiles');

    // creating the layers
    const grass = map.createStaticLayer('Grass', tiles, 0, 0);
    const obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);

    // make all tiles in obstacles collidable
    obstacles.setCollisionByExclusion([-1]);

    //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
      frameRate: 10,
      repeat: -1
    });

    // animation with key 'right'
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { frames: [0, 6, 0, 12] }),
      frameRate: 10,
      repeat: -1
    });

    // our player sprite created through the phycis system
    this.player = this.physics.add.sprite(50, 100, 'player', 6);
    this.player2 = this.physics.add.sprite(50, 100, 'player', 6);

    // don't go out of the map
    console.log('map.widthInPixels', map.widthInPixels, map.heightInPixels);
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);
    this.player2.setCollideWorldBounds(true);

    // don't walk on trees
    this.physics.add.collider(this.player, obstacles);
    // this.physics.add.collider(this.player2, obstacles);

    // limit camera to map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true; // avoid tile bleed

    // user input
    this.cursors = this.input.keyboard.createCursorKeys();

    // where the enemies will be
    this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      // parameters are x, y, width, height
      this.spawns.create(x, y);
    }
    // add collider
    this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, null, this);

    // Listen to Server
    this.realtimeService.onUser(1).subscribe((res) => {
      console.log('res', res);
      const coords = res.split(',');
      const x = parseFloat(coords[0]) - 40;
      const y = parseFloat(coords[1]);
      const direction = coords[2];
      console.log('coords', x, y, direction);
      console.log('player2', this.player2);
      this.player2.setPosition(x, y);

      // Update the animation last and give left/right animations precedence over up/down animations
      if (direction === 'left') {
        this.player2.anims.play('left', true);
        this.player2.flipX = true;
      } else if (direction === 'right') {
        this.player2.anims.play('right', true);
        this.player2.flipX = false;
      } else if (direction === 'up') {
        this.player2.anims.play('up', true);
      } else if (direction === 'down') {
        this.player2.anims.play('down', true);
      } else {
        this.player2.anims.stop();
      }
    });
  }

  onMeetEnemy(player, zone) {
    // we move the zone to some other location
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

    // shake the world
    // this.cameras.main.shake(300);
    // start battle
  }

  update(time, delta) {
    //    this.controls.update(delta);
    this.player.setVelocity(0);
    let direction;
    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-80);
      direction = 'left';
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(80);
      direction = 'right';
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-80);
      direction = 'up';
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(80);
      direction = 'down';
    }

    const newVal = `${this.player.x},${this.player.y},${direction}`;
    this.realtimeService.updateUser(1, newVal);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play('left', true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.anims.play('right', true);
      this.player.flipX = false;
    } else if (this.cursors.up.isDown) {
      this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play('down', true);
    } else {
      this.player.anims.stop();
    }
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
