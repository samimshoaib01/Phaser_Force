import TextBox from './TextBox.js';
export default class Explore extends Phaser.Scene {
    constructor() {
        super({ key: 'Explore' });
        this.inCar = false;  // Track whether the player is in the car
        this.nearCar = false;  // Track if the player is near the car
        this.allowMovement = false;  // Initialize to block movement if text box is active

    }

    preload() {

        
        // Load assets for the text box
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
        
        // Load the tilemap and tileset images
        this.load.image('car', 'assets/vehicles/car.png');  // Load your car image
        this.load.tilemapTiledJSON('level1', 'assets/maps/explore.tmj');
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

    // Set filter to NEAREST to avoid blurring and lines
    this.textures.get('tilesetKey').setFilter(Phaser.Textures.FilterMode.NEAREST);


        // Create layers
        const groundLayer = map.createLayer('Ground', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal, element, groundRed, groundGreen, groundGravel, soda], 0, 0);
        const objectLayer = map.createLayer('Objects', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal, soda, vending, water_fountain, flower1, flower3, six, nine, element], 0, 0);
        map.createLayer('Windows', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal], 0, 0);


        const buildingsLayer = map.getObjectLayer('Buildings'); // Assuming your layer is named 'Buildings'
        this.buildings = [];
        // Loop through each building in the object layer
buildingsLayer.objects.forEach(building => {
    const buildingRect = new Phaser.Geom.Rectangle(building.x, building.y, building.width, building.height);

    // Find the description property in the properties array
    let description = '';
    if (building.properties) {
        const descProperty = building.properties.find(prop => prop.name === 'description');
        if (descProperty) {
            description = descProperty.value; // Get the description value
        }
    }

    // Store the building information
    this.buildings.push({
        rect: buildingRect,
        description: description
    });
});

    // Create a graphics object for the info bubble
this.infoBubble = this.add.graphics();
this.infoBubble.fillStyle(0x000000, 1); // Black background with full opacity
this.infoBubble.fillRect(-110, -25, 220, 50); // Adjust size as needed
this.infoBubble.setVisible(false); // Initially hidden

// Create text with white color
this.infoText = this.add.text(0, 0, '', { fontSize: '1 px', color: '#ffffff' ,resolution: 4}) // White text color
    .setOrigin(0.5) // Center origin
    .setVisible(false); // Initially hidden





        groundLayer.setCollisionByProperty({ collision: true });

        const data = this.scene.settings.data;
        console.log(this.scene);
        console.log(this.scene.settings);
        console.log(data); // To verify if data is correctly passed and accessible



        // Character setup
        if (data?.fromTransition) {
            // Find spawn_point1 in object layer and use it for character position
            const spawnPoint = map.findObject('Transitions', obj => obj.name === 'spawn_point1');
            this.character = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'character').setScale(0.3);
        } else if(!data) {
            // console.log("HHH");
            // Default spawn position when loading for the first time
            console.log("h");
            console.log(this.character);
            this.character= this.physics.add.sprite(800, 1550, 'character').setScale(0.3);
            console.log(this.character);

        }

        this.cameras.main.startFollow(this.character);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(4);
        this.cameras.main.roundPixels = true;

        this.physics.add.collider(this.character, groundLayer);

        // Movement Animations
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



        // Initialize the text box with pages and a callback
        this.textBox = new TextBox(this, 800,1400, 500, 75, [
            "Motilal Nehru National Institute of Technology Allahabad (MNNIT), established in 1961 as a Regional Engineering College, became a National Institute of Technology (NIT) in 2002 and was granted the status of an institution of national importance in 2007.",
            " Initially offering Bachelor's programs in Civil, Electrical, and Mechanical Engineering, it later introduced several other disciplines, including Computer Science, Electronics, and Management. The Institute now offers nine B.Tech., 19 M.Tech., MBA, MCA, M.Sc., and Ph.D. programs",
            " It has a strong focus on research and faculty development, with many faculty members holding Ph.D. degrees. MNNIT has also been involved in various government-funded projects, including TEQIP and the Indo-UK REC Project."
        ], () => {
            this.allowMovement = true;  // Enable movement when text is done
        });

        this.textBox.start();  // Show text box on game start

        this.cursors = this.input.keyboard.createCursorKeys();


                // Create car sprite and enable physics
                this.car = this.physics.add.sprite(800, 1500, 'car').setScale(0.05);
                this.car.setImmovable(true);

                this.physics.add.collider(this.car, groundLayer);

                // Create input for entering/exiting car

                this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);


                this.cameras.main.roundPixels = true;  // Helps with pixel-perfect rendering

                
                this.input.keyboard.on('keydown-ESC', () => {
                    const navigate = this.game.registry.get('navigate');
                    navigate('/');
                });
    }

    

    update() {
        if (!this.allowMovement) return; // Block movement if text box is active

    // Loop through each building to check proximity
    let isNearBuilding = false;
    for (let building of this.buildings) {
        const buildingRect = building.rect;

        // Check if character is near the building (e.g., within 50 pixels)
        if (
            this.character.x > buildingRect.x - 50 &&
            this.character.x < buildingRect.x + buildingRect.width + 50 &&
            this.character.y > buildingRect.y - 50 &&
            this.character.y < buildingRect.y + buildingRect.height + 50
        ) {
            // Character is near the building, show the info
            this.infoBubble.setPosition(buildingRect.centerX, buildingRect.centerY - 30); // Adjust bubble position
            this.infoText.setPosition(buildingRect.centerX, buildingRect.centerY - 30);
            this.infoText.setText(building.description); // Set the text to the building's description
            this.infoBubble.setVisible(true);
            this.infoText.setVisible(true);
            isNearBuilding = true; // Stop checking further buildings if already near one
            break; // Only show info for the first building the character is near
        }
    }

    // Set depth to ensure info bubble and text are displayed on top
    this.infoBubble.setDepth(100);
    this.infoText.setDepth(101);

    // If the character is not near any building, hide the info bubble
    if (!isNearBuilding) {
        this.infoBubble.setVisible(false);
        this.infoText.setVisible(false);
    }

    // Car and character controls
    const carspeed = 80;
    const acceleratedSpeed = carspeed * 1.5;  // Define the accelerated speed when Shift is pressed
    const charspeed = 350;

    // Check proximity to the car
    const distance = Phaser.Math.Distance.Between(this.character.x, this.character.y, this.car.x, this.car.y);
    this.nearCar = distance < 40;  // Set a threshold distance, e.g., 50 pixels

    if (this.nearCar && Phaser.Input.Keyboard.JustDown(this.keyE)) {
        this.toggleCar();
    }

    if (this.inCar) {
        // Car controls
        this.car.setVelocity(0);

        // Check if Shift is down for acceleration
        const isShiftDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT).isDown;

        // Adjust the speed based on whether Shift is down
        const currentSpeed = isShiftDown ? acceleratedSpeed : carspeed;

        if (this.cursors.left.isDown) {
            this.car.setVelocityX(-currentSpeed);
            this.car.angle = 270; // Rotate car to face left
        } else if (this.cursors.right.isDown) {
            this.car.setVelocityX(currentSpeed);
            this.car.angle = 90; // Rotate car to face right
        } else if (this.cursors.up.isDown) {
            this.car.setVelocityY(-currentSpeed);
            this.car.angle = 0; // Rotate car to face up
        } else if (this.cursors.down.isDown) {
            this.car.setVelocityY(currentSpeed);
            this.car.angle = 180; // Rotate car to face down
        }
    } else {
        // Character controls
        this.character.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.character.setVelocityX(-charspeed);
            this.character.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown) {
            this.character.setVelocityX(charspeed);
            this.character.anims.play('walk-right', true);
        } else if (this.cursors.up.isDown) {
            this.character.setVelocityY(-charspeed);
            this.character.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown) {
            this.character.setVelocityY(charspeed);
            this.character.anims.play('walk-down', true);
        } else {
            this.character.anims.stop();
        }
    }

    // Define coordinates of the transition zone
    const transitionZoneX = 1292;  // Adjust these coordinates as needed
    const transitionZoneY = 145;
    const distanceToZone = Phaser.Math.Distance.Between(this.character.x, this.character.y, transitionZoneX, transitionZoneY);

    // Check if character is close enough to transition
    if (distanceToZone < 20) {  // Adjust distance threshold as desired
        this.scene.start('NextMap');  // Transition to NextMap scene
    }
    }
    

    toggleCar() {
        this.inCar = !this.inCar;

        if (this.inCar) {
            // Enter car: position character in car and disable character controls
            this.character.visible = false;
            this.character.setPosition(this.car.x, this.car.y);
            this.cameras.main.startFollow(this.car);  // Follow the car
        } else {
            // Exit car: position character next to car and enable controls
            this.character.visible = true;
            this.character.setPosition(this.car.x + 10, this.car.y);
            this.cameras.main.startFollow(this.character);  // Follow the character
        }
    }

}
