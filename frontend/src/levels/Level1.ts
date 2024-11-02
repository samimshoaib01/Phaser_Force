
import Phaser from 'phaser';

export default class Level1 extends Phaser.Scene {
    private character!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private redDot!: Phaser.GameObjects.Arc;
    
    constructor() {
        super({ key: 'Level1' });
    }

    preload() {
        // Load the tilemap and tileset images
        this.load.tilemapTiledJSON('level1', 'assets/maps/level1.tmj');
        this.load.image('forestTiles', 'assets/tilesets/forest.png');
        this.load.image('roguelikeCityTiles', 'assets/tilesets/roguelikeCity_magenta.png');
        this.load.image('terrainTiles', 'assets/tilesets/terrain.png');
        this.load.image('tilemapTiles', 'assets/tilesets/tilemap.png');
        this.load.image('tilesetFinal', 'assets/tilesets/tileset_16x16_final_1.png');
        this.load.image('soda', 'assets/tilesets/soda-pop-machine.png');
        this.load.image('vending', 'assets/tilesets/vending-machine.png');
        this.load.image('water_fountain', 'assets/tilesets/water-fountain.png');
        this.load.image('flower1', 'assets/tilesets/flowerpot-1.png');
        this.load.image('flower3', 'assets/tilesets/flowerpot-3.png');
        
        this.load.image('six', 'assets/tilesets/Ardentryst-6c.png');
        this.load.image('nine', 'assets/tilesets/Ardentryst-9b.png');
        this.load.image('element', 'assets/tilesets/elements.png');
        this.load.image('groundRed', 'assets/tilesets/groundBeige_red.png');
        this.load.image('groundGreen', 'assets/tilesets/groundGrass_mown.png');
        this.load.image('groundGravel', 'assets/tilesets/groundGravel.png');

        this.load.atlas("character", "assets/sprites/back.png", "assets/sprites/back.json");
    }

    create() {
        const map = this.make.tilemap({ key: 'level1' });

        // Add the tilesets to the map
        const forestTiles = map.addTilesetImage('forest', 'forestTiles');
                if (!forestTiles) {
                    console.error('Forest tileset not found!');
                    return;
                }
        
                const roguelikeCityTiles = map.addTilesetImage('roguelikeCity_magenta', 'roguelikeCityTiles');
                if (!roguelikeCityTiles) {
                    console.error('Roguelike city tileset not found!');
                    return;
                }
        
                const terrainTiles = map.addTilesetImage('terrain', 'terrainTiles');
                if (!terrainTiles) {
                    console.error('Terrain tileset not found!');
                    return;
                }
        
                const tilemapTiles = map.addTilesetImage('tilemap', 'tilemapTiles');
                if (!tilemapTiles) {
                    console.error('Tilemap tileset not found!');
                    return;
                }
        
                const tilesetFinal = map.addTilesetImage('tileset_16x16_final_1', 'tilesetFinal');
                if (!tilesetFinal) {
                    console.error('Final tileset not found!');
                    return;
                }
        
                const soda = map.addTilesetImage("soda-pop-machine", "soda");
                if (!soda) {
                    console.error('Soda tileset not found!');
                    return;
                }
        
                const vending = map.addTilesetImage("vending-machine", "vending");
                if (!vending) {
                    console.error('Vending tileset not found!');
                    return;
                }
        
                const water_fountain = map.addTilesetImage("water-fountain", "water_fountain");
                if (!water_fountain) {
                    console.error('Water fountain tileset not found!');
                    return;
                }
        
                const flower1 = map.addTilesetImage("flowerpot-1", "flower1");
                if (!flower1) {
                    console.error('Flowerpot 1 tileset not found!');
                    return;
                }
        
                const flower3 = map.addTilesetImage("flowerpot-3", "flower3");
                if (!flower3) {
                    console.error('Flowerpot 3 tileset not found!');
                    return;
                }
                // six , nine , element , groundred , groundgreen , groundGravel , character 
        
                const six = map.addTilesetImage("Ardentryst-6c", "six");
                if(!six){
                return ;
                }
                const nine = map.addTilesetImage("Ardentryst-9b", "nine");
                if(!nine){
                return ;
                }
                const element = map.addTilesetImage("elements", "element");
                if(!element){
                return ;
                }
                const groundRed = map.addTilesetImage("groundBeige_red", "groundRed");
                if(!groundRed){
                return ;
                }
                const groundGreen = map.addTilesetImage("groundGrass_mown", "groundGreen");
                if(!groundGreen){
                return ;
                }
                const groundGravel = map.addTilesetImage("groundGravel", "groundGravel");
                if(!groundGravel){
                return ;
                }
        // Create layers
        map.createLayer('Ground', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal, element, groundRed, groundGreen, groundGravel, soda], 0, 0);
        map.createLayer('Objects', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal, soda, vending, water_fountain, flower1, flower3, six, nine, element], 0, 0);
        map.createLayer('Windows', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal], 0, 0);

        // Character setup
        this.character = this.physics.add.sprite(100, 100, 'character').setScale(0.5);
        const frameNames = this.textures.get('character').getFrameNames();
        console.log(frameNames);
        
        this.cameras.main.startFollow(this.character);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(2);
        this.cameras.main.setDeadzone(5, 5);
        this.cameras.main.roundPixels = true;

        // Mini-map camera setup
        const miniMapWidth = 200;
        const miniMapHeight = 200;
        const miniMapX = this.cameras.main.width - miniMapWidth - 10;
        const miniMapY = this.cameras.main.height - miniMapHeight - 10;

        const miniMapCamera = this.cameras.add(miniMapX, miniMapY, miniMapWidth, miniMapHeight);
        miniMapCamera.setZoom(0.1);
        miniMapCamera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        miniMapCamera.roundPixels = true;

        // Create animations for character movement
        this.anims.create({
            key: 'walk-up',
            frames: [
                { key: 'character', frame: '1.png' },
                { key: 'character', frame: '2.png' },
                { key: 'character', frame: '3.png' },
                { key: 'character', frame: '4.png' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-down',
            frames: [
                { key: 'character', frame: '5.png' },
                { key: 'character', frame: '6.png' },
                { key: 'character', frame: '7.png' },
                { key: 'character', frame: '8.png' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: [
                { key: 'character', frame: '9.png' },
                { key: 'character', frame: '10.png' },
                { key: 'character', frame: '11.png' },
                { key: 'character', frame: '12.png' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: [
                { key: 'character', frame: '13.png' },
                { key: 'character', frame: '14.png' },
                { key: 'character', frame: '15.png' },
                { key: 'character', frame: '16.png' }
            ],
            frameRate: 10,
            repeat: -1
        });
        // Create a red dot to represent the character on the minimap
        this.redDot = this.add.circle(0, 0, 20, 0xff0000);
        
        // Ensure red dot is ignored by main camera and shown in minimap
        this.cameras.main.ignore(this.redDot);

        // Character movement input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 60;
        this.character.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.character.setVelocityX(-speed);
            this.character.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown) {
            this.character.setVelocityX(speed);
            this.character.anims.play('walk-right', true);
        } else if (this.cursors.up.isDown) {
            this.character.setVelocityY(-speed);
            this.character.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown) {
            this.character.setVelocityY(speed);
            this.character.anims.play('walk-down', true);
        } else {
            // Stop animation when no movement keys are pressed
            this.character.anims.stop();
        }

        // Update red dot position on the minimap to follow character position
        this.redDot.x = this.character.x;
        this.redDot.y = this.character.y;
    }
}

