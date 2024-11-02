export default class Level1 extends Phaser.Scene {
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
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('redDot', 'assets/sprites/redDot.png');
        
        this.load.image('six', 'assets/tilesets/Ardentryst-6c.png');
        this.load.image('nine', 'assets/tilesets/Ardentryst-9b.png');
        this.load.image('element', 'assets/tilesets/elements.png');
        this.load.image('groundRed', 'assets/tilesets/groundBeige_red.png');
        this.load.image('groundGreen', 'assets/tilesets/groundGrass_mown.png');
        this.load.image('groundGravel', 'assets/tilesets/groundGravel.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'level1' });

        // Add the tilesets to the map
        const forestTiles = map.addTilesetImage('forest', 'forestTiles');
        const roguelikeCityTiles = map.addTilesetImage('roguelikeCity_magenta', 'roguelikeCityTiles');
        const terrainTiles = map.addTilesetImage('terrain', 'terrainTiles');
        const tilemapTiles = map.addTilesetImage('tilemap', 'tilemapTiles');
        const tilesetFinal = map.addTilesetImage('tileset_16x16_final_1', 'tilesetFinal');
        const soda = map.addTilesetImage("soda-pop-machine", "soda");
        const vending = map.addTilesetImage("vending-machine", "vending");
        const water_fountain = map.addTilesetImage("water-fountain", "water_fountain");
        const flower1 = map.addTilesetImage("flowerpot-1", "flower1");
        const flower3 = map.addTilesetImage("flowerpot-3", "flower3");

        const six = map.addTilesetImage("Ardentryst-6c", "six");
        const nine = map.addTilesetImage("Ardentryst-9b", "nine");
        const element = map.addTilesetImage("elements", "element");
        const groundRed = map.addTilesetImage("groundBeige_red", "groundRed");
        const groundGreen = map.addTilesetImage("groundGrass_mown", "groundGreen");
        const groundGravel = map.addTilesetImage("groundGravel", "groundGravel");
     
        // Create layers
        map.createLayer('Ground', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal, element, groundRed, groundGreen, groundGravel,soda], 0, 0);
        map.createLayer('Objects', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal, soda, vending, water_fountain, flower1, flower3, six, nine, element], 0, 0);
        map.createLayer('Windows', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal], 0, 0);

        // Player setup
        this.player = this.physics.add.sprite(100, 100, 'player').setScale(1);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(4);
        this.cameras.main.setDeadzone(5, 5);
        this.cameras.main.roundPixels = true;

        // Mini-map camera setup
        const miniMapWidth = 200; // Adjust width of the minimap
const miniMapHeight = 200; // Adjust height of the minimap
const miniMapX = this.cameras.main.width - miniMapWidth - 10; // Position with some padding
const miniMapY = this.cameras.main.height - miniMapHeight - 10; // Position with some padding

const miniMapCamera = this.cameras.add(miniMapX, miniMapY, miniMapWidth, miniMapHeight);
miniMapCamera.setZoom(0.1); // Adjust zoom to show entire map
miniMapCamera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
miniMapCamera.roundPixels = true;

        // Create a red dot to represent the player on the minimap
        this.redDot = this.add.circle(0, 0, 20, 0xff0000);
        
        // Ensure red dot is ignored by main camera and shown in minimap
        this.cameras.main.ignore(this.redDot);

        // Player movement input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 160;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }

        // Update red dot position on the minimap to follow player position
        this.redDot.x = this.player.x;
        this.redDot.y = this.player.y;
    }
}
