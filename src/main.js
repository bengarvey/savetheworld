var game = new Phaser.Game(672, 321, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','assets/tests/real-city.png');
    game.load.image('player','assets/sprites/phaser-dude.png');

}

var player;
var cursors;
var jumpTimer = 0;

function create() {
    game.add.tileSprite(0, 0, 672, 320, 'background');

    game.world.setBounds(0, 0, 672, 320);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1500;

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.enable(player);

    player.body.collideWorldBounds = true;
    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player);
}

function update() {

    player.body.velocity.x = 0;

    if (cursors.up.isDown)
    {
        player.body.velocity.y = -500;
    }

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;
    }

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

