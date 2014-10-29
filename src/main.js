var game = new Phaser.Game("100%", 420, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.spritesheet('player','assets/sprites/heroSheet.png', 32, 32);
    game.load.image('background','assets/tests/space-city.png');
    game.load.image('green-energy','assets/sprites/green-energy.png');
    game.load.image('tentacle', 'assets/sprites/tentacleDude.png')
    game.load.audio('amia_dope_song', ['assets/amia_dope_song.m4a']);
}

var player;
var cursors;
var jumpTimer = 0;
var worldWidth = 10000;
var worldHeight = 420;
var powerups = null;
var currentAnimation = 'right';

function create() {
    game.add.tileSprite(0, -150, worldWidth, worldHeight+150, 'background');
    game.world.setBounds(0, 0, worldWidth, worldHeight);

    music = game.add.audio('amia_dope_song');
    music.loop = true;
    music.play();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1500;

    player = game.add.sprite(1, game.world.centerY, 'player');

    powerups = game.add.group();
    powerups.enableBody = true;
    addPowerups(50, worldWidth, game.world.height, 'green-energy');
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('jump', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    joker = game.add.sprite(5000, game.world.centerY, 'tentacle');
    catwoman = game.add.sprite(4000, game.world.centerY, 'tentacle');
    darthvader = game.add.sprite(3000, game.world.centerY, 'tentacle');
    alien = game.add.sprite(2000, game.world.centerY, 'tentacle');

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.body.setSize(32, 32, 5, 2);

    game.physics.enable(powerup);
    game.physics.enable(joker);
    game.physics.enable(catwoman);
    game.physics.enable(darthvader);
    game.physics.enable(alien);
    joker.body.collideWorldBounds = true;
    catwoman.body.collideWorldBounds = true;
    darthvader.body.collideWorldBounds = true;
    alien.body.collideWorldBounds = true;


    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
}

function restartGame() {
    game.state.restart();
}

function getPowerup(player, powerup) {
	powerup.kill();
}

function addPowerups(total, width, height, image) {
	for(i=0; i<total; i++) {
		x = Math.random() * width;
    		powerup = powerups.create(x, 100, image);
	    	game.physics.enable(powerup);
    		powerup.body.collideWorldBounds = true;
		powerup.body.velocity.x = -100 * Math.random();
		powerup.body.velocity.y = -100 * Math.random();
		powerup.body.bounce.y = 1;
		powerup.body.bounce.x = 1 * Math.random();
	}
}

function update() {

    player.body.velocity.x = 200;
    joker.body.velocity.x = -245;
    catwoman.body.velocity.x = -245;
    darthvader.body.velocity.x = -245;
    alien.body.velocity.x = -245;

    game.physics.arcade.collide(player, alien, restartGame);
    game.physics.arcade.collide(player, joker, restartGame);
    game.physics.arcade.collide(player, catwoman, restartGame);
    game.physics.arcade.collide(player, darthvader, restartGame);

    game.physics.arcade.overlap(player, powerups, getPowerup, null, this);
    // Jump
    if ((cursors.up.isDown || game.input.pointer1.isDown) && player.body.onFloor())
    {
        player.body.velocity.y = -500;
    }

    if(player.body.onFloor() && currentAnimation != 'right') {
        currentAnimation = 'right'
        player.animations.play('right');
    }
    else if(!player.body.onFloor() && currentAnimation != 'jump') {

        currentAnimation = 'jump'
        player.animations.play('jump');
    }

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

