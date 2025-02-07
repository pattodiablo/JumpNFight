
// You can write more code here

/* START OF COMPILED CODE */

import PlayerPrefab from "./PlayerPrefab";
import { SpineGameObject } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
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
		const player = new PlayerPrefab(this, this.spine, 602, 148);
		this.add.existing(player);

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
		this.createFloor();
		this.createPlatforms();
	}

	createPlatforms() {
        // Crear un grupo para las plataformas
        this.platforms = this.add.group();

        // Parámetros para la generación procedural de plataformas
        const minPlatformWidth = 100; // Ancho mínimo de la plataforma
        const maxPlatformWidth = 500; // Ancho máximo de la plataforma
        const minPlatformHeight = 20; // Altura mínima de la plataforma
        const maxPlatformHeight = 300; // Altura máxima de la plataforma
        const minPlatformDistance = 400; // Distancia mínima entre plataformas
        const maxPlatformDistance = 600; // Distancia máxima entre plataformas
        const minPlatformY = 300; // Altura mínima de la plataforma
        const maxPlatformY = this.scale.height - 200; // Altura máxima de la plataforma

        let previousPlatformX = 0;

        // Generar plataformas iniciales
        for (let i = 0; i < this.platformBuffer; i++) {
            const platformWidth = Phaser.Math.Between(minPlatformWidth, maxPlatformWidth);
            const platformHeight = Phaser.Math.Between(minPlatformHeight, maxPlatformHeight);
            const platformDistance = Phaser.Math.Between(minPlatformDistance, maxPlatformDistance);
            const platformY = Phaser.Math.Between(minPlatformY, maxPlatformY);

            const platformX = previousPlatformX + platformDistance;

            const platform = this.add.rectangle(platformX, platformY, platformWidth, platformHeight, 0x000000);
            platform.setOrigin(0.5, 0.5);
            this.physics.add.existing(platform, true);

            // Agregar colisión entre el jugador y la plataforma
            this.physics.add.collider(this.player, platform);

            this.platforms.add(platform);

            previousPlatformX = platformX;
        }
    }

	createFloor() {

		// Crea un suelo
		if (this.add) {
			const floor = this.add.rectangle(0, this.scale.height-15, this.scale.width, 150, 0x000000);
			floor.setOrigin(0,0.5);
			this.physics.add.existing(floor, true);
			 // Agregar colisión entre el jugador y el suelo
			 this.physics.add.collider(this.player, floor);
			 this.cameras.main.startFollow(this.player, true, 0.8, 1,0,0);
		}

	}

	update(time: number, delta: number): void {
		//console.log(this.input.x);
	 //	this.player.updatePlayer(delta);
        this.updatePlatforms();
    }

	updatePlatforms() {
        const minPlatformWidth = 200; // Ancho mínimo de la plataforma
        const maxPlatformWidth = 1500; // Ancho máximo de la plataforma
        const minPlatformHeight = 20; // Altura mínima de la plataforma
        const maxPlatformHeight = 300; // Altura máxima de la plataforma
        const minPlatformDistance = 400; // Distancia mínima entre plataformas
        const maxPlatformDistance = 600; // Distancia máxima entre plataformas
        const minPlatformY = 300; // Altura mínima de la plataforma
        const maxPlatformY = this.scale.height - 200; // Altura máxima de la plataforma

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
                this.physics.add.collider(this.player, platform);

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
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
