import scenes from './config/scenes.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    scene: scenes,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    render: {
        antialias: false, // Disable anti-aliasing
        pixelArt: true    // Enable pixel art mode
    }
};

const game = new Phaser.Game(config);
