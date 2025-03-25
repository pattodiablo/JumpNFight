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

	/* START-USER-CODE */

	create() {
		// Add physics to the LaserShot sprite
		this.scene.physics.world.enable(this);
		(this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

		this.on('animationrepeat', this.fireLaser, this);
		this.on('animationrepeat', this.fireMissile, this);
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
			this.scene.physics.add.overlap(missile, (this.scene as any).player, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

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
