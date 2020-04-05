import { Player } from '../services/realtime/index';
import MessageService from '../services/message';

export default class WorldScene extends Phaser.Scene {

  progressBar: Phaser.GameObjects.Graphics;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  spawns: Phaser.Physics.Arcade.Group;
  player: Phaser.Physics.Arcade.Sprite;
  playerRT: Player;
  msg: MessageService;
  ready = false;
  tempPlayer: any;
  playerId: string;
  otherPlayers = {};

  constructor() {
    super({ key: 'worldScene' });
    this.progressBar = null;
    this.playerRT = new Player();
    this.msg = new MessageService();
  }

  init(data) {
    console.log('WorldScene: ', data, 'this: ', this, 'END');
    // this.playerRT.initData();
    const cachedPlayerId = sessionStorage.getItem('playerId');
    console.log('cachedPlayerId', cachedPlayerId);
    if (cachedPlayerId) {
      this.playerRT.getPlayerById(cachedPlayerId).subscribe((res) => {
        console.log('getPlayerById res', res);
        // this.enterWorld();
        this.tempPlayer = res;
        this.userStorage(cachedPlayerId);
      });
    } else {
      this.enterWorld();
    }
  }

  enterWorld() {
    this.playerRT.getInactivePlayerId().subscribe((playerId) => {
      console.log('getInactivePlayerId res', playerId);
      if (playerId) {
        // to save overhead, re-use the old user data
        // but update with the base data
        const options = {
          name: 'Vinh OLD-GUY',
          status: 'active',
        };
        const userData = this.playerRT.getUserbase(options);
        this.tempPlayer = userData;
        this.playerRT.updatePlayer(playerId, userData).subscribe((res) => {
          console.log('updatePlayer success', res);
          this.userStorage(res);
        });
      } else {
        // create new user data
        console.log('create a new user data');
        const options = {
          name: 'Vinh',
          status: 'active'
        };
        const userData = this.playerRT.getUserbase(options);
        this.tempPlayer = userData;
        this.playerRT.addPlayer(userData).subscribe((res) => {
          console.log('addPlayer success', res);
          this.userStorage(res);
          console.log('this.tempPlayer', this.tempPlayer);
        });
      }
    });
  }

  userStorage(playerId) {
    this.playerId = playerId;
    sessionStorage.setItem('playerId', playerId);
    const ready = true;
    this.msg.sendMessage({ ready });
    this.ready = ready;
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

    console.log('create: subscribe for ready');

    this.msg.subject.subscribe((content) => {
      if (content.ready) {
        console.log('create: make the world!');
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
        this.player = this.physics.add.sprite(this.tempPlayer.props.x, this.tempPlayer.props.y, 'player', 6);

        // Show other players from server
        // this.playerRT.getAllPlayers().subscribe((res) => {
        //   console.log('res', res);
        //   Object.entries(res).forEach(([key]) => {
        //     const player = res[key];
        //     console.log(`${key} ${JSON.stringify(player)}`);
        //     if (key !== this.playerId) {
        //       this.otherPlayers[key] = this.physics.add.sprite(player.props.x, player.props.y, 'player', 6);
        //     }
        //   });
        //   console.log('created otherplayers:', this.otherPlayers);
        // });
        // this.player2 = this.physics.add.sprite(50, 100, 'player', 6);

        // don't go out of the map
        console.log('map.widthInPixels', map.widthInPixels, map.heightInPixels);
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        // this.player2.setCollideWorldBounds(true);

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
        this.playerRT.onAllPlayers().subscribe((res) => {
          console.log('res', res);
          Object.entries(res).forEach(([key]) => {
            const player = res[key];
            console.log(`${key} ${JSON.stringify(player)}`);

            if (key !== this.playerId) {
              if (!this.otherPlayers[key]) {
                console.log('add physics');
                this.otherPlayers[key] = this.physics.add.sprite(player.props.x, player.props.y, 'player', 6);
              }
              this.otherPlayers[key].setPosition(player.props.x, player.props.y);

              // Update the animation last and give left/right animations precedence over up/down animations
              if (player.props.direction === 'left') {
                this.otherPlayers[key].anims.play('left', true);
                this.otherPlayers[key].flipX = true;
              } else if (player.props.direction === 'right') {
                this.otherPlayers[key].anims.play('right', true);
                this.otherPlayers[key].flipX = false;
              } else if (player.props.direction === 'up') {
                this.otherPlayers[key].anims.play('up', true);
              } else if (player.props.direction === 'down') {
                this.otherPlayers[key].anims.play('down', true);
              } else {
                this.otherPlayers[key].anims.stop();
              }
            }
          });
        });
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
    if (this.ready === true) {
      // this.controls.update(delta);
      this.player.setVelocity(0);
      // Object.entries(this.otherPlayers).forEach(([key]) => {
      //   console.log('key', key);
      //   this.otherPlayers[key].setVelocity(0);
      // });
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

      // const newVal = `,${this.player.y},${direction}`;
      const keyVal = {
        props: {
          x: this.player.x,
          y: this.player.y,
          direction: direction,
        },
      };
      if (direction) {
        this.playerRT.updatePlayerAttr(this.playerId, keyVal);
      }

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
