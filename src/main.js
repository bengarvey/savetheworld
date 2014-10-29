var game = new Phaser.Game("100%", 568, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('player','assets/sprites/hero.png');
    game.load.image('background','assets/tests/space-city.png');
    game.load.image('green-energy','assets/sprites/green-energy.png');
    game.load.audio('amia_dope_song', ['assets/amia_dope_song.m4a']);
}

var player;
var cursors;
var jumpTimer = 0;

function create() {
    var worldWidth = 10000;
    var worldHeight = 568;

    game.add.tileSprite(0, 0, worldWidth, worldHeight, 'background');
    game.world.setBounds(0, 0, worldWidth, worldHeight);

    music = game.add.audio('amia_dope_song');
    music.loop = true;
    music.play();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1500;

    player = game.add.sprite(1, game.world.centerY, 'player');
    powerup = game.add.sprite(35, game.world.centerY, 'green-energy');
    joker = game.add.sprite(5000, game.world.centerY, 'player');
    catwoman = game.add.sprite(4000, game.world.centerY, 'player');
    darthvader = game.add.sprite(3000, game.world.centerY, 'player');
    alien = game.add.sprite(2000, game.world.centerY, 'player');

    game.physics.enable(player);
    player.body.collideWorldBounds = true;
    game.physics.enable(powerup);
    powerup.body.collideWorldBounds = true;

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

function update() {

    player.body.velocity.x = 250;
    joker.body.velocity.x = -245;
    catwoman.body.velocity.x = -245;
    darthvader.body.velocity.x = -245;
    alien.body.velocity.x = -245;

    if ((cursors.up.isDown || game.input.pointer1.isDown) && player.body.onFloor())
    {
        player.body.velocity.y = -500;
    }

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

