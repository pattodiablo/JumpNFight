
// You can write more code here

/* START OF COMPILED CODE */

import PlayerPrefab from "./PlayerPrefab";
import Enemy1 from "./Enemy1";
import { SpineGameObject } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
type CustomRectangle = Phaser.GameObjects.Rectangle & { hasCreatedMidPlatform?: boolean };
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

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

		// enemyV1
		const enemyV1 = new Enemy1(this, this.spine, 3087, -406);
		this.add.existing(enemyV1);

		// enemyV
		const enemyV = new Enemy1(this, this.spine, 4002, -612);
		this.add.existing(enemyV);

		// enemyV_1
		const enemyV_1 = new Enemy1(this, this.spine, 3722, -323);
		this.add.existing(enemyV_1);

		// enemyV_2
		const enemyV_2 = new Enemy1(this, this.spine, 4604, -529);
		this.add.existing(enemyV_2);

		// enemyV_3
		const enemyV_3 = new Enemy1(this, this.spine, 4777, -265);
		this.add.existing(enemyV_3);

		// enemyV_4
		const enemyV_4 = new Enemy1(this, this.spine, 5197, -381);
		this.add.existing(enemyV_4);

		// enemyV_5
		const enemyV_5 = new Enemy1(this, this.spine, 5584, -513);
		this.add.existing(enemyV_5);

		// enemyV_6
		const enemyV_6 = new Enemy1(this, this.spine, 6103, -373);
		this.add.existing(enemyV_6);

		this.player = player;

		this.events.emit("scene-awake");
	}

	public player!: PlayerPrefab;

	/* START-USER-CODE */

    public playerSpeed: number = 10; // Variable pública para la velocidad del jugador

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private currentAnimation: string = "Idle";
	// Write your code here
	private platforms!: Phaser.GameObjects.Group;
    private platformBuffer: number = 20; // Número de plataformas de buffer por delante y por detrás del jugador
	create() {

		this.editorCreate();

        // Reproduce la animación 'Idle' por defecto
        this.player.animationState.setAnimation(0, "Idle", true);
		this.cameras.main.startFollow(this.player, true, 0.8, 1,0,0);
		this.cameras.main.setZoom(0.5); // Ajustar el zoom de la cámara para que parezca más alejada
		this.platforms = this.add.group();
		this.createFloor();
		this.createPlatforms();

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

        }
    }

	createFloor() {

		// Crea un suelo
		if (this.add) {
			const floor = this.add.rectangle(0, this.scale.height-600, this.scale.width, 500, 0x000000);
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

		if (this.player.y > 2000) {
			this.player.y = -2000;
			this.player.x = this.player.x-400;
		}
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

			const newPlatform = this.add.rectangle(midX, midY, platformWidth, platformHeight, 0xff0000) as Phaser.GameObjects.Rectangle & { hasCreatedMidPlatform?: boolean };
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


