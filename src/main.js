var game = new Phaser.Game("100%", 420, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.spritesheet('player','assets/sprites/heroSheet.png', 32, 32);
    game.load.image('welcome','assets/welcome.png');
    game.load.image('background','assets/tests/space-city.png');
    game.load.image('green-energy','assets/sprites/green-energy.png');
    game.load.image('purple-energy','assets/sprites/purple-energy.png');
    game.load.image('tentacle', 'assets/sprites/tentacleDude.png');
    game.load.image('asteroid', 'assets/sprites/asteroid.png');
    game.load.image('busstop', 'assets/best-bus-stop-in-the-world-by-amia.gif');
    game.load.audio('amia_dope_song', ['assets/amia_dope_song.m4a']);
}

var player;
var playerCanFly = false;
var cursors;
var jumpTimer = 0;
var worldWidth = 10000;
var worldHeight = 420;
var specialPowerups = null;
var powerups = null;
var aliens = null;
var currentAnimation = 'right';
var music;
var score = 0;
var scoreText = "Score";
var speedFactor = 1;
var speedStart = 0;

function create() {
    game.add.tileSprite(0, -140, 259, worldHeight+150, 'welcome');
    game.add.tileSprite(259, 0, worldWidth, worldHeight+150, 'background');
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
    specialPowerups = game.add.group();
    specialPowerups.enableBody = true;
    addSpecialPowerups(15, worldWidth, game.world.height, 'purple-energy');
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('jump', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    asteroid = game.add.sprite(10000, Math.random() * 100, 'asteroid');
    catwoman = game.add.sprite(4000, game.world.centerY, 'tentacle');
    darthvader = game.add.sprite(3000, game.world.centerY, 'tentacle');
    busStop = game.add.sprite(9900, 55, 'busstop');
    busStop.scale.setTo(0.5, 0.5)
    aliens = game.add.group();
    aliens.enableBody = true;
    addAliens(25, worldWidth, game.world.height, 'tentacle');

    game.physics.enable(player, Phaser.Physics.ARCADE);
    game.physics.enable(busStop);
    busStop.body.collideWorldBounds = true;
    //busStop.body.setSize(150, 150, 0, 0);
    busStop.body.immovable = true;
    // busStop.body.velocity.x = 0;


    player.body.collideWorldBounds = true;
    player.body.setSize(32, 32, 5, 2);

    game.physics.enable(powerup);
    game.physics.enable(specialPowerup);
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
    spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.add(pause, self);
    function pause() {
        console.log ("is the game paused?", game.paused)
        if (game.paused == true) {
            game.paused = false;
        } else {
            game.paused = true;
        }
    }
    //game.camera.follow(player);
    //game.camera.focusOnXY(100, 420);
}


function restartGame() {
    music.stop();
    score = 0;
    speedFactor = 1;
    game.state.restart();
}

function getPowerup(player, powerup) {
	playerCanFly = true;
	powerup.kill();
	score = score + 15;
}

function getSpecialPowerup(player, powerup) {
    speedFactor = 2;
    speedStart = Date.now();
    powerup.kill();
}

function winGame() {
    console.log("win");
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

function addSpecialPowerups(total, width, height, image) {
    for(i=0; i<total; i++) {
        x = Math.random() * width;
            specialPowerup = specialPowerups.create(x, 100, image);
            game.physics.enable(powerup);
            specialPowerup.body.collideWorldBounds = true;
        specialPowerup.body.velocity.x = -100 * Math.random();
        specialPowerup.body.velocity.y = -100 * Math.random();
        specialPowerup.body.bounce.y = 1;
        specialPowerup.body.bounce.x = 1 * Math.random();
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
    if(speedStart != 0) {
        if(Date.now() - speedStart >= 3000){
            speedStart = 0;
            speedFactor = 1;
        }
    }

    player.body.velocity.x = 200 * speedFactor;
    asteroid.body.velocity.x = -350;
    catwoman.body.velocity.x = -245;
    darthvader.body.velocity.x = -245;

    game.physics.arcade.collide(player, asteroid, restartGame);
    game.physics.arcade.collide(player, catwoman, restartGame);
    game.physics.arcade.collide(player, darthvader, restartGame);
    game.physics.arcade.overlap(player, busStop, winGame, null, this);
    game.physics.arcade.overlap(player, aliens, restartGame, null, this);
    game.physics.arcade.overlap(player, powerups, getPowerup, null, this);
    game.physics.arcade.overlap(player, specialPowerups, getSpecialPowerup, null, this);
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
    game.camera.focusOnXY(player.x + 110, player.y + 110)
    scoreText.text = 'Score: ' + score;

}

function render() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteCoords(player, 32, 500);

}

