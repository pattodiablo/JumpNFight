
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class SawBullet extends Phaser.GameObjects.Image {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "sawBullet", frame);

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this.scene.events.on("update", (time: number, delta: number) => this.update(delta));

		/* END-USER-CTR-CODE */
	}

	public BulletGravity: number = 100;
	public BulletVelocity: number = 2000;
	public LifeTime: number = 3000;

	/* START-USER-CODE */

	create(){

		this.scene.physics.add.existing(this);
		const bulletBody = this.body as Phaser.Physics.Arcade.Body;
		bulletBody.setVelocityX(this.BulletVelocity);
		bulletBody.setVelocityY(this.BulletVelocity);
		bulletBody.setGravityY(this.BulletGravity); // Configura la gravedad para el jugador\
		bulletBody.setImmovable(true); // Hacer que el enemigo sea inmovible
		bulletBody.setAllowGravity(false); // Desactiva la gravedad para el enemigo
		bulletBody.setBounce(1); // Hacer que el sawBullet rebote completamente
        bulletBody.setCollideWorldBounds(true); // Habilitar colisiones con los bordes del mundo
		//bulletBody.setGravityY(this.BulletGravity);

		  // Configurar el tiempo de vida del sawBullet
		  this.scene.time.addEvent({
            delay: this.LifeTime,
            callback: () => {
                this.destroy();
            }
        });

		
			// Colisión
			const enemies = (this.scene as any).enemies.getChildren(); // Obtener la lista de enemigos
			this.scene.physics.add.overlap(this, enemies, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);


	}

	handleLaserCollision(laser: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {


		(enemy as any).EnemyLife -= 1;


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

	update(delta: number):void {


	}


    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
