class Level extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.levelKey = key
    this.nextLevel = {
      'Level1': 'Level2',
      'Level2': 'Level3',
      'Level3': 'Level4',
      'Level4': 'Credits',
      'credits':'Level1',
  }
}


preload(){

this.load.spritesheet('player','assets/spritestrip.png',{ frameWidth: 256, frameHeight: 256});
this.load.spritesheet('savepoint','https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/campfire.png', { frameWidth: 32, frameHeight: 32});
this.load.image('bg3','https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/snowdunes.png');
this.load.image('platform', 'assets/platform1.png');
this.load.image('bg1', 'assets/background 1.png');
    this.load.image('bg2', 'assets/poko.png');
this.load.image('snowflake', 'assets/star.png');
    this.load.image('lava', 'assets/lava floor.png');
    this.load.audio('All in','assets/song.mp3')
}

create(){
  gameState.active = true;

gameState.bgColor = this.add.rectangle(0, 0, config.width, config.height, 0x00ffbb).setOrigin(0, 0);
    this.createParallaxBackgrounds()


 gameState.player = this.physics.add.sprite(125, 110, 'player').setScale(.4);
 gameState.platforms = this.physics.add.staticGroup();
    gameState.lava = this.physics.add.staticGroup()

   
   
    
 this.createAnimations();

    this.createSnow();

    this.levelSetup();
this.cameras.main.setBounds(0, 0, gameState.bg3.width, gameState.bg3.height);
    this.physics.world.setBounds(0, 0, gameState.width, gameState.bg3 .height + gameState.player.height);

    this.cameras.main.startFollow(gameState.player, true, 1, 0.5)
    gameState.player.setCollideWorldBounds(false);

     this.physics.add.collider(gameState.player, gameState.platforms);
    this.physics.add.collider(gameState.goal, gameState.platforms);
    

    gameState.cursors = this.input.keyboard.createCursorKeys();
  }

createPlatform(xIndex, yIndex) {
    // Creates a platform evenly spaced along the two indices.
    // If either is not a number it won't make a platform
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {
        gameState.platforms.create((260 * xIndex),  yIndex * 70, 'platform').setOrigin(0, 0.5).refreshBody(30);

}
}
createLava(xIndex, yIndex, xIndex1, yIndex1){
        gameState.lava.create(-50, 600, 'lava').refreshBody();
}
    
 createSnow() {
    gameState.particles = this.add.particles('snowflake');

    gameState.emitter = gameState.particles.createEmitter({
      x: {min: 0, max: config.width * 2 },
      y: -5,
      lifespan: 1500,
      speedX: { min:-5, max: -160 },
      speedY: { min: 240, max: 260 },
      scale: { start: 0.9, end: 0 },
      quantity: 4,
      blendMode: 'ADD'
    })

    gameState.emitter.setScrollFactor(0);
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
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 1 }),
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

 
createParallaxBackgrounds() {
    gameState.bg1 = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg1');
    
    gameState.bg1.displayWidth = this.sys.canvas.width;
        gameState.bg1.displayHeight = this.sys.canvas.height;
    
        gameState.bg2 = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg2');
    
    gameState.bg2.displayWidth = this.sys.canvas.width;
        gameState.bg2.displayHeight = this.sys.canvas.height;
    
    
    
    gameState.bg3 = this.add.image(0, 0, 'bg3');

    
   
    gameState.bg3.setOrigin(0, 0);

    const game_width = parseFloat(gameState.bg3.getBounds().width)
    gameState.width = game_width;
    const window_width = config.width

    const bg1_width = gameState.bg1.getBounds().width
    const bg2_width = gameState.bg2.getBounds().width
    const bg3_width = gameState.bg3.getBounds().width

    gameState.bgColor .setScrollFactor(0);
    gameState.bg1.setScrollFactor((bg1_width - window_width) / (game_width - window_width));
    gameState.bg2.setScrollFactor((bg2_width - window_width) / (game_width - window_width));
  }


 levelSetup() {
    for (const [xIndex, yIndex] of this.heights.entries()) {
      this.createPlatform(xIndex, yIndex);
        this.createLava();
    } 
     // Create the campfire at the end of the level
gameState.goal = this.physics.add.sprite(gameState.width - 40, 100, 'savepoint').setScale(1);


    this.physics.add.overlap(gameState.player, gameState.goal, function() {
      this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
        if (progress > .9) {
          this.scene.stop(this.levelKey);
          this.scene.start(this.nextLevel[this.levelKey]);
        }
      });
    }, null, this);

this.setWeather(this.weather);


}

 update() {
    if(gameState.active){
      gameState.goal.anims.play('save', true);
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

      

}

}

setWeather(weather) {
    const weathers = {

      'morning': {
        'color': 0xecdccc,
        'snow':  1,
        'wind':  20,
        'bgColor': 0xF8c3a8,
      },

      'afternoon': {
        'color': 0xffffff,
        'snow':  1,
        'wind': 80,
        'bgColor': 0x057F9F,
      },

      'twilight': {
        'color': 0xccaacc,
        'bgColor': 0x18235C,
        'snow':  10,
        'wind': 200,
      },

      'night': {
        'color': 0x555555,
        'bgColor': 0x000000,
        'snow':  0,
        'wind': 0,
      }
      }
  
    let { color, bgColor, snow, wind } = weathers[weather];
    gameState.bg1.setTint(color);
    gameState.bg2.setTint(color);
    gameState.bg3.setTint(color);
    gameState.bgColor.fillColor = bgColor;
    gameState.emitter.setQuantity(snow);
    gameState.emitter.setSpeedX(-wind);
    gameState.player.setTint(color);
    for (let platform of gameState.platforms.getChildren()) {
      platform.setTint(color);
    }
  }
}


class Level1 extends Level {
  constructor() {
    super('Level1');
    this.heights = [4, 7, 4, null, 2, 4, null, 4, 4,null,2,5,null,6,5];
     this.weather = 'morning';
  }
}

class Level2 extends Level {
  constructor() {
    super('Level2');
    this.heights = [5, 9, 3, null, 5, 4, null, 3, 5];
     this.weather = 'afternoon';
  }
}

class Level3 extends Level {
  constructor() {
    super('Level3');
    this.heights = [4, 7, 5, null, 2, 4, null, 4, 4];
     this.weather = 'twilight';
  }
}

class Level4 extends Level {
  constructor() {
    super('Level4');
    this.heights = [3, 7, 4, null, 5, 5, null, 7, 4];
     this.weather = 'night';
  }
}

class Credits extends Phaser.Scene {
  constructor() {
    super('Credits')
  }

  preload() {
    this.load.spritesheet('codey_sled', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey_sled.png', { frameWidth: 81, frameHeight: 90 });
       this.load.audio('All in','assets/song.mp3')
  }

  create() {
      gameState.active = true;
    gameState.player = this.add.sprite(config.width / 2, config.height / 2, 'codey_sled');

      if(gameState.active === true){
        gameState.music = this.sound.add('All in');
       gameState.music.play();
   }
    this.anims.create({
      key: 'sled',
      frames: this.anims.generateFrameNumbers('codey_sled'),
      frameRate: 10,
      repeat: -1
    })

    gameState.player.angle = 20;
    this.add.text(150,150, 'created by Jaedon Munyua',{fontSize: '50px', fill: '000000'})
    
  }
  levelsetup(){
  if(gameState.player.y >70){
  	this.registry.destroy(); // destroy registry
this.events.off();﻿ // disable all active events
this.scene.restart();﻿﻿﻿﻿ // restart current scene
  }
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
  width: 1366,
  height: 720,
  fps: {target: 60},
  backgroundColor: "b9eaff",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      enableBody: true,

    }
  },
  scene: [Level1, Level2, Level3, Level4, Credits,Level]
};

const game = new Phaser.Game(config);
