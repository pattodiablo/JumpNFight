// You can write more code here

/* START OF COMPILED CODE */

import PhaserScene from "../presentation/phaser/models/PhaserScene";
import PlayerPrefab from "./PlayerPrefab";
import LaserShot from "./LaserShot";
import { SpineGameObject } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
import Enemy1V1 from "./Enemy1V1";
import CollectableParticle from "./CollectableParticle";
import Cannon from "./Cannon";
type CustomRectangle = Phaser.GameObjects.Rectangle & { hasCreatedMidPlatform?: boolean };


import 
{

    DynamicMotionSystem,
    DirectionSystem,
    GravitySystem,
    NavigationSystem,
    ShapeRenderSystem,
    TextureRenderSystem,
    TransformSystem,

} from "@ecs/systems";
import { AccelerationService } from "~/core/application/services";
import Enemy1 from "./Enemy1";
import Enemy2 from "./Enemy2";
import Enemy3 from "./Enemy3";  
import Enemy4 from "./Enemy4";
import Enemy5 from "./Enemy5";
import Enemy6 from "./Enemy6";
import Enemy7 from "./Enemy7";
import Enemy8 from "./Enemy8";
import Enemy9 from "./Enemy9";
import Enemy10 from "./Enemy10";
import Enemy11 from "./Enemy11";
import Enemy12 from "./Enemy12";
import { initializeGame } from "..";

// Extend the Window interface to include 'game' and 'GAME'
declare global {
    interface Window {
        game?: any;
        GAME?: any;
    }
}


/* END-USER-IMPORTS */

export default class Level extends PhaserScene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// Player
		const player = new PlayerPrefab(this, this.spine, 900, -964);
		this.add.existing(player);
		player.scaleX = 0.5;
		player.scaleY = 0.5;

		// bg1
		const bg1 = this.add.tileSprite(0, 0, 1920, 1080, "bg1");
		bg1.setOrigin(0, 0);

		// LaserShot
		const laserShot = new LaserShot(this, 715, 740);
		this.add.existing(laserShot);

		// theBuilding
		const theBuilding = this.add.sprite(-1345, -178, "TheBuilding");
		theBuilding.setInteractive(new Phaser.Geom.Rectangle(0, 0, 3072, 3072), Phaser.Geom.Rectangle.Contains);
		theBuilding.scaleX = 3;
		theBuilding.scaleY = 3;

		// Wall
		const wall = this.add.rectangle(-1210, -763, 1000, 8000);
		wall.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1000, 8000), Phaser.Geom.Rectangle.Contains);
		wall.alpha = 0;
		wall.isFilled = true;

		this.player = player;
		this.bg1 = bg1;
		this.laserShot = laserShot;
		this.theBuilding = theBuilding;
		this.wall = wall;

		this.events.emit("scene-awake");
	}

	public player!: PlayerPrefab;
	public bg1!: Phaser.GameObjects.TileSprite;
	public laserShot!: LaserShot;
	private theBuilding!: Phaser.GameObjects.Sprite;
	private wall!: Phaser.GameObjects.Rectangle;

	/* START-USER-CODE */



	// Write your code here
    private currentPlatform!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private currentAnimation: string = "Idle";
	public platforms!: Phaser.GameObjects.Group;
    private platformBuffer: number = 20; // Número de plataformas de buffer por delante y por detrás del jugador
    public enemies!: Phaser.GameObjects.Group; // Grupo de enemigos
    private platformCount: number = 0; // Contador de plataformas creadas
    private CannonCountDistance:number = 30;
    private firtCannonPlaced = false;
    public musicManager!: Phaser.Sound.BaseSoundManager;
    public fxManager!: Phaser.Sound.BaseSoundManager;
    public bgMusic!: Phaser.Sound.BaseSound;
    public isFxMuted: boolean = false;
    public FactorDeDificultad: number = 1.03;
    private WaveNumber: number =  0;

    // Systems

    private _transform: TransformSystem = new TransformSystem(this, this.world);
    private _shapeRender: ShapeRenderSystem = new ShapeRenderSystem(this, this.world);
    private _calculateDirection: DirectionSystem = new DirectionSystem(this, this.world);
    private _applyGravity: GravitySystem = new GravitySystem(this, this.world);
    private _navigation: NavigationSystem = new NavigationSystem(this, this.world);
    private _setAcceleration: DynamicMotionSystem = new DynamicMotionSystem(this, this.world, new AccelerationService());
    private _textureRender: TextureRenderSystem = new TextureRenderSystem(this, this.world);

	create() {
		this.editorCreate();
    // this.createParticles();
         //this.cameras.main.postFX.addPixelate(0.01); // Cambia 8 por el tamaño de pixel deseado



// Agregar colisión entre el jugador y la pared (wall)
this.physics.add.existing(this.wall, true);
this.physics.add.collider(this.player, this.wall);

       this.musicManager = this.sound;
       this.fxManager = this.sound;

        // 🎵 Música de fondo
        this.bgMusic = this.musicManager.add('bgMusic', { loop: true, volume: 1 });
        this.bgMusic.play();




        const poki = this.plugins.get('pokii');

        if (poki) {

            (poki as any).runWhenInitialized((poki: { hasAdblock: boolean }) => {
                console.log('PokiSDK has been initialized');
                (poki as any).gameplayStart();
                if (poki.hasAdblock) {
                    this.add.text(10, 10, 'Adblock detected!', {
                      color: 'black'
                    })
                  }
               // (poki as any).gameplayStart();
                if (!poki.hasAdblock) {
                  // When ads are available: enable the rewarded ad button:
                  /*
                  (poki as any).rewardedBreak().then((success: boolean) => {

                    if (success) {
                        console.log('Give coins!');
                        // Give coins!
                    }

                });
                 */
                }
              })



        };

        // this.scene.launch("GameUI");
        const factor = this.scale.height/this.scale.width;
        this.bg1.width = this.scale.width;
        // Reproduce la animación 'Idle' por defecto
        this.player.animationState.setAnimation(0, "Idle", true);
		this.cameras.main.startFollow(this.player, true, 0.8, 1,0,0);
		this.cameras.main.setZoom(factor/4); // Ajustar el zoom de la cámara para que parezca más alejada
		this.cameras.main.fadeIn(100);
        const fxCamera = this.cameras.main.postFX.addPixelate(40);
        this.add.tween({
            targets: fxCamera,
            duration: 700,
            amount: -1,
        });


        this.platforms = this.add.group();
        this.enemies = this.add.group();
        this.bg1.setDepth(-1);

        this.bg1.setSize(this.cameras.main.displayWidth*20, this.cameras.main.displayHeight*10);
        this.bg1.setTileScale(4, 4);


		this.createFloor();
		this.createPlatforms();
        this.createEnemies();

        this.game.events.once("PlayerIsDead", () => {
            console.log("Player is dead...");
            this.fadeOut(1000); // Desvanecer la pantalla
        },this);

            // ...existing code...
     // ...existing code...
this.game.events.once("RestartLevel", () => {
    console.log("Restarting level...");

    // Guardar estado de mute antes de reiniciar
    const wasMusicMuted = this.bgMusic && !this.bgMusic.isPlaying;
    const wasFxMuted = this.isFxMuted;

    // Detener y destruir todos los sonidos activos antes de reiniciar escenas
    this.sound.stopAll();
    this.sound.removeAll();

    this.events.removeAllListeners("update");

    // Reiniciar todas las escenas activas
    this.scene.manager.getScenes(true).forEach((scene: Phaser.Scene) => {
        if (scene.scene.key !== this.scene.key) {
            scene.scene.restart();
        }
    });

    // Reiniciar la escena actual
    this.game.destroy(true);

    // Vuelve a crear el juego (debes tener tu función de inicialización disponible)
    initializeGame();

    // Restaurar estado de mute después de reiniciar (usa un pequeño delay para asegurar que el juego esté listo)
    setTimeout(() => {
       
        const newGame = window.game || window.GAME; // Ajusta según cómo guardes tu instancia global
        if (newGame) {
            const levelScene = newGame.scene.getScene('Level');
            console.log("Level Scene "+ levelScene);
            if (levelScene) {
                console.log("was music mutted " + wasFxMuted);
                levelScene.setMusic(!wasMusicMuted);
                levelScene.setFX(!wasFxMuted);
            }
        }
    }, 500);
}, this);
// ...existing code...
        // ...existing code...
	}

    public setMusic(order:boolean){
        if(order){
            this.bgMusic.play();
        }else{
            this.bgMusic.stop();
        }

    }
    public setFX(order:boolean){
        if(order){

            this.isFxMuted = false;
        }else{

            this.isFxMuted = true;
        }

    }

    createEnemies() {
        this.enemies = this.add.group();

        let numEnemies = this.FactorDeDificultad * this.WaveNumber;

        let minEnemyX = this.cameras.main.x - 10000;
        let maxEnemyX = this.cameras.main.x + 10000;
        let minEnemyY = this.player.y - 900;
        let maxEnemyY = this.scale.height - 2000;

        // Array de clases de enemigos
        const EnemyClasses = [
            Enemy1, Enemy2, Enemy3, Enemy4, Enemy5, Enemy6,
            Enemy7, Enemy8, Enemy9, Enemy10, Enemy11, Enemy12
        ];

        const generateEnemies = () => {
            let maxTypeIndex = Math.min(this.WaveNumber, EnemyClasses.length);

            for (let i = 0; i < numEnemies; i++) {
                const enemyX = Phaser.Math.Between(minEnemyX, maxEnemyX);
                const enemyY = Phaser.Math.Between(minEnemyY, maxEnemyY);

                const randomTypeIndex = Phaser.Math.Between(0, maxTypeIndex - 1);
                const EnemyClass = EnemyClasses[randomTypeIndex];

                const enemy = new EnemyClass(this, this.spine, enemyX, enemyY);
                this.add.existing(enemy);
                this.enemies.add(enemy);
            }

            numEnemies += 2;
        };

        const checkAndGenerateEnemies = () => {
            if (this.enemies.getLength() === 0) {
                generateEnemies();
            }

            this.time.delayedCall(5000, checkAndGenerateEnemies, [], this);
        };

        checkAndGenerateEnemies();
    }



createParticles() {
    const generateParticle = () => {
        const x =  Phaser.Math.Between(this.player.x-1000, this.player.x+1000); // A la derecha de la cámara
        const y = Phaser.Math.Between(this.player.y, this.player.y-1000); // Desde la mitad de la pantalla hacia arriba
        const particle = new CollectableParticle(this, x, y);
        this.add.existing(particle);
    };

    // Llamar a generateParticle cada cierto tiempo
    this.time.addEvent({
        delay: 1000, // Intervalo de tiempo en milisegundos
        callback: generateParticle,
        callbackScope: this,
        loop: true
    });
}
	createPlatforms() {
        // Crear un grupo para las plataformas
    const minPlatformWidth = 400;
    const maxPlatformWidth = 4000;
    const minPlatformHeight = 800;
    const maxPlatformHeight = 1400;
    const minPlatformDistance = 2000;
    const maxPlatformDistance = 4000;
    const minPlatformY = 500;
    const maxPlatformY = this.scale.height - 1200;

    let previousPlatformX = 0;

    // Generar plataformas iniciales
    for (let i = 0; i < this.platformBuffer; i++) {
        const platformWidth = Phaser.Math.Between(minPlatformWidth, maxPlatformWidth);
        const platformHeight = Phaser.Math.Between(minPlatformHeight, maxPlatformHeight);
        const platformDistance = Phaser.Math.Between(minPlatformDistance, maxPlatformDistance);
        const platformX = previousPlatformX + platformDistance;
        const platformY = Phaser.Math.Between(minPlatformY, maxPlatformY);

        // Crea la plataforma visual con bordes redondeados
        const { graphics, collider } = this.createRoundedPlatform(platformX, platformY, platformWidth, platformHeight, 40);

        this.physics.add.collider(this.player, collider, this.checkPlatformDistance as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
        this.platforms.add(collider);

        previousPlatformX = platformX;
        this.platformCount++;
        if (this.platformCount % 5 === 0 && !this.firtCannonPlaced) {
            this.firtCannonPlaced = true;
            const cannonX = platformX;
            const cannonY = platformY - platformHeight - 500;
            const cannon = new Cannon(this, cannonX, cannonY);
            this.add.existing(cannon);
        }
        if (this.platformCount % this.CannonCountDistance === 0) {
            const cannonX = platformX / 2;
            const cannonY = platformY - platformHeight * 2;
            const cannon = new Cannon(this, cannonX, cannonY);
            cannon.setDepth(this.player.depth - 1);
            this.add.existing(cannon);
        }
    }
}

/**
 * Crea una plataforma visual con bordes redondeados y un collider rectangular invisible.
 */
createRoundedPlatform(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number = 40,
    color: number = 0x000000
): { graphics: Phaser.GameObjects.Graphics, collider: Phaser.GameObjects.Rectangle } {
    // Dibuja el rectángulo redondeado
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);

    // Crea el collider rectangular invisible
    const collider = this.add.rectangle(x, y, width, height, 0x000000, 0);
    collider.setOrigin(0.5, 0.5);
    collider.setVisible(false);
    this.physics.add.existing(collider, true);

    return { graphics, collider };
}

	createFloor() {

		// Crea un suelo
		if (this.add) {
			const floor = this.add.rectangle(0, this.scale.height-600, this.scale.width+1300, 500, 0x000000);
			floor.setOrigin(0.5,0.5);
			this.physics.add.existing(floor, true);
			 // Agregar colisión entre el jugador y el suelo
			 this.physics.add.collider(this.player, floor);
             floor.setDepth(this.player.depth - 1);
			 this.platforms.add(floor);

		}

	}

	update(time: number, delta: number): void {

        this._transform.execute();
        this._navigation.execute();
        this._setAcceleration.execute();
        this._calculateDirection.execute();
        this._applyGravity.execute();
        this._shapeRender.execute();
        this._textureRender.execute();

		//console.log(this.input.x);
	 // 	this.player.updatePlayer(delta);
        this.updatePlatforms();
        this.updateWorldBounds();
        //track de player metros
        this.events.emit("playerMove", this.player.x);
        const gameUI = this.scene.get('GameUI') as any;
        const EnergyLevel = gameUI.level;
       this.WaveNumber = EnergyLevel


        if (this.player.y > 2000) {

          //  gameUI.updateLevelBar(-25*EnergyLevel);
            this.player.handleDamage(900);
            if (this.currentPlatform) {
                this.player.x = this.currentPlatform.x;
                this.player.y = this.currentPlatform.y - 1800;
            } else {
                this.player.y = -2000;
                this.player.x = this.player.x - 400;
            }
            this.cameras.main.shake(500, 0.1); // Duración de 500ms y intensidad de 0.1
        }

         // Actualizar la posición de bg1 para crear el efecto parallax
         this.bg1.tilePositionX = this.cameras.main.scrollX * 0.05;
         const smoothFactor = 5; // Mayor = más rápido
         const t = smoothFactor * (delta / 1000)

         const targetX = this.cameras.main.scrollX - this.bg1.width / 2;
         this.bg1.x += (targetX - this.bg1.x) * t; // Lerp hacia la posición deseada

         const targetY = this.cameras.main.scrollY-this.bg1.height/2;
         this.bg1.y += (targetY - this.bg1.y) * t; // Lerp hacia la posición deseada

    }

	updatePlatforms() {

		const minPlatformWidth = 400; // Ancho mínimo de la plataforma
        const maxPlatformWidth = 4000; // Ancho máximo de la plataforma
        const minPlatformHeight = 800; // Altura mínima de la plataforma
        const maxPlatformHeight = 1400; // Altura máxima de la plataforma
        const minPlatformDistance = 2000; // Distancia mínima entre plataformas
        const maxPlatformDistance = 4000; // Distancia máxima entre plataformas
        const minPlatformY = 500; // Altura mínima de la plataforma
        const maxPlatformY = this.scale.height - 500; // Altura máxima de la plataformadad

        // Obtener la plataforma más a la derecha
        let maxPlatformX = 0;
        this.platforms.getChildren().forEach((platform) => {
            if ((platform as Phaser.GameObjects.Rectangle).x > maxPlatformX) {
                maxPlatformX = (platform as Phaser.GameObjects.Rectangle).x;
            }
        });

        // Generar nuevas plataformas si el jugador se acerca al final del buffer
        if (this.player.x + this.scale.width > maxPlatformX) {
            for (let i = 0; i < this.platformBuffer; i++) {
                const platformWidth = Phaser.Math.Between(minPlatformWidth, maxPlatformWidth);
                const platformHeight = Phaser.Math.Between(minPlatformHeight, maxPlatformHeight);
                const platformDistance = Phaser.Math.Between(minPlatformDistance, maxPlatformDistance);
                const platformY = Phaser.Math.Between(minPlatformY, maxPlatformY);

                const platformX = maxPlatformX + platformDistance;

                // Crea la plataforma visual con bordes redondeados
                const { graphics, collider } = this.createRoundedPlatform(platformX, platformY, platformWidth, platformHeight, 40);

                this.physics.add.collider(this.player, collider, this.checkPlatformDistance as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
                this.platforms.add(collider);

                maxPlatformX = platformX;
                this.platformCount++;


                // Agregar un prefab de tipo Cannon cada CannonCountDistance plataformas
                if (this.platformCount % this.CannonCountDistance === 0) {

                    const cannonX = platformX;
                    const cannonY = platformY- platformHeight * 2; // Ajustar la posición del Cannon
                const cannon = new Cannon(this, cannonX,  cannonY);
                console.log("cannon added "+ cannonX, cannonY);
                collider.fillColor = 0xff0000;
                this.add.existing(cannon);
                }
            }
        }



        // Destruir plataformas que están fuera del buffer
        this.platforms.getChildren().forEach((platform) => {
            if ((platform as Phaser.GameObjects.Rectangle).x < this.player.x - this.scale.width * this.platformBuffer) {
                platform.destroy();

            }
        });
    }

    checkPlatformDistance(player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile, platform: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile) {
		const currentPlatform = platform as Phaser.GameObjects.Rectangle;
        this.currentPlatform = currentPlatform; // Actualizar la plataforma actual
       // currentPlatform.fillColor = 0xff0000; // Cambiar el color de la plataforma a rojo
        this.platforms.getChildren().forEach((value) => {
            const p = value as Phaser.GameObjects.Rectangle;
            if (p !== currentPlatform) {
                p.fillColor = 0x000000; // Cambiar el color de la plataforma a negro
            }
        });

		  // Identificar la siguiente plataforma y cambiar su color a rojo oscuro
          const nextPlatform = this.platforms.getChildren().find((p) => {
            return (p as Phaser.GameObjects.Rectangle).x > currentPlatform.x;
        }) as Phaser.GameObjects.Rectangle;

        if (nextPlatform) {
        //    nextPlatform.fillColor = 0x8B0000; // Cambiar el color de la siguiente plataforma a rojo oscuro
			const yDifference = Math.abs(nextPlatform.y - currentPlatform.y);
			const xDifference = Math.abs(nextPlatform.x - currentPlatform.x);


             if (yDifference > 3000 && !(currentPlatform as any).hasCreatedMidPlatform) {


				const midX = (currentPlatform.x + currentPlatform.width / 2 + nextPlatform.x - nextPlatform.width / 2) / 2;
				const midY = (currentPlatform.y + nextPlatform.y) / 2;
                const platformWidth = 400;
                const platformHeight = 400;

                const { graphics, collider } = this.createRoundedPlatform(midX, midY, platformWidth, platformHeight, 40);

                collider.setDepth(this.player.depth - 1);
                this.physics.add.collider(this.player, collider, this.checkPlatformDistance as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

                this.platforms.add(collider);
                (currentPlatform as CustomRectangle).hasCreatedMidPlatform = true;

        }
		if( xDifference > 3000 && !(currentPlatform as any).hasCreatedMidPlatform){

			const midX = (currentPlatform.x + currentPlatform.width / 2 + nextPlatform.x - nextPlatform.width / 2) / 2;
			const midY = (currentPlatform.y + nextPlatform.y) / 2;
			const platformWidth = 400;
			const platformHeight = 400;

			const { graphics, collider } = this.createRoundedPlatform(midX, midY, platformWidth, platformHeight, 40);

            this.physics.add.collider(this.player, collider, this.checkPlatformDistance as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

			this.platforms.add(collider);
			(currentPlatform as CustomRectangle).hasCreatedMidPlatform = true;
		}
	}
}

updateWorldBounds() {
    const camera = this.cameras.main;
    const worldBounds = this.physics.world.bounds;

    // Actualizar los límites del mundo según la posición de la cámara
    worldBounds.x = camera.worldView.x;
    worldBounds.y = camera.worldView.y;
    worldBounds.width = camera.worldView.width;
    worldBounds.height = camera.worldView.height;

    // Asegurarse de que el cuerpo del sawBullet colisione con los nuevos límites del mundo

}

    fadeOut(duration: number) {
        this.cameras.main.fadeOut(duration, 0, 0, 0);
    }
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */


