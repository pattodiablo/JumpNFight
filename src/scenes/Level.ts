
// You can write more code here

/* START OF COMPILED CODE */

import PlayerPrefab from "./PlayerPrefab";
import { SpineGameObject } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
import Enemy1 from "./Enemy1";
import CollectableParticle from "./CollectableParticle";
import Cannon from "./Cannon";
type CustomRectangle = Phaser.GameObjects.Rectangle & { hasCreatedMidPlatform?: boolean };
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {
    // contador inicializador
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

		this.player = player;
		this.bg1 = bg1;

		this.events.emit("scene-awake");
	}

	public player!: PlayerPrefab;
	public bg1!: Phaser.GameObjects.TileSprite;

	/* START-USER-CODE */



	// Write your code here
    private currentPlatform!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private currentAnimation: string = "Idle";
	public platforms!: Phaser.GameObjects.Group;
    private platformBuffer: number = 20; // Número de plataformas de buffer por delante y por detrás del jugador
    public enemies!: Phaser.GameObjects.Group; // Grupo de enemigos
    private platformCount: number = 0; // Contador de plataformas creadas
    private CannonCountDistance:number = 3;
    private firtCannonPlaced = false;

	create() {

		this.editorCreate();
        this.createParticles();
        const poki = this.plugins.get('poki');

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

        this.scene.launch("GameUI");
        const factor = this.scale.height/this.scale.width;
        this.bg1.width = this.scale.width;
        // Reproduce la animación 'Idle' por defecto
        this.player.animationState.setAnimation(0, "Idle", true);
		this.cameras.main.startFollow(this.player, true, 0.8, 1,0,0);
		this.cameras.main.setZoom(factor/2); // Ajustar el zoom de la cámara para que parezca más alejada
		this.platforms = this.add.group();
        this.enemies = this.add.group();
        this.bg1.setDepth(-1);

        this.bg1.setSize(this.cameras.main.displayWidth*20, this.cameras.main.displayHeight*10);
        this.bg1.setTileScale(4, 4);

		this.createFloor();
		this.createPlatforms();
        this.createEnemies();


	}


    createEnemies() {
        // Crear un grupo para los enemigos
        this.enemies = this.add.group();

        // Parámetros iniciales para la generación de enemigos
        let numEnemies = 1; // Número inicial de enemigos a generar
        let minEnemyX = this.cameras.main.x-5000; // Posición X mínima para los enemigos
        let maxEnemyX = this.cameras.main.x+5000; // Posición X máxima para los enemigos
        let minEnemyY = this.player.y-900; // Posición Y mínima para los enemigos
        let maxEnemyY = this.scale.height - 2000; // Posición Y máxima para los enemigos

        const generateEnemies = () => {
            for (let i = 0; i < numEnemies; i++) {
                const enemyX = Phaser.Math.Between(minEnemyX, maxEnemyX);
                const enemyY = Phaser.Math.Between(minEnemyY, maxEnemyY);

                const enemy = new Enemy1(this, this.spine, enemyX, enemyY);
                this.add.existing(enemy);

            }

            // Incrementar la dificultad
            numEnemies += 2; // Incrementar el número de enemigos
       
        };

        const checkAndGenerateEnemies = () => {
            if (this.enemies.getLength() === 0) {
                generateEnemies();
            }

            // Llamar a esta función nuevamente después de un cierto tiempo
            this.time.delayedCall(5000, checkAndGenerateEnemies, [], this); // Verificar cada 5 segundos
        };

        // Iniciar la verificación y generación de enemigos
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


		const minPlatformWidth = 400; // Ancho mínimo de la plataforma
        const maxPlatformWidth = 4000; // Ancho máximo de la plataforma
        const minPlatformHeight = 800; // Altura mínima de la plataforma
        const maxPlatformHeight = 1400; // Altura máxima de la plataforma
        const minPlatformDistance = 2000; // Distancia mínima entre plataformas
        const maxPlatformDistance = 4000; // Distancia máxima entre plataformas
        const minPlatformY = 500; // Altura mínima de la plataforma
        const maxPlatformY = this.scale.height - 1200; // Altura máxima de la plataformadad

        let previousPlatformX = 0;

        // Generar plataformas iniciales
        for (let i = 0; i < this.platformBuffer; i++) {
            const platformWidth = Phaser.Math.Between(minPlatformWidth, maxPlatformWidth);
            const platformHeight = Phaser.Math.Between(minPlatformHeight, maxPlatformHeight);
            const platformDistance = Phaser.Math.Between(minPlatformDistance, maxPlatformDistance);
            const platformX = previousPlatformX + platformDistance;

            const platformY = Phaser.Math.Between(minPlatformY, maxPlatformY);
            const platform = this.add.rectangle(platformX, platformY, platformWidth, platformHeight, 0x000000) as CustomRectangle;
            platform.setOrigin(0.5, 0.5);
            this.physics.add.existing(platform, true);
			this.physics.add.collider(this.player, platform, this.checkPlatformDistance, undefined, this);

            // Agregar colisión entre el jugador y la plataforma
            this.physics.add.collider(this.player, platform);

            this.platforms.add(platform);


            previousPlatformX = platformX;

            this.platformCount++;
            if (this.platformCount % 5 === 0 && !this.firtCannonPlaced) {
                this.firtCannonPlaced = true;
                const cannonX = platformX;
                const cannonY = platformY - platformHeight - 500; // Ajustar la posición del Cannon
                const cannon = new Cannon(this, cannonX, cannonY);
                this.add.existing(cannon);
            }
            // Agregar un prefab de tipo Cannon cada 30 plataformas
           // Agregar un prefab de tipo Cannon cada 30 plataformas
           if (this.platformCount % this.CannonCountDistance === 0) {
            const cannonX = platformX/2;
            const cannonY = platformY-platform.height*2 ; // Ajustar la posición del Cannon
            const cannon = new Cannon(this, cannonX, cannonY);
            this.add.existing(cannon);
        }

        }
    }

	createFloor() {

		// Crea un suelo
		if (this.add) {
			const floor = this.add.rectangle(0, this.scale.height-600, this.scale.width+1300, 500, 0x000000);
			floor.setOrigin(0.5,0.5);
			this.physics.add.existing(floor, true);
			 // Agregar colisión entre el jugador y el suelo
			 this.physics.add.collider(this.player, floor);
			 this.platforms.add(floor);

		}

	}

	update(time: number, delta: number): void {
		//console.log(this.input.x);
	 // 	this.player.updatePlayer(delta);
        this.updatePlatforms();
        //track de player metros
        this.events.emit("playerMove", this.player.x);
        if (this.player.y > 2000) {
            const gameUI = this.scene.get('GameUI') as any;
            const EnergyLevel = gameUI.level;
            gameUI.updateLevelBar(-25*EnergyLevel);

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
         this.bg1.tilePositionX = this.cameras.main.scrollX * 0.01;
         this.bg1.tilePositionY = this.cameras.main.scrollY * 0.05;
         this.bg1.x = this.cameras.main.scrollX-this.bg1.width/2;
         this.bg1.y = this.cameras.main.scrollY-this.bg1.height/2;
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

                const platform = this.add.rectangle(platformX, platformY, platformWidth, platformHeight, 0x000000);
                platform.setOrigin(0.5, 0.5);
                this.physics.add.existing(platform, true);

                // Agregar colisión entre el jugador y la plataforma
                this.physics.add.collider(this.player, platform, this.checkPlatformDistance, undefined, this);

                this.platforms.add(platform);

                maxPlatformX = platformX;
                this.platformCount++;

               
                // Agregar un prefab de tipo Cannon cada CannonCountDistance plataformas
                if (this.platformCount % this.CannonCountDistance === 0) {

                    const cannonX = platformX;
                    const cannonY = platformY- platformHeight * 2; // Ajustar la posición del Cannon
                    const cannon = new Cannon(this, cannonX,  cannonY);
                    console.log("cannon added "+ cannonX, cannonY);
                   platform.fillColor = 0xff0000;
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

                const newPlatform = this.add.rectangle(midX, midY, platformWidth, platformHeight, 0x000000) as Phaser.GameObjects.Rectangle & { hasCreatedMidPlatform?: boolean };
                newPlatform.setOrigin(0.5, 0.5);
                this.physics.add.existing(newPlatform, true);

                // Agregar colisión entre el jugador y la nueva plataforma
                this.physics.add.collider(this.player, newPlatform, this.checkPlatformDistance, undefined, this);

                this.platforms.add(newPlatform);
                (currentPlatform as CustomRectangle).hasCreatedMidPlatform = true;

        }
		if( xDifference > 3000 && !(currentPlatform as any).hasCreatedMidPlatform){

			const midX = (currentPlatform.x + currentPlatform.width / 2 + nextPlatform.x - nextPlatform.width / 2) / 2;
			const midY = (currentPlatform.y + nextPlatform.y) / 2;
			const platformWidth = 400;
			const platformHeight = 400;

			const newPlatform = this.add.rectangle(midX, midY, platformWidth, platformHeight, 0x000000) as Phaser.GameObjects.Rectangle & { hasCreatedMidPlatform?: boolean };
			newPlatform.setOrigin(0.5, 0.5);
			this.physics.add.existing(newPlatform, true);

			// Agregar colisión entre el jugador y la nueva plataforma
			this.physics.add.collider(this.player, newPlatform, this.checkPlatformDistance, undefined, this);

			this.platforms.add(newPlatform);
			(currentPlatform as CustomRectangle).hasCreatedMidPlatform = true;
		}
	}
}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */


