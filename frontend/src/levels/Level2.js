// state2.js
export default class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
    }

    preload() {
        // Load assets here if needed
    }

    create() {
        this.cameras.main.setBackgroundColor('#57A916');

        this.add.text(100, 100, "Click Enter to go to State3", { fontSize: '15px', fill: '#fff' });
        

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // this.input.on('pointerdown', () => {
        //     this.scene.start('State3'); // Switch to State2
        // });
               
    }

    update() {
        
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            localStorage.setItem('activeState', 'GameScene'); // Save the current state
            this.scene.start('GameScene'); // Switch to State3
        }
        // Game logic goes here
    }
}
