
// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import Enemy1V1 from "./Enemy1V1";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Enemy12 extends Enemy1V1 {
	height: any;
	LaserDeplyTimer: Phaser.Time.TimerEvent;

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "Enemy12", atlasKey ?? "Enemy12-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");
		this.scaleX = 1.6;
		this.scaleY = 1.6;

		/* START-USER-CTR-CODE */
	this.EnemyLife = 6;
	this.EnemyDamage = 3;
	this.canFlip = true;
	

		this.LaserDeplyTimer = this.scene.time.addEvent({
			delay: 1000, // Tiempo en milisegundos (2 segundos)
			callback: this.deployLaser,
			callbackScope: this,
			loop: true // Repetir indefinidamente
		
		});

		this.timers.push(this.LaserDeplyTimer);
		
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */



	deployLaser() {
		 // Instanciar el láser en la parte inferior del enemigo
        const laserX = this.x;
        const laserY = this.y + (this.height ? this.height / 2 : 60); // Ajusta el offset si es necesario

        const laser = this.scene.add.sprite(laserX, laserY, "EnemyLaserTexture3");
        this.scene.physics.world.enable(laser);
        const laserBody = laser.body as Phaser.Physics.Arcade.Body;
		const direction = Math.sign(-this.skeleton.scaleX) || 1;
		laser.flipX = this.skeleton.scaleX < 0; // Voltea el láser según la dirección del enemigo
        laserBody.setVelocityX(3000*direction); // Velocidad hacia abajo, ajusta según necesidad
        laserBody.setAllowGravity(false);

        // Colisión con el jugador
        const player = (this.scene as any).player;
        if (player) {
            this.scene.physics.add.overlap(laser, player, () => {
             player.handleDamage(this.EnemyDamage); // Llama a la función de daño del jugador
                laser.destroy();
            });
        }

        // Destruir el láser después de 2 segundos si no colisiona
        this.scene.time.delayedCall(5000, () => {
            if (laser.active) {
                laser.destroy();
            }
        });
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
