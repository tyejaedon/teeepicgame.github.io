class level extends Phaser.scene{
constructor(key){
  super(key);
  this.levelKey = key
  this.nextLevel ={
    'Level1': 'Level2',
      'Level2': 'Level3',
      'Level3': 'Level4',
      'Level4': 'Credits',
  }

}


preload(){

this.load.spriteSheet('player','C:\Users\tyeja\Desktop\myfirststatergame\player1.jpg', { frameWidth: 72, frameHeight: 90});
this.load.spriteSheet('savepoint','C:\Users\tyeja\Desktop\myfirststatergame\savepoint sprite.png', { frameWidth: 32, frameHeight: 32});
this.load.image('background1','C:\Users\tyeja\Desktop\myfirststatergame\background.jfif');
this.load.image('platform', 'C:\Users\tyeja\Desktop\myfirststatergame\platform.jfif');
this.load.image('lava','C:\Users\tyeja\Desktop\myfirststatergame\lava floor.png');


}

create(){
  gameState.active = true;

 gameState.player = this.physics.add.sprite(125, 110, 'player').setScale(.5);
 gameState.platforms = this.physics.add.staticGroup();
gameState.lava = this.physics.add.staticGroup();


 this.createAnimations();

    this.createSnow();

    this.levelSetup();

    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)
    gameState.player.setCollideWorldBounds(true);

     this.physics.add.collider(gameState.player, gameState.platforms);
    this.physics.add.collider(gameState.goal, gameState.platforms);
    this.physics.add.collider(gameState.player, gameState.lava);

    gameState.cursors = this.input.keyboard.createCursorKeys();
  }

createPlatform(xIndex, yIndex, xIndex1, yIndex1) {
    // Creates a platform evenly spaced along the two indices.
    // If either is not a number it won't make a platform
      if (typeof yIndex === 'number' && typeof xIndex === 'number') {
        gameState.platforms.create((200 * xIndex),  yIndex * 90, 'platform').setOrigin(0, 0.5).refreshBody();
      }
      if (typeof yIndex1 === 'number' && typeof xIndex1 === 'number') {
        gameState.lava.create((400 * xIndex1),  yIndex1 * 300, 'platform').setOrigin(40, 45).refreshBody();
      }

}

createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 15 }),
      frameRate: 10,
      repeat: -1
    });

this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
      frameRate: 10,
      repeat: -1
          })

this.anims.create({
  key: 'save',
  frames: this.anims.generateFrameNumbers('savepoint',{start: 0, end: 8}),
})
}
background(){
  gameState.background = this.add.image(0,0,'background1');
}
 
 levelSetup() {
    for (const [xIndex, yIndex] of this.heights.entries()) {
      this.createPlatform(xIndex, yIndex);
    } 
     // Create the campfire at the end of the level
    gameState.goal = this.physics.add.sprite(gameState.width - 40, 100, 'savepoint');

this.physics.add.overlap(gameState.player, gameState.goal, function() {
      this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
        if (progress > 1) {
          this.scene.stop(this.levelKey);
          this.scene.start(this.nextLevel[this.levelKey]);
        }
      });
    }, null, this);

this.physics.add.collider(gameState.player, gameState.lava, function(){
  this.cameras.main.fade(200,0,0,0,false,function(camera,progress){
    if(progress > .7){
      this.scene.restart(this.levelKey)
    }
  })
})
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
        gameState.player.setVelocityY(-300);
      }

      if (!gameState.player.body.touching.down){
        gameState.player.anims.play('jump', true);
      }

}
}
}



























const gameState = {
  speed: 240,
  ups: 380,
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
      gravity: { y: 600 },
      enableBody: true,

    }
  },
  scene: [Level1]
};

const game = new Phaser.Game(config);