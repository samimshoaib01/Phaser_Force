export default class NextMap extends Phaser.Scene {
    constructor() {
        super({ key: 'NextMap' });
    }

    preload() {
        // Preload assets for next map
        this.load.tilemapTiledJSON('next_map', 'assets/maps/next_map.tmj');
        // Load the image tilesets (ensure the image dimensions are correct for your tile size)
        this.load.image('car', 'assets/vehicles/car.png');  // Load your car image
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

        // Assets for dewsis
        this.load.image('two', 'assets/tilesets/Ardentryst-2c.png');
        this.load.image('four','assets/tilesets/Ardentryst-4c.png');
        this.load.image('symbol','assets/tilesets/symbol.png');
        this.load.image('frontsofa','assets/tilesets/sofa-yellow-front.png');
        this.load.image('sidesofa1','assets/tilesets/sofa-yellow-side1.png');
        this.load.image('sidesofa2','assets/tilesets/sofa-yellow-side2.png');
        this.load.image('woodenfence','assets/tilesets/wood-fence-bottom-middle.png');
        this.load.image('regularindoor','assets/tilesets/roguelikeIndoor_transparent.png');

        // Load roguelikeIndoor as a sprite sheet with the correct frame size
        this.load.spritesheet('roguelikeIndoor', 'assets/tilesets/roguelikeIndoor_transparent.png', { frameWidth: 16, frameHeight: 16 });

        // Load character sprite
        this.load.atlas("character", "assets/sprites/back.png", "assets/sprites/back.json");
    }

    create() {

         // Set filter to NEAREST to avoid blurring and lines for all tilesets
         this.textures.get('roguelikeCityTiles').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('terrainTiles').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('tilemapTiles').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('two').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('four').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('symbol').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('frontsofa').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('sidesofa1').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('sidesofa2').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('woodenfence').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('regularindoor').setFilter(Phaser.Textures.FilterMode.NEAREST);
 
        // Initialize cursors for movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create the map object using the tilemap
        const map = this.make.tilemap({ key: 'next_map' });

        // Add tilesets
        const roguelikeCityTiles = map.addTilesetImage('roguelikeCity_magenta', 'roguelikeCityTiles');
        const terrainTiles = map.addTilesetImage('terrain', 'terrainTiles');
        const tilemapTiles = map.addTilesetImage('tilemap', 'tilemapTiles');
        const two = map.addTilesetImage('Ardentryst-2c', 'two');
        const four = map.addTilesetImage('Ardentryst-4c', 'four');
        const symbol = map.addTilesetImage('symbol', 'symbol');
        const frontSofa = map.addTilesetImage('sofa-yellow-front', 'frontsofa');
        const sideSofa1 = map.addTilesetImage('sofa-yellow-side1', 'sidesofa1');
        const sideSofa2 = map.addTilesetImage('sofa-yellow-side2', 'sidesofa2');
        const woodenFence = map.addTilesetImage('wood-fence-bottom-middle', 'woodenfence');
        const regularIndoor = map.addTilesetImage('roguelikeIndoor_transparent', 'regularindoor');

        // Create map layers using the tilesets
        const groundLayer = map.createLayer('Ground', [roguelikeCityTiles, terrainTiles, tilemapTiles], 0, 0);
        const objectsLayer = map.createLayer('Objects', [roguelikeCityTiles, tilemapTiles, two, four, symbol, frontSofa, sideSofa1, sideSofa2, woodenFence, regularIndoor], 0, 0);
        const rightCharLayer = map.createLayer('RightChar', [tilemapTiles], 0, 0);
        const backCharLayer = map.createLayer('BackChar', [tilemapTiles], 0, 0);
        const frontCharLayer = map.createLayer('FrontChar', [tilemapTiles], 0, 0);
        const leftCharLayer = map.createLayer('LeftChar', [tilemapTiles], 0, 0);

        // Define character animation (walking animations)
       

        // Spawn the character at the designated point (adjust the spawn location based on your map)
        const spawnPoint = map.findObject('Spawns', obj => obj.name === 'spawn_point');
        this.character = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'character').setScale(0.3);
        this.cameras.main.startFollow(this.character);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(4.5);

        this.cameras.main.roundPixels = true;  // Helps with pixel-perfect rendering


    }

    update() {
        const charSpeed = 50;
        this.character.setVelocity(0);
    
        // Define the target coordinates for the transition
        const targetX = 377;
        const targetY = 156;
    
        // Calculate distance between the character and target point
        const distanceToTarget = Phaser.Math.Distance.Between(this.character.x, this.character.y, targetX, targetY);
    
        // Check for cursor input and apply movement
        if (this.cursors.left.isDown) {
            this.character.setVelocityX(-charSpeed);
            this.character.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown) {
            this.character.setVelocityX(charSpeed);
            this.character.anims.play('walk-right', true);
        } else if (this.cursors.up.isDown) {
            this.character.setVelocityY(-charSpeed);
            this.character.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown) {
            this.character.setVelocityY(charSpeed);
            this.character.anims.play('walk-down', true);
        } else {
            this.character.anims.stop();
        }
    
        // Transition to Level1 if the character is within a small distance of the target point
        if (distanceToTarget < 10) {
            this.scene.start('Explore', { fromTransition: true });
  // Start the Level1 scene
        }
    
    
}
}
