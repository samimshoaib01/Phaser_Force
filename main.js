import scenes from './config/scenes.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,  // Makes the game canvas fit within the window
        autoCenter: Phaser.Scale.CENTER_BOTH,  // Centers the canvas horizontally and vertically
        width: 800,   // Default width, but it will resize
        height: 600,  // Default height, but it will resize
    },
    scene: scenes,  // Load scenes from the config file
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    }, scale: {
        mode: Phaser.Scale.FIT, // Ensures the game scales to fit the screen
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centers the game on the screen
        width: window.innerWidth,   
        height: window.innerHeight,
    }
};

const game = new Phaser.Game(config);
