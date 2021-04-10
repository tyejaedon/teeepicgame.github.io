class level extends Phaser.Scene{
constructor(key){
  super(key);
  this.levelKey = key
  this.nextLevel = {
    'Level1': 'Level2',
      'Level2': 'Level3',
      'Level3': 'Level4',
      'Level4': 'Credits',
  }

}


preload(){

this.load.spritesheet('player','https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey.png', { frameWidth: 72, frameHeight: 90});
this.load.spritesheet('savepoint','https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/campfire.png', { frameWidth: 32, frameHeight: 32});
this.load.image('background1','assets/background.jfif');
this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/platform.png');
this.load.image('lava','assets/lava floor.png');


}

create(){
  gameState.active = true;

 gameState.player = this.physics.add.sprite(125, 110, 'player').setScale(.5);
 gameState.platforms = this.physics.add.staticGroup();
gameState.lava = this.physics.add.staticGroup();


 this.createAnimations();

    
    this.levelSetup();

    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)
    gameState.player.setCollideWorldBounds(false);

     this.physics.add.collider(gameState.player, gameState.platforms);
    this.physics.add.collider(gameState.goal, gameState.platforms);
    this.physics.add.collider(gameState.player, gameState.lava);

    gameState.cursors = this.input.keyboard.createCursorKeys();
  }

createPlatform(xIndex, yIndex, xIndex1, yIndex1) {
    // Creates a platform evenly spaced along the two indices.
    // If either is not a number it won't make a platform
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {
        gameState.platforms.create((220 * xIndex),  yIndex * 70, 'platform').setOrigin(0, 0.5).refreshBody();
      }
      if (typeof yIndex1 === 'number' && typeof xIndex1 === 'number') {
        gameState.lava.create((900 * xIndex1),  yIndex1 * 900, 'lava').setOrigin(40, 45).refreshBody();
      }

}

createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
          })

this.anims.create({
  key: 'save',
  frames: this.anims.generateFrameNumbers('savepoint',{start: 0, end: 2}),
})
}
background(){
 this.add.sprite(0,0,'background1');
}
 
 levelSetup() {
    for (const [xIndex, yIndex] of this.heights.entries()) {
      this.createPlatform(xIndex, yIndex);
    } 
     // Create the campfire at the end of the level
    gameState.goal = this.physics.add.sprite(800, 100, 'savepoint');




}

 update() {
    if(gameState.active){
      gameState.goal.anims.play('fire', true);
      if (gameState.cursors.right.isDown) {
        gameState.player.flipX = false;
        gameState.player.setVelocityX(gameState.speed);
        gameState.player.anims.play('run', true);
      } else if (gameState.cursors.left.isDown) {
        gameState.player.flipX = true;
        gameState.player.setVelocityX(-gameState.speed);
        gameState.player.anims.play('run', true);
      } else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('idle', true);
      }

      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.touching.down) {
        gameState.player.anims.play('jump', true);
        gameState.player.setVelocityY(-600);
      }

      if (!gameState.player.body.touching.down){
        gameState.player.anims.play('jump', true);
      }
      if (gameState.player.y > 1200) {
        this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
          if (progress > .9) {
            this.scene.restart(this.levelKey);
          }
        });
      }
this.physics.add.overlap(gameState.player, gameState.goal, function() {
      this.cameras.main.fade(800, 20, 60, 40, false, function(camera, progress) {
        if (progress > 1) {
          this.scene.stop(this.levelKey);
          this.scene.start(this.nextLevel[this.levelKey]);
        }
      });
    }, null, this);
}
}
}


class Level1 extends level {
  constructor() {
    super('Level1');
    this.heights = [4, 7, 4, null, 2, 4, null, 4, 4];
  }
}

class Level2 extends level {
  constructor() {
    super('Level2');
    this.heights = [4, 7, 5, null, 5, 4, null, 4, 4];
    
  }
}

class Level3 extends level {
  constructor() {
    super('Level3');
    this.heights = [4, 7, 5, null, 5, 4, null, 4, 4];
    
  }
}

class Level4 extends level {
  constructor() {
    super('Level4');
    this.heights = [4, 7, 5, null, 5, 4, null, 4, 4];
    
  }
}

class Credits extends Phaser.Scene {
  constructor() {
    super('Credits')
  }

  preload() {
    this.load.spritesheet('codey_sled', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey_sled.png', { frameWidth: 81, frameHeight: 90 });
  }

  create() {
    gameState.player = this.add.sprite(config.width / 2, config.height / 2, 'codey_sled');

    this.anims.create({
      key: 'sled',
      frames: this.anims.generateFrameNumbers('codey_sled'),
      frameRate: 10,
      repeat: -1
    })

    gameState.player.angle = 20;
    this.add.text(150,150, 'created by Jaedon Munyua click on refresh to play again!',{fontSize: '15px', fill: '000000'})
    this.input.on('pointerup',function(){
      this.scene.restart(level);
    })
  }

  update() {
    gameState.player.anims.play('sled', true);
  }
}

























const gameState = {
  speed: 240,
  ups: 600,
};

const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 600,
  fps: {target: 60},
  backgroundColor: "b9eaff",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      enableBody: true,

    }
  },
  scene: [Level1, Level2, Level3, Level4, Credits]
};

const game = new Phaser.Game(config);