
// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
import CollectableParticle from "./CollectableParticle";
declare global {
	namespace Phaser {
		interface Scene {
			enemies: Phaser.GameObjects.Group;
		}
	}
}


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
	public EnemyVelo: number = 300;
	public laserDuration: number = 6000;
	public laserSpeed: number = 3000;
	public laserColor: string = "#ff0000";
	public lastShotTime: number = 400;
	public shotInterval: number = 2500;
	public shootingRadius: number = 2000;
	public IsNearPlayer: boolean = false;
	public EnemyLife: number = 3;
	public IsDestroyed: boolean = false;
	public EnemyDamage: number = 10;

	/* START-USER-CODE */
	create(){

		this.scene.enemies.add(this);
		this.scene.physics.add.existing(this);
		const enemyBody = this.body as Phaser.Physics.Arcade.Body;
		enemyBody.setGravityY(this.enemyGravity); // Configura la gravedad para el jugador\
		enemyBody.setAllowGravity(false); // Desactiva la gravedad para el enemigo
		enemyBody.setImmovable(true); // Hacer que el enemigo sea inmovible
		this.animationState.setAnimation(0, "Idle", true);

		    // Generar un factor aleatorio entre 0.5 y 1.5
			const randomFactor = Phaser.Math.FloatBetween(0.5, 6);
			// Multiplicar la velocidad original del enemigo por el factor aleatorio
			this.EnemyVelo *= randomFactor;


		enemyBody.setVelocityX(-this.EnemyVelo);
		this.setDepth(1); 

		const player = (this.scene as Phaser.Scene & { player: Phaser.GameObjects.Sprite }).player;
		this.scene.physics.add.collider(this, player, this.handlePlayerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

	}

	handlePlayerCollision(enemy: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {


	}

	updateEnemy(delta: number) {

		if (this.IsDestroyed) {
			return;
		}else{
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
					this.IsNearPlayer=true
					// Disparar el láser a intervalos regulares
					if (this.scene.time.now > this.lastShotTime + this.shotInterval) {
						this.createLaserParticles();
						this.scene.time.delayedCall(500, () => {
							this.shootLaser(player);
						});
						this.lastShotTime = this.scene.time.now;
					}
				}else{
					this.IsNearPlayer=false;
				}

			// Verificar si el enemigo está a 3000 píxeles a la izquierda de la cámara
			if (this.x < this.scene.cameras.main.worldView.x - 13000) {
				// Reaparecer a 3000 píxeles a la derecha de la cámara
				this.x = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width + 13000;
			}

			if (this.EnemyLife <= 0 && !this.IsDestroyed) {
			this.handleDestroy();
			}

		}

	}

	handleDestroy() {
		this.IsDestroyed = true;
		this.generateParticles();
		const destroyParticles =  this.scene.add.particles(0, 0, 'particleImage', {
			x: this.x,
			y: this.y,
			speed: { min: -3000, max: 3000 },
			angle: { min: 0, max: 360 },
			lifespan: { min: 30, max: 500 },
			scale: { start: 5, end: 0 },
			quantity: 30,

			maxParticles: 50,
			frequency: 1,

		});

		destroyParticles.setDepth(1); 
		this.scene.time.delayedCall(1500, () => {
			destroyParticles.stop();
			destroyParticles.destroy();
			 // Eliminar el enemigo del grupo de enemigos
			 // Destruir el enemigo
			 this.destroy();

		}, [], this);
		this.setVisible(false);
		const enemyBody = this.body as Phaser.Physics.Arcade.Body;
		(this.scene as any).enemies.remove(this);
		enemyBody.setEnable(false);
		//this.destroy();
	}

	generateParticles() {
        const numParticles = Phaser.Math.Between(3, 20); // Número aleatorio de partículas entre 1 y 3
        for (let i = 0; i < numParticles; i++) {
            const x = this.x + Phaser.Math.Between(-130, 130); // Posición aleatoria cerca del enemigo
            const y = this.y + Phaser.Math.Between(-130, 130); // Posición aleatoria cerca del enemigo
            const particle = new CollectableParticle(this.scene, x, y);
			
            this.scene.add.existing(particle);
        }
    }

	createLaserParticles() {

		const appearParicles =  this.scene.add.particles(0, 0, 'particleImage', {
			x: this.x,
			y: this.y,
			speed: { min: -30, max: 30 },
			angle: { min: 0, max: 360 },
			lifespan: { min: 30, max: 500 },
			scale: { start: 3, end: 0 },
			quantity: 2,
			maxParticles: 10,
			frequency: 10,

		});

		appearParicles.setDepth(1);
			// Detener el sistema de partículas después de un tiempo y luego destruirlo
			this.scene.time.delayedCall(500, function() {
				appearParicles.stop();
				appearParicles.destroy();
			}, [], this);
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

		  // Agregar colisión entre el láser y el jugador
		  this.scene.physics.add.overlap(laser, player, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

	}
	handleLaserCollision(laser: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {
		// Manejar la colisión entre el láser y el jugador

    // Agregar un efecto de "camera shake"
	const gameUI = this.scene.scene.get('GameUI') as any;
	const EnergyLevel = gameUI.level;
	//gameUI.updateLevelBar(-this.EnemyDamage*EnergyLevel);
		// Reducir la vida del jugador

		( player as any).handleDamage(this.EnemyDamage);

		const bloodParticles =  this.scene.add.particles(0, 0, 'particleImage', {
			x: (laser as Phaser.GameObjects.Ellipse).x,
			y: (laser as Phaser.GameObjects.Ellipse).y,
			speed: { min: -1000, max: 1000 },
			angle: { min: 0, max: 360 },
			lifespan: { min: 30, max: 500 },
			scale: { start: 2, end: 0 },
			quantity: 5,
			maxParticles: 5,
			frequency: 100,
			gravityY: 3000

		});

		bloodParticles.setDepth(1);
			// Detener el sistema de partículas después de un tiempo y luego destruirlo
			this.scene.time.delayedCall(500, function() {
				bloodParticles.stop();
				bloodParticles.destroy();
			}, [], this);
			laser.destroy(); // Destruir el láser al colisionar con el jugador
		// Aquí puedes agregar lógica adicional, como reducir la salud del jugador
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
