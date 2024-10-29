export default class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    preload() {
        // Load the tilemap JSON file
        this.load.tilemapTiledJSON('level1', 'assets/maps/level1.tmj');
        
        // Load the tilesets
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

        // Load the player image
        this.load.image('player', 'assets/sprites/player.png');
    }

    create() {
        // Create the tilemap
        const map = this.make.tilemap({ key: 'level1' });

        // Add the tilesets to the map
        const forestTiles = map.addTilesetImage('forest', 'forestTiles');
        const roguelikeCityTiles = map.addTilesetImage('roguelikeCity_magenta', 'roguelikeCityTiles');
        const terrainTiles = map.addTilesetImage('terrain', 'terrainTiles');
        const tilemapTiles = map.addTilesetImage('tilemap', 'tilemapTiles');
        const tilesetFinal = map.addTilesetImage('tileset_16x16_final_1', 'tilesetFinal');

        const soda= map.addTilesetImage("soda-pop-machine","soda");
        const vending = map.addTilesetImage("vending-machine","vending");
        const water_fountain= map.addTilesetImage("water-fountain","water_fountain");
        const flower1=map.addTilesetImage("flowerpot-1","flower1");
        const flower3=map.addTilesetImage("flowerpot-3","flower3");

        // Create layers using the appropriate tilesets
        const groundLayer = map.createLayer('Ground', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal], 0, 0);
        const objectsLayer = map.createLayer('Objects', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal], 0, 0);
        const windowsLayer = map.createLayer('Windows', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal], 0, 0);

        // Position the player at a start location on the map
        this.player = this.physics.add.sprite(100, 100, 'player'); // Adjust coordinates if needed
        
        // Optionally, scale up the player sprite to make it larger
        this.player.setScale(1); // Adjust the scale factor as needed

        // Set up camera to follow the player
        this.cameras.main.startFollow(this.player);

        // Set the camera bounds to match the map size
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Optional: Set zoom level to show more of the map (adjust the zoom level as needed)
        this.cameras.main.setZoom(1); // Change this as needed

        // Optional: Add a deadzone to give smoother movement within the camera’s view
        this.cameras.main.setDeadzone(100, 100);

        // Define input for player movement
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Basic player movement
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
    }
}
