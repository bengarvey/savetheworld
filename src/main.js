var game = new Phaser.Game(672, 321, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','assets/tests/real-city.png');
    game.load.image('player','assets/sprites/phaser-dude.png');
    game.load.audio('amia_dope_song', ['assets/amia_dope_song.m4a']);
}

var player;
var cursors;
var jumpTimer = 0;
var worldsize = 5000;

function create() {
    game.add.tileSprite(0, 0, worldsize, 320, 'background');

    music = game.add.audio('amia_dope_song');
    music.loop = true;
    music.play();

    game.world.setBounds(0, 0, worldsize, 320);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1500;

    player = game.add.sprite(0, game.world.centerY, 'player');
    joker = game.add.sprite(5000, game.world.centerY, 'player');
    catwoman = game.add.sprite(4000, game.world.centerY, 'player');
    darthvader = game.add.sprite(3000, game.world.centerY, 'player');
    alien = game.add.sprite(2000, game.world.centerY, 'player');

    game.physics.enable(player);
    game.physics.enable(joker);
    game.physics.enable(catwoman);
    game.physics.enable(darthvader);
    game.physics.enable(alien);

    player.body.collideWorldBounds = true;
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
    
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.velocity.y = -500;
    }

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

