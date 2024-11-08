import axios from "axios"
export default class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
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

    init() {
        // Retrieve the socket instance from game registry or data
        const socket = this.game.registry.get('socket'); // or this.game.data.get('socket')
        
        if (socket) {
          // Use the socket as needed, e.g., emit a message
        //   socket.emit('level-start', { level: 'Level1' });
          console.log('Socket connection in Level2:', socket.id);
        } else {
          console.warn('Socket not available in Level1');
        }
      }

    create() {
        
        this.createQuestionPanel(`Level2`);
        this.setupInput();
        this.showQuestionAtStart(10000); // Show question for 5 seconds

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
       const groundLayer= map.createLayer('Ground', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal, element, groundRed, groundGreen, groundGravel, soda], 0, 0);
        const objectLayer = map.createLayer('Objects', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal, soda, vending, water_fountain, flower1, flower3, six, nine, element], 0, 0);
        map.createLayer('Windows', [forestTiles, roguelikeCityTiles, terrainTiles, tilemapTiles, tilesetFinal], 0, 0);

        groundLayer.setCollisionByProperty({ collision: true });

        // Character setup
        this.character = this.physics.add.sprite(900, 1300, 'character').setScale(0.3);
        var frameNames =  this.textures.get('character').getFrameNames();
        console.log(frameNames)
        this.cameras.main.startFollow(this.character);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(4);
        this.cameras.main.setDeadzone(5, 5);
        this.cameras.main.roundPixels = true;

        this.physics.add.collider(this.character,groundLayer);

        
        // Mini-map camera setup
        const miniMapWidth = 150;
        const miniMapHeight = 150;
        const miniMapX = this.cameras.main.width - miniMapWidth - 10;
        const miniMapY = this.cameras.main.height - miniMapHeight - 10;

        const miniMapCamera = this.cameras.add(miniMapX, miniMapY, miniMapWidth, miniMapHeight);
        miniMapCamera.setZoom(0.09);
        miniMapCamera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        miniMapCamera.roundPixels = true;

        //Movement Animations
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

    

        this.character.setDepth(10);

        objectLayer.setDepth(20);


        //on completion
        this.loadProgress();

        // Load saved progress if it exists
        this.loadProgress();

        // Start the timer
        this.startTime = this.time.now - this.elapsedTime * 1000; // Restore previous time if reloaded

        // Define penalties (initialize to 0)
        this.penalties = 0;

        // Flag to track if the player is in the completion zone
        this.inCompletionZone = false;

        const completionZones = map.getObjectLayer('Script').objects.filter(obj => 
            obj.properties && obj.properties.some(property => property.name === 'complete_zone' && property.value === true)
        );
        
        this.completionZones = completionZones.map(zoneObj => { 
            const completionZone = this.add.zone(zoneObj.x, zoneObj.y).setSize(zoneObj.width, zoneObj.height);
            this.physics.world.enable(completionZone);
            
            // Set up overlap detection when entering the zone
            this.physics.add.overlap(this.character, completionZone, () => {
                this.inCompletionZone = true;
                console.log('Player entered the completion zone! 2');
            }, null, this);
        
            return completionZone;
        });
        
        // Listen for "Enter" key to complete the level
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        

        this.cursors = this.input.keyboard.createCursorKeys();



        // Inside your Phaser scene class (e.g., in create() or as a separate method)

this.input.keyboard.on('keydown-ESC', () => {
    this.saveProgress();
    this.scene.pause(); // NOT RESUMING AFTER PRESSING ESC AGAIN
});

// Outside the Phaser scene or at the top level (e.g., in main game script)
window.addEventListener('beforeunload', (event) => {
    this.saveProgress();
    event.preventDefault();
    event.returnValue = ''; // Trigger confirmation dialog
});

        
        
        
        

        // Create a red dot to represent the character on the minimap
        this.redDot = this.add.circle(0, 0, 20, 0xff0000);
        
        // Ensure red dot is ignored by main camera and shown in minimap
        this.cameras.main.ignore(this.redDot);


        // Character movement input
        this.cursors = this.input.keyboard.createCursorKeys();

        miniMapCamera.ignore(this.panel);
        miniMapCamera.ignore(this.questionTextPanel);

    }

    createQuestionPanel(questionText) {
        // Get the center of the screen
        const panelWidth = window.innerWidth;
        const panelHeight = window.innerHeight;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
    
        // Calculate the top-left corner of the panel to center it on the screen
        const panelX = centerX - panelWidth / 2;
        const panelY = centerY - panelHeight / 2;
    
        // Create background panel
        this.panel = this.add.graphics();
        this.panel.fillStyle(0x000000, 0.7); // Black with 70% opacity
        this.panel.fillRect(panelX, panelY, panelWidth, panelHeight);
        this.panel.setScrollFactor(0); // Keep it fixed on screen
        this.panel.setDepth(100); // High depth to be above most elements
        this.panel.setVisible(false);
    
        // Add question text centered within the panel
        this.questionTextPanel = this.add.text(centerX, centerY, questionText, {
            fontSize: '10px',  // Adjust size as needed
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: panelWidth - 50 }
        }).setOrigin(0.5) // Center the text origin
          .setScrollFactor(0)
          .setDepth(101); // Higher depth than panel
        this.questionTextPanel.setVisible(false);
    }
    
    // Setup input to toggle question visibility
    setupInput() {
        this.input.keyboard.on('keydown-Q', () => {
            this.toggleQuestionVisibility();
        });
    }
    
    // Toggle question panel visibility
    toggleQuestionVisibility() {
        const isVisible = this.panel.visible;
        this.panel.setVisible(!isVisible);
        this.questionTextPanel.setVisible(!isVisible);
    }
    
    // Show question at the start and hide after a delay
    showQuestionAtStart(delay) {
        this.panel.setVisible(true);
        this.questionTextPanel.setVisible(true);
    
        this.time.delayedCall(delay, () => {
            this.panel.setVisible(false);
            this.questionTextPanel.setVisible(false);
        });
    }
    
    




    update() {
        const speed = 160;
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
            this.character.anims.stop();
        }
    
        // Update red dot position on minimap
        this.redDot.x = this.character.x;
        this.redDot.y = this.character.y;
    
        // Check if the character is still in any completion zone
    const isOverlappingAnyZone = this.completionZones.some(zone => 
        Phaser.Geom.Intersects.RectangleToRectangle(this.character.getBounds(), zone.getBounds())
    );

    if (!isOverlappingAnyZone && this.inCompletionZone) {
        this.inCompletionZone = false;
        console.log('Player left the completion zone!');
    }

    // Check Enter key and if in completion zone
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        console.log("Enter key pressed!");
        if (!this.inCompletionZone) {
            const data =  this.onLevelComplete();
            const {time , penalty , CPI } =data;
            console.log("data: ",data);
          
                const fun=async()=>{
                    try {
                         const res=await axios.post("http://localhost:3000/level-complete",{
                       SPI: CPI,
                        Level:"Level2",
    
                    },{
                        headers: {Authorization : localStorage.getItem("token")}
                    } )
                    const nextLevel=res.data;
                    console.log(nextLevel);
                    if(nextLevel==null){
                        //game is comp 
                    }
                    else{

                       const localStoragedata= localStorage.getItem("playerProgress")
                      this.clearProgress();
                       let playerProgress = JSON.parse(localStoragedata);
                      console.log("data coming to local storage : " ,playerProgress);
                       playerProgress.Level=nextLevel;
                       localStorage.setItem("playerProgress", JSON.stringify(playerProgress));
                    console.log("data going to local storage : " ,playerProgress);
                    this.scene.start(nextLevel);

                    }
                } catch (error) {
                        
                    }
                   
                }

                fun();
            // const socket = this.game.registry.get('socket');
            // socket.emit("level-comp",data);
            console.log("In completion zone, calling onLevelComplete.");
            // this.onLevelComplete();
        } else {
            this.penalties++;
            console.log("Not in completion zone.");
        }
    }
    }
    

    onLevelComplete() {
        console.log("CURRENT : ",this.time.now );
        console.log("START TIME : ", this.startTime)
        this.elapsedTime = (this.time.now - this.startTime) / 1000;
        console.log("TIME : ",this.elapsedTime);
        console.log(this.penalties);
        const cpi = this.calculateCPI(this.elapsedTime, this.penalties);
        console.log(`Level completed! CPI: ${cpi.toFixed(2)}`);
        return { time : this.elapsedTime, penalty : this.penalties,CPI: cpi.toFixed(2) }
    }

    calculateCPI(timeTaken, penalties) {
        const maxCPI = 10;
        const targetTime = 100; // Target time in seconds (e.g., 5 minutes)
        const timePenaltyRate = 0.02; // Rate at which CPI decreases per second beyond target time
        const penaltyDeduction = 0.5; // CPI deduction per penalty
    
        // Time-based deduction
        let timePenalty = 0;
        if (timeTaken > targetTime) {
            timePenalty = (timeTaken - targetTime) * timePenaltyRate;
        }
    
        // Penalty-based deduction
        const penaltyPoints = penalties * penaltyDeduction;
    
        // Calculate final CPI
        let cpi = maxCPI - timePenalty - penaltyPoints;
    
        // Ensure CPI is within 0-10 range
        if (cpi < 0) cpi = 0;
        if (cpi > 10) cpi = 10;
    
        return cpi;
    }

    saveProgress = () => {
        const progress = {
            x: this.character.x,
            y: this.character.y,
            elapsedTime: this.elapsedTime,
            penalties: this.penalties,
            Level:"Level2"

        };
        localStorage.setItem('playerProgress', JSON.stringify(progress));
        console.log("Progress saved:", progress);
    };
    

        loadProgress() {
        const savedProgress = localStorage.getItem('playerProgress');
        
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
    
                // Ensure position, elapsedTime, and penalties exist and have valid data
                if ( typeof progress.x === 'number' && typeof progress.y === 'number') {
                    this.character.setPosition(progress.x, progress.y);
                } else {
                    console.warn("Saved position data is missing or invalid. Starting at default position.");
                }
    
                // Load elapsedTime if it exists and is a valid number
                this.elapsedTime = typeof progress.elapsedTime === 'number' ? progress.elapsedTime : 0;
    
                // Load penalties if it exists, default to 0 if not
                this.penalties = typeof progress.penalties === 'number' ? progress.penalties : 0;
    
                console.log("Progress loaded:", progress);
            } catch (error) {
                console.error("Failed to load saved progress:", error);
                this.elapsedTime = 0;
                this.penalties = 0;
            }
        } else {
            // If no saved progress, start with defaults
            this.elapsedTime = 0;
            this.penalties = 0;
        }
    }
    

    clearProgress() {
        localStorage.removeItem('playerProgress');
        console.log("Progress cleared.");
    }

}
