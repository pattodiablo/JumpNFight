// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import Enemy1V1 from "./Enemy1V1";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Enemy10 extends Enemy1V1 {
	height: any;

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "Enemy10", atlasKey ?? "Enemy10-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");
		this.scaleX = 2;
		this.scaleY = 2;

		/* START-USER-CTR-CODE */
	this.EnemyLife = 6;
	this.EnemyDamage = 3;
	

		this.scene.time.addEvent({
			delay: 3000, // Tiempo en milisegundos (2 segundos)
			callback: this.shotMegaLaser,
			callbackScope: this,
			loop: true // Repetir indefinidamente
		
		});
		/* END-USER-CTR-CODE */
	}

	shotMegaLaser() {
        // Cambia la animación a "Shoot" y vuelve a "Idle" al terminar
        this.animationState.setAnimation(0, "Shoot", false);
        this.animationState.addListener({
            complete: (entry: any) => {
                if (entry.animation && entry.animation.name === "Shoot") {
                    this.animationState.setAnimation(0, "Idle", true);
					this.deployLaser(); // Llama a la función para disparar el láser
                }
            }
        });

       
    }

	deployLaser() {
		 // Instanciar el láser en la parte inferior del enemigo
        const laserX = this.x;
        const laserY = this.y + (this.height ? this.height / 2 : 60); // Ajusta el offset si es necesario

        const laser = this.scene.add.sprite(laserX, laserY, "EnemyLaserTexture");
        this.scene.physics.world.enable(laser);
        const laserBody = laser.body as Phaser.Physics.Arcade.Body;
        laserBody.setVelocityY(1800); // Velocidad hacia abajo, ajusta según necesidad
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
        this.scene.time.delayedCall(2000, () => {
            if (laser.active) {
                laser.destroy();
            }
        });
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
