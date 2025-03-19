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

		this.on('animationcomplete-LaserShot', this.fireLaser, this);
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	create() {
		// Add physics to the LaserShot sprite
		this.scene.physics.world.enable(this);
		(this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

		this.on('animationrepeat', this.fireLaser, this);
	}	

	update(delta: number): void {
		if(this.active){
			const player = (this.scene as any).player; // Assuming the player is stored in the scene
			if (player) {
				// Use lerp to smoothly move the LaserShot towards the player's position
				this.x = Phaser.Math.Linear(this.x, player.x, 0.1);
				this.y = Phaser.Math.Linear(this.y, player.y - player.height / 2 - 10, 0.1); // Adjust the offset as needed
			}
		}
	}

	fireLaser() {
		console.log("Firing laser");
		const laser = this.scene.add.sprite(this.x, this.y, 'laserTexture');
		this.scene.physics.world.enable(laser);
		(laser.body as Phaser.Physics.Arcade.Body).setVelocityX(3500); // Set the velocity of the laser
		(laser.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

		// Add collision logic with enemies
		this.scene.physics.add.overlap(laser, this.scene.enemies, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

		// Set a timer to destroy the laser after 2 seconds
		this.scene.time.delayedCall(2000, () => {
			if (laser.active) {
				laser.destroy();
			}
		});
	}

	handleLaserCollision(laser: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
		console.log("Laser collided with enemy");

		(enemy as any).EnemyLife -= 1;

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
