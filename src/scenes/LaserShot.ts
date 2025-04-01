// You can write more code here

import Enemy1 from "./Enemy1";

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class LaserShot extends Phaser.GameObjects.Sprite {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "Deacon_1", frame ?? "WeaponBeacon0000");

		this.scaleX = 2;
		this.scaleY = 2;
		this.play("Deacon");

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this.scene.events.on("update", (time: number, delta: number) => this.update(delta));

		/* END-USER-CTR-CODE */
	}

	public MissileVelocity: number = 2000;
	public detectionRadius: number = 1200;
	public MissileDamage: number = 10;
	public LaserDamage: number = 1;
	public swordWeaponDamage: number = 20;

	/* START-USER-CODE */

	create() {
		// Add physics to the LaserShot sprite
		this.scene.physics.world.enable(this);
		(this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

		this.on('animationrepeat', this.fireLaser, this);
		this.on('animationrepeat', this.fireMissile, this);
		
		this.scene.time.addEvent({
			delay: 2000, // Tiempo en milisegundos (2 segundos)
			callback: this.fireSwords,
			callbackScope: this,
			loop: true // Repetir indefinidamente
		});

		this.scene.time.addEvent({
			delay: 30, // Tiempo en milisegundos (2 segundos)
			callback: this.rayCreator,
			callbackScope: this,
			loop: true // Repetir indefinidamente
		});
		
	}	

	update(delta: number): void {
		if(this.active){
			const player = (this.scene as any).player; // Assuming the player is stored in the scene
			if (player) {
				// Use lerp to smoothly move the LaserShot towards the player's position
				this.x = Phaser.Math.Linear(this.x, player.x, 0.1);
				this.y = Phaser.Math.Linear(this.y, player.y - player.height / 2 - 10, 0.1); // Adjust the offset as needed

				// Check if any enemy is near the player
				const enemies = (this.scene as any).enemies.getChildren(); // Get the list of enemies
				enemies.forEach((enemy: Phaser.GameObjects.GameObject) => {
					const distance = Phaser.Math.Distance.Between(this.x, this.y, (enemy as Phaser.GameObjects.Sprite).x, (enemy as Phaser.GameObjects.Sprite).y);
					if (distance <= this.detectionRadius && (enemy as any).IsNearPlayer) {
						// Calculate the angle between the LaserShot and the player
						const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
						// Set the rotation of the LaserShot
						this.setRotation(angle);
					}
				});
			}
		}
	}

	rayCreator() {
	

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
			rayBody.setVelocityY(8000); // Adjust the speed as needed
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

	handleRayCollision(ray: Phaser.GameObjects.Rectangle, enemy: Phaser.GameObjects.Sprite) {
		console.log("Ray collided with enemy");

		// Reduce the enemy's life or destroy it
		(enemy as any).EnemyLife -= 5; // Adjust damage as needed
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

	lineTracer() {
		console.log("Line Tracer");

		// Crear un gráfico para dibujar la trayectoria del láser
		const laserGraphics = this.scene.add.graphics();
		laserGraphics.lineStyle(20, 0xff0000, 1); // Color rojo para el láser

		// Crear el láser como un objeto físico
		const laser = this.scene.add.rectangle(this.x, this.y, 10, 20, 0xff0000);
		this.scene.physics.world.enable(laser);
		const laserBody = laser.body as Phaser.Physics.Arcade.Body;

		// Configurar la velocidad inicial del láser
		const angle = Phaser.Math.DegToRad(this.angle); // Usar el ángulo actual del objeto
		const velocity = this.scene.physics.velocityFromRotation(angle, 3000); // Velocidad del láser
		laserBody.setVelocity(velocity.x, velocity.y);
		laserBody.setBounce(1); // Hacer que el láser rebote
		laserBody.setCollideWorldBounds(true); // Hacer que el láser colisione con los bordes del mundo
		laserBody.setAllowGravity(false); // Desactivar la gravedad

		// Almacenar las posiciones del láser
		const trajectory: Phaser.Math.Vector2[] = [];
		trajectory.push(new Phaser.Math.Vector2(this.x, this.y)); // Posición inicial

		// Dibujar la trayectoria del láser en cada actualización
		this.scene.events.on('update', () => {
			if (laser.active) {
				trajectory.push(new Phaser.Math.Vector2(laser.x, laser.y)); // Registrar la posición actual

				// Dibujar la trayectoria completa
				laserGraphics.clear();
				laserGraphics.lineStyle(20, 0xff0000, 1);
				for (let i = 0; i < trajectory.length - 1; i++) {
					const start = trajectory[i];
					const end = trajectory[i + 1];
					laserGraphics.strokeLineShape(new Phaser.Geom.Line(start.x, start.y, end.x, end.y));
				}
			}
		});

		// Apagar el láser después de un tiempo si no impacta con un enemigo
		this.scene.time.delayedCall(5000, () => {
			if (laser.active) {
				this.fadeOutLaser(laser, laserGraphics);
			}
		});
	}

	// Método para apagar el láser gradualmente
	fadeOutLaser(laser: Phaser.GameObjects.Rectangle, laserGraphics: Phaser.GameObjects.Graphics) {
		console.log("Fading out laser");

		// Reducir opacidad y escala gradualmente
		this.scene.tweens.add({
			targets: laser,
			alpha: 0, // Reducir opacidad a 0
			scaleX: 0, // Reducir escala en X a 0
			scaleY: 0, // Reducir escala en Y a 0
			duration: 1000, // Duración de la animación (1 segundo)
			onUpdate: () => {
				laserGraphics.clear();
				laserGraphics.lineStyle(20, 0xff0000, laser.alpha); // Ajustar la opacidad del gráfico
				laserGraphics.strokeLineShape(new Phaser.Geom.Line(this.x, this.y, laser.x, laser.y));
			},
			onComplete: () => {
				laser.destroy(); // Destruir el láser después de la animación
				laserGraphics.destroy(); // Destruir el gráfico asociado
			}
		});
	}

	fireSwords(){
		const missile = this.scene.add.sprite(this.x, this.y, 'swordWeapon');
		missile.setData('damage', this.swordWeaponDamage);
		this.scene.physics.world.enable(missile);
		const velocityX = Phaser.Math.Between(-2000, 2000);
		const velocityY = Phaser.Math.Between( -1500 , -500);
		(missile.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
		(missile.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
		(missile.body as Phaser.Physics.Arcade.Body).gravity.y = 1000;
		(missile.body as Phaser.Physics.Arcade.Body).setCircle(200);

		this.scene.physics.add.overlap(missile, this.scene.enemies, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);


		this.scene.events.on('update', () => {
			missile.angle += 10;	
		});



		this.scene.time.delayedCall(10000, () => {
			if (missile.active) {
				missile.destroy();
			}
		});

	}

	fireMissile() {
		// Find the nearest enemy within the detection radius
		const enemies = (this.scene as any).enemies.getChildren();
		let nearestEnemy: Phaser.GameObjects.Sprite | null = null;
		let minDistance = this.detectionRadius;

		enemies.forEach((enemy: Phaser.GameObjects.GameObject) => {
			const distance = Phaser.Math.Distance.Between(this.x, this.y, (enemy as Phaser.GameObjects.Sprite).x, (enemy as Phaser.GameObjects.Sprite).y);
			if (distance < minDistance) {
				console.log("Firing missile");
				minDistance = distance;
				nearestEnemy = enemy as Phaser.GameObjects.Sprite;
			}
		});

		if (nearestEnemy) {
			const missile = this.scene.add.sprite(this.x, this.y, 'missile');
			missile.setData('damage', this.MissileDamage);
			this.scene.physics.world.enable(missile);
			(missile as any).target = nearestEnemy; // Store the target enemy

			// Calculate the angle and velocity
			const angle = Phaser.Math.Angle.Between(this.x, this.y, (nearestEnemy as Phaser.GameObjects.Sprite).x, (nearestEnemy as Phaser.GameObjects.Sprite).y);
			const velocity = this.scene.physics.velocityFromRotation(angle, this.MissileVelocity);
			(missile.body as Phaser.Physics.Arcade.Body).setVelocity(velocity.x, velocity.y);
			(missile.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
			missile.angle = Phaser.Math.RadToDeg(angle);

			// Add collision logic with the player
			this.scene.physics.add.overlap(missile, this.scene.enemies, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

			// Continuously adjust the missile's velocity towards the nearest enemy
			this.scene.events.on('update', () => {
				if (missile.active && nearestEnemy && !(nearestEnemy as any).IsDestroyed) {
					const currentTarget = (missile as any).target;
					if (currentTarget !== nearestEnemy) {
						this.destroyMissile(missile);
					} else {
						const newAngle = Phaser.Math.Angle.Between(missile.x, missile.y, (nearestEnemy as Phaser.GameObjects.Sprite).x, (nearestEnemy as Phaser.GameObjects.Sprite).y);
						const newVelocity = this.scene.physics.velocityFromRotation(newAngle, 1000);
						(missile.body as Phaser.Physics.Arcade.Body).setVelocity(newVelocity.x, newVelocity.y);
						missile.angle = Phaser.Math.RadToDeg(newAngle);
					}
				} else if (missile.active && nearestEnemy && (nearestEnemy as any).IsDestroyed) {
					this.destroyMissile(missile);
				}
			});

			this.scene.time.delayedCall(2000, () => {
				if (missile.active) {
					this.destroyMissile(missile);
				}
			});
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
			console.log("Firing laser");
			const laser = this.scene.add.sprite(this.x, this.y, 'laserTexture');
			this.scene.physics.world.enable(laser);
			laser.setData('damage', this.LaserDamage);
			// Calculate the angle and velocity
			const angle = Phaser.Math.Angle.Between(this.x, this.y, (nearestEnemy as Phaser.GameObjects.Sprite).x, (nearestEnemy as Phaser.GameObjects.Sprite).y);
			const velocity = this.scene.physics.velocityFromRotation(angle, 3500);
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

	handleLaserCollision(laser: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
		console.log("Laser collided with enemy");

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

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
