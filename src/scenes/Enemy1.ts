
// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Enemy1 extends SpineGameObject {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, boundsProvider?: SpineGameObjectBoundsProvider) {
		super(scene, plugin, x ?? 0, y ?? 0, "EnemyV1", "EnemyV1-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.blendMode = Phaser.BlendModes.SKIP_CHECK;
		this.skeleton.setSkinByName("default");

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this.scene.events.on("update", (time: number, delta: number) => this.updateEnemy(delta));

		/* END-USER-CTR-CODE */
	}

	public enemyGravity: number = 0;
	public EnemyVelo: number = 100;
	public laserDuration: number = 6000;
	public laserSpeed: number = 3000;
	public laserColor: string = "#ff0000";
	public lastShotTime: number = 400;
	public shotInterval: number = 2000;
	public shootingRadius: number = 1200;

	/* START-USER-CODE */
	create(){
		console.log("Enemy1 created");
		this.scene.physics.add.existing(this);
		const enemyBody = this.body as Phaser.Physics.Arcade.Body;
		enemyBody.setGravityY(this.enemyGravity); // Configura la gravedad para el jugador\
		enemyBody.setAllowGravity(false); // Desactiva la gravedad para el enemigo
		this.animationState.setAnimation(0, "Idle", true);

		    // Generar un factor aleatorio entre 0.5 y 1.5
			const randomFactor = Phaser.Math.FloatBetween(0.5, 3);
			// Multiplicar la velocidad original del enemigo por el factor aleatorio
			this.EnemyVelo *= randomFactor;


		enemyBody.setVelocityX(-this.EnemyVelo);
		this.setDepth(1); 

	}

	updateEnemy(delta: number) {
		const player = (this.scene as Phaser.Scene & { player: Phaser.GameObjects.Sprite }).player; // Asumiendo que el jugador está disponible en la escena como this.scene.player

		if (player.x < this.x) {
			// El jugador está a la izquierda del enemigo
			this.skeleton.scaleX = 1; // Flip horizontal hacia la izquierda
		} else {
			// El jugador está a la derecha del enemigo
			this.skeleton.scaleX = -1; // Flip horizontal hacia la derecha
		}

		const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (distanceToPlayer <= this.shootingRadius) {
            // Disparar el láser a intervalos regulares
            if (this.scene.time.now > this.lastShotTime + this.shotInterval) {
                this.scene.time.delayedCall(1000, () => {
					this.shootLaser(player);
				});
                this.lastShotTime = this.scene.time.now;
            }
        }

	 // Verificar si el enemigo está a 3000 píxeles a la izquierda de la cámara
	 if (this.x < this.scene.cameras.main.worldView.x - 3000) {
        // Reaparecer a 3000 píxeles a la derecha de la cámara
        this.x = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width + 3000;
    }

	}

	createLaserParticles() {
		const particles = this.scene.add.particles(this.x,this.y,'particleImage',{
			x: this.x,
			y: this.y,
			speed: { min: -100, max: 100 },
			angle: { min: 0, max: 360 },
			scale: { start: 0.5, end: 0 },
			lifespan: 500,
			blendMode: 'ADD'
		}); // Asegúrate de tener una imagen de partícula cargada con la clave 'particleImage'
		const emitter = particles.createEmitter();
	
		// Detener el emisor después de un segundo
		this.scene.time.delayedCall(1000, () => {
			
			particles.destroy();
		});
	}

	shootLaser(player: Phaser.GameObjects.Sprite) {
		const laserColorNumber = Phaser.Display.Color.HexStringToColor(this.laserColor).color;
		const laser = this.scene.add.ellipse(this.x, this.y, 100, 20, laserColorNumber) as Phaser.GameObjects.Ellipse & { lifespan?: number };
		this.scene.physics.add.existing(laser);
		const laserBody = laser.body as Phaser.Physics.Arcade.Body;
		laserBody.setAllowGravity(false);

		// Calcular la dirección del láser hacia el jugador
		const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
		const velocityX = Math.cos(angle) * this.laserSpeed;
		const velocityY = Math.sin(angle) * this.laserSpeed;
		laserBody.setVelocity(velocityX, velocityY);
		laser.rotation = angle;
		// Establecer la duración del láser
		laser.lifespan = this.laserDuration;
		this.scene.time.addEvent({
			delay: this.laserDuration,
			callback: () => {
				laser.destroy();
			}
		});
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
