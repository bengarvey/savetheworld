var game = new Phaser.Game("100%", 420, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.spritesheet('player','assets/sprites/heroSheet.png', 32, 32);
    game.load.image('background','assets/tests/space-city.png');
    game.load.image('green-energy','assets/sprites/green-energy.png');
    game.load.image('tentacle', 'assets/sprites/tentacleDude.png');
    game.load.image('asteroid', 'assets/sprites/asteroid.png');
    game.load.audio('amia_dope_song', ['assets/amia_dope_song.m4a']);
}

var player;
var playerCanFly = false;
var cursors;
var jumpTimer = 0;
var worldWidth = 10000;
var worldHeight = 420;
var powerups = null;
var aliens = null;
var currentAnimation = 'right';
var music;
var score = 0;
var scoreText = "Score";

function create() {
    game.add.tileSprite(0, -150, worldWidth, worldHeight+150, 'background');
    game.world.setBounds(0, 0, worldWidth, worldHeight);

    playerCanFly = false;
    music = game.add.audio('amia_dope_song');
    music.stop();
    music.loop = true;
    music.play();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1500;

    player = game.add.sprite(1, game.world.centerY, 'player');

    powerups = game.add.group();
    powerups.enableBody = true;
    addPowerups(150, worldWidth, game.world.height, 'green-energy');
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('jump', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    asteroid = game.add.sprite(10000, Math.random() * 100, 'asteroid');
    catwoman = game.add.sprite(4000, game.world.centerY, 'tentacle');
    darthvader = game.add.sprite(3000, game.world.centerY, 'tentacle');

    aliens = game.add.group();
    aliens.enableBody = true; 
    addAliens(25, worldWidth, game.world.height, 'tentacle');

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.body.setSize(32, 32, 5, 2);

    game.physics.enable(powerup);
    game.physics.enable(asteroid);
    game.physics.enable(catwoman);
    game.physics.enable(darthvader);
    game.physics.enable(aliens);

    asteroid.body.allowGravity = false;

    asteroid.body.collideWorldBounds = true;
    catwoman.body.collideWorldBounds = true;
    darthvader.body.collideWorldBounds = true;

    scoreText = game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#CCC' });
    scoreText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
}


function restartGame() {
    music.stop();
    score = 0;
    game.state.restart();
}

function getPowerup(player, powerup) {
	playerCanFly = true;
	powerup.kill();
	score = score + 15;
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

function addAliens(total, width, height, image) {
	for(i=0; i<total; i++) {
		x = (Math.random() * width + 300);
    		alien = aliens.create(x, 100, image);
	    	game.physics.enable(alien);
    		alien.body.collideWorldBounds = true;
		alien.body.velocity.x = -100 * Math.random();
		alien.body.velocity.y = -100 * Math.random();
		alien.body.bounce.y = 1;
		alien.body.bounce.x = 1 * Math.random();
	}
}

function update() {

    player.body.velocity.x = 200;
    asteroid.body.velocity.x = -350;
    catwoman.body.velocity.x = -245;
    darthvader.body.velocity.x = -245;

    game.physics.arcade.collide(player, asteroid, restartGame);
    game.physics.arcade.collide(player, catwoman, restartGame);
    game.physics.arcade.collide(player, darthvader, restartGame);

    game.physics.arcade.overlap(player, aliens, restartGame, null, this);
    game.physics.arcade.overlap(player, powerups, getPowerup, null, this);
    // Jump
    if ((cursors.up.isDown || game.input.pointer1.isDown) && (player.body.onFloor() || score > 0))
    {
        player.body.velocity.y = -500;
	score = score - 1;
    }

    if(player.body.onFloor() && currentAnimation != 'right') {
        currentAnimation = 'right'
        player.animations.play('right');
    }
    else if(!player.body.onFloor() && currentAnimation != 'jump') {

        currentAnimation = 'jump'
        player.animations.play('jump');
    }

    if (score < 0) {
	   score = 0;
    }

    scoreText.text = 'Score: ' + score;

}

function render() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteCoords(player, 32, 500);

}

