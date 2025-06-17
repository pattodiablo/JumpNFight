// You can write more code here

import Enemy1 from "./Enemy1V1";

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class LaserShot extends Phaser.GameObjects.Sprite {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "CompanionBot_1", frame ?? "WeaponBeacon0000");

		this.scaleX = 2;
		this.scaleY = 2;
		this.play("CompanionBot_1");

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);

		// Guarda la referencia para poder quitar el listener después
		this.updateListener = (time: number, delta: number) => this.update(delta);
		this.scene.events.on("update", this.updateListener);

		/* END-USER-CTR-CODE */
	}

	public detectionRadius: number = 2000;

	public MissileNumber: number = 1;
	public MissileVelocity: number = 3000;
	public MissileSize: number = 1;
	public MissileDamage: number = 10;
	public MissileInterval: number = 1000;
	
	public LaserShotsNumber: number = 1;
	public LaserVelocity: number = 4500;
	public LaserShotsInterval: number = 750;
	public LaserDamage: number = 1;

	
	public SwordNumber: number = 1;
	public SwordVelocity: number = 2000;
	public swordWeaponDamage: number = 20;
	public SwordInterval: number = 3000;

	public rainNumber: number = 1;
	public rainInterval: number = 1000;
	public rainDamage: number = 5;
	public RainVelocity: number = 8000;

	private updateListener?: Function;
    private laserEvent?: Phaser.Time.TimerEvent;
    private missileEvent?: Phaser.Time.TimerEvent;
    private swordEvent?: Phaser.Time.TimerEvent;
    private rainEvent?: Phaser.Time.TimerEvent;

    private swordsGroup!: Phaser.Physics.Arcade.Group;
    private missilesGroup!: Phaser.Physics.Arcade.Group;




	/* START-USER-CODE */

	create() {
		// Add physics to the LaserShot sprite
		this.scene.physics.world.enable(this);
		(this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

		// Crea los grupos para proyectiles/minas
		this.swordsGroup = this.scene.physics.add.group();
		this.missilesGroup = this.scene.physics.add.group();

		this.laserEvent = this.scene.time.addEvent({
			delay: this.LaserShotsInterval, // Tiempo en milisegundos (2 segundos)
			callback: this.fireLaser,
			callbackScope: this,
			loop: true // Repetir indefinidamente
		});

		this.missileEvent = this.scene.time.addEvent({
			delay: this.MissileInterval, // Tiempo en milisegundos (2 segundos)
			callback: this.fireMissile,
			callbackScope: this,
			loop: true // Repetir indefinidamente
		});


		this.swordEvent = this.scene.time.addEvent({
			delay: this.SwordInterval, // Tiempo en milisegundos (2 segundos)
			callback: this.fireSwords,
			callbackScope: this,
			loop: true // Repetir indefinidamente
		});

		this.rainEvent = this.scene.time.addEvent({
			delay: this.rainInterval, // Tiempo en milisegundos (2 segundos)
			callback: this.rayCreator,
			callbackScope: this,
			loop: true // Repetir indefinidamente
		});

	}	

	update(delta: number): void {
		if (this.active) {
			// Sigue al player
			const player = (this.scene as any).player;
			if (player) {
				const body = this.body as Phaser.Physics.Arcade.Body;
				// Calcula la posición objetivo (puedes ajustar el offset)
				const targetX = player.x;
				const targetY = player.y - player.height / 2 - 10;

				// Calcula la velocidad necesaria para acercarse suavemente
				const lerp = 0.1; // Ajusta para suavidad
				body.velocity.x = (targetX - this.x) * lerp * 60;
				body.velocity.y = (targetY - this.y) * lerp * 60;
			}

			// Rota todas las minas activas
			this.swordsGroup?.getChildren().forEach((missile) => {
				(missile as Phaser.GameObjects.Sprite).angle += 10;
			});

			// Misiles buscan a su objetivo
			this.missilesGroup?.getChildren().forEach((missile) => {
				const target = (missile as any).target;
				if ((missile as Phaser.GameObjects.Sprite).active && target && !target.IsDestroyed) {
					const newAngle = Phaser.Math.Angle.Between((missile as Phaser.GameObjects.Sprite).x, (missile as Phaser.GameObjects.Sprite).y, target.x, target.y);
					const newVelocity = this.scene.physics.velocityFromRotation(newAngle, 1000);
					((missile as Phaser.GameObjects.Sprite).body as Phaser.Physics.Arcade.Body).setVelocity(newVelocity.x, newVelocity.y);
					(missile as Phaser.GameObjects.Sprite).angle = Phaser.Math.RadToDeg(newAngle);
				} else if ((missile as Phaser.GameObjects.Sprite).active && target && target.IsDestroyed) {
					this.destroyMissile(missile as Phaser.GameObjects.Sprite);
				}
			});
		}
	}

	rayCreator() {

		for (let i = 0; i < this.rainNumber; i++) {
			// Get the camera bounds or player's position
			const camera = this.scene.cameras.main;
			const player = (this.scene as any).player;

			// Create the ray at a random x position relative to the camera or player
			const rayX = Phaser.Math.Between(camera.worldView.x, camera.worldView.x + camera.worldView.width);
			// Alternatively, use the player's x position with some random offset
			// const rayX = Phaser.Math.Between(player.x - 200, player.x + 200);

			const ray = this.scene.add.rectangle(rayX, camera.worldView.y - 50, 20, this.scene.scale.height*4, 0xff0000);
			this.scene.physics.world.enable(ray);
			const rayBody = ray.body as Phaser.Physics.Arcade.Body;
			ray.setOrigin(0.5, 1);
			// Set the ray's velocity to fall down
			rayBody.setVelocityY(this.RainVelocity); // Adjust the speed as needed
			rayBody.setAllowGravity(false);


				// Add a tween to scale the ray from 1 to 0
			this.scene.tweens.add({
				targets: ray,
				scaleX: 0, // Scale X to 0
				scaleY: 0, // Scale Y to 0
				duration: 500, // Duration of the tween (1 second)

			});


			// Add collision with platforms
			const platforms = (this.scene as any).platforms; // Assuming platforms are stored in the scene
			this.scene.physics.add.collider(ray, platforms, () => {
				this.destroyRay(ray);
			});

			// Add collision with enemies
			this.scene.physics.add.overlap(ray, this.scene.enemies, (ray, enemy) => {
				this.handleRayCollision(ray as Phaser.GameObjects.Rectangle, enemy as Phaser.GameObjects.Sprite);
			});

			// Destroy the ray after a short duration if it doesn't collide
			this.scene.time.delayedCall(3000, () => {
				if (ray.active) {
					this.destroyRay(ray);
				}
			});

		}

	}

	handleRayCollision(ray: Phaser.GameObjects.Rectangle, enemy: Phaser.GameObjects.Sprite) {


		// Reduce the enemy's life or destroy it
		(enemy as any).EnemyLife -= this.rainDamage; // Adjust damage as needed
		if ((enemy as any).EnemyLife <= 0) {
			(enemy as any).handleDestroy();
		}

		// Create a particle effect at the collision point
		const impactParticles = this.scene.add.particles(0, 0, 'particleImage', {
			x: ray.x,
			y: ray.y,
			speed: { min: -500, max: 500 },
			angle: { min: 0, max: 360 },
			lifespan: { min: 100, max: 300 },
			scale: { start: 2, end: 0 },
			quantity: 10,
			maxParticles: 20,
		});
		impactParticles.setDepth(1);

		// Stop and destroy the particle effect after a short duration
		this.scene.time.delayedCall(500, () => {
			impactParticles.stop();
			impactParticles.destroy();
		});

		// Destroy the ray
		this.destroyRay(ray);
	}

	destroyRay(ray: Phaser.GameObjects.Rectangle) {


		// Create a fade-out effect for the ray
		this.scene.tweens.add({
			targets: ray,
			alpha: 0,
			duration: 300,
			onComplete: () => {
				ray.destroy();
			}
		});
	}



	fireSwords(){ //minas
		for (let i = 0; i < this.SwordNumber; i++) {
			const missile = this.scene.add.sprite(this.x, this.y, 'swordWeapon');
			missile.setData('damage', this.swordWeaponDamage);
			this.scene.physics.world.enable(missile);
			const velocityX = Phaser.Math.Between(-this.SwordVelocity, this.SwordVelocity);
			const velocityY = Phaser.Math.Between(-this.SwordVelocity, -this.SwordVelocity);
			(missile.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
			(missile.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
			(missile.body as Phaser.Physics.Arcade.Body).gravity.y = 1000;
			(missile.body as Phaser.Physics.Arcade.Body).setCircle(200);

			this.swordsGroup.add(missile);

			this.scene.physics.add.overlap(missile, this.scene.enemies, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);


			this.scene.time.delayedCall(10000, () => {
				if (missile.active) {
					missile.destroy();
				}
			});
		}




	}

	fireMissile() {
		// Find the nearest enemy within the detection radius
		for (let i = 0; i < this.MissileNumber; i++) {
			const enemies = (this.scene as any).enemies.getChildren();
			let nearestEnemy: Phaser.GameObjects.Sprite | null = null;
			let minDistance = this.detectionRadius;

			enemies.forEach((enemy: Phaser.GameObjects.GameObject) => {
				const distance = Phaser.Math.Distance.Between(this.x, this.y, (enemy as Phaser.GameObjects.Sprite).x, (enemy as Phaser.GameObjects.Sprite).y);
				if (distance < minDistance) {
					minDistance = distance;
					nearestEnemy = enemy as Phaser.GameObjects.Sprite;
				}
			});

			if (nearestEnemy) {
				const levelScene = this.scene.scene.get('Level') as Phaser.Scene;
				if (!(levelScene as any).isFxMuted) {
					const jumpSounds = ['MissileShot_01'];
					const randomSound = Phaser.Math.RND.pick(jumpSounds);
					this.scene.sound.play(randomSound);
				}

				const missile = this.scene.add.sprite(this.x, this.y, 'missile');
				missile.setData('damage', this.MissileDamage);
				missile.setScale(this.MissileSize);
				this.scene.physics.world.enable(missile);
				(missile as any).target = nearestEnemy; // Store the target enemy

				this.missilesGroup.add(missile);

				// Calculate the angle and velocity
				const angle = Phaser.Math.Angle.Between(this.x, this.y, (nearestEnemy as any).x, (nearestEnemy as any).y);
				const velocity = this.scene.physics.velocityFromRotation(angle, this.MissileVelocity);
				(missile.body as Phaser.Physics.Arcade.Body).setVelocity(velocity.x, velocity.y);
				(missile.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
				missile.angle = Phaser.Math.RadToDeg(angle);

				// Add collision logic with the enemies
				this.scene.physics.add.overlap(missile, this.scene.enemies, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

				// Set a timer to destroy the missile after 2 seconds
				this.scene.time.delayedCall(2000, () => {
					if (missile.active) {
						this.destroyMissile(missile);
					}
				});
			}
		}


	}

	destroyMissile(missile: Phaser.GameObjects.Sprite) {
		// Set a timer to destroy the missile after 2 seconds

			if (missile.active) {
				const LaunchParticles = this.scene.add.particles(0, 0, 'particleImage', {
					x: missile.x,
					y: missile.y,
					speed: Phaser.Math.Between(10, 800),
					lifespan: { min: 30, max: 1000 },
					scale: { start: 0, end: Phaser.Math.Between(2, 5) }, // Random initial size
					quantity: 5,
					maxParticles: 30,
				});
				missile.destroy();
			}

	}

	fireLaser() {
		// Find the nearest enemy within the detection radius

		for (let i = 0; i < this.LaserShotsNumber; i++) {



			const enemies = (this.scene as any).enemies.getChildren();
			let nearestEnemy: Phaser.GameObjects.Sprite | null = null;
			let minDistance = this.detectionRadius;

			enemies.forEach((enemy: Phaser.GameObjects.GameObject) => {
				const distance = Phaser.Math.Distance.Between(this.x, this.y, (enemy as Phaser.GameObjects.Sprite).x, (enemy as Phaser.GameObjects.Sprite).y);
				if (distance < minDistance) {
					minDistance = distance;
					nearestEnemy = enemy as Phaser.GameObjects.Sprite;
				}
			});

			if (nearestEnemy) {
				const levelScene = this.scene.scene.get('Level') as Phaser.Scene;
				if(!(levelScene as any).isFxMuted){
					const jumpSounds = ['laserShoot1_01', 'laserShoot2_01', 'laserShoot3_01', 'laserShoot4_01'];
				// Select a random sound
				const randomSound = Phaser.Math.RND.pick(jumpSounds);
				// Play the selected sound
				this.scene.sound.play(randomSound);
				}

				const laser = this.scene.add.sprite(this.x, this.y, 'laserTexture');
				laser.postFX.addBloom(0xffffff, 1, 1, 2, 1.2);
				this.scene.physics.world.enable(laser);
				const Level =this.scene.scene.get('Level') as any;;

				const gameUI = this.scene.scene.get('GameUI') as any;
				const EnergyLevel = gameUI.level;
				laser.setData('damage', this.LaserDamage*EnergyLevel);
				// Calculate the angle and velocity
				const angle = Phaser.Math.Angle.Between(this.x, this.y, (nearestEnemy as Phaser.GameObjects.Sprite).x, (nearestEnemy as Phaser.GameObjects.Sprite).y);
				const velocity = this.scene.physics.velocityFromRotation(angle, this.LaserVelocity);
				(laser.body as Phaser.Physics.Arcade.Body).setVelocity(velocity.x, velocity.y);
				(laser.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
				laser.angle = Phaser.Math.RadToDeg(angle);
				// Add collision logic with enemies
				this.scene.physics.add.overlap(laser, this.scene.enemies, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

				// Set a timer to destroy the laser after 2 seconds
				this.scene.time.delayedCall(2000, () => {
					if (laser.active) {
						laser.destroy();
					}
				});
			}
		}

	}

	handleLaserCollision(laser: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {

		(enemy as any).EnemyLife -= laser.getData('damage');

		const bloodParticles = this.scene.add.particles(0, 0, 'particleImage', {
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
		// Stop the particle system after a while and then destroy it
		this.scene.time.delayedCall(500, function() {
			bloodParticles.stop();
			bloodParticles.destroy();
		}, [], this);
		laser.destroy(); // Destroy the laser upon collision with the enemy
	}

	destroy(fromScene?: boolean) {
        // Limpia el listener de update
        if (this.updateListener) {
            this.scene.events.off("update", this.updateListener);
            this.updateListener = undefined;
        }

        // Cancela los eventos periódicos
        this.laserEvent?.remove();
        this.missileEvent?.remove();
        this.swordEvent?.remove();
        this.rainEvent?.remove();

        // Limpia los grupos de proyectiles/minas
     
		if (this.missilesGroup && this.missilesGroup.children) {
			this.missilesGroup.clear(true, true);

		}
        super.destroy(fromScene);
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
