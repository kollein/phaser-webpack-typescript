import MessageService from '../services/message';

export default class ServerScene extends Phaser.Scene {

  progressBar: Phaser.GameObjects.Graphics;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  spawns: Phaser.Physics.Arcade.Group;
  player: Phaser.Physics.Arcade.Sprite;
  player2: Phaser.Physics.Arcade.Sprite;
  msg: MessageService;
  ready = false;
  tempPlayer: any;

  constructor() {
    super({ key: 'serverScene' });
    this.progressBar = null;
    this.msg = new MessageService();
  }

  init(data) {
    console.log('ServerScene: ', data, 'this: ', this, 'END');
  }

  preload() { }

  create() {

    console.log('create: server!');

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

    // don't go out of the map
    this.player.setCollideWorldBounds(true);

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
    // this.realtimeService.onUser(1).subscribe((res) => {
    //   console.log('res', res);
    //   const coords = res.split(',');
    //   const x = parseFloat(coords[0]) - 40;
    //   const y = parseFloat(coords[1]);
    //   const direction = coords[2];
    //   console.log('coords', x, y, direction);
    //   console.log('player2', this.player2);
    //   this.player2.setPosition(x, y);

    //   // Update the animation last and give left/right animations precedence over up/down animations
    //   if (direction === 'left') {
    //     this.player2.anims.play('left', true);
    //     this.player2.flipX = true;
    //   } else if (direction === 'right') {
    //     this.player2.anims.play('right', true);
    //     this.player2.flipX = false;
    //   } else if (direction === 'up') {
    //     this.player2.anims.play('up', true);
    //   } else if (direction === 'down') {
    //     this.player2.anims.play('down', true);
    //   } else {
    //     this.player2.anims.stop();
    //   }
    // });
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
    // this.controls.update(delta);
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

    // const newVal = `${this.player.x},${this.player.y},${direction}`;
    // this.realtimeService.updateUser(1, newVal);

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

}
