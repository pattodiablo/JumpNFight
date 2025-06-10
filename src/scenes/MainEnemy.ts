// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import Enemy1V1 from "./Enemy1V1";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class MainEnemy extends Enemy1V1 {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "MainEnemy", atlasKey ?? "MainEnemy-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");
		this.scaleX = 1.6;
		this.scaleY = 1.6;

		/* START-USER-CTR-CODE */
		this.EnemyLife = 300;
		this.EnemyDamage = 10;
		this.canFlip = false
		this.canPlayerStand = true;
		this.IsMegaLaser = true;
		this.canShoot = true;
	
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	preUpdate(time: number, delta: number) {
	    super.preUpdate?.(time, delta);

	    const player = (this.scene as any).player;
	    if (!player) return;

	    const skeleton = this.skeleton;
	    const weapon1 = skeleton.findBone("weapon1");
	    const weapon2 = skeleton.findBone("weapon2");

	    if (weapon1 && weapon2) {
	        // Posición global del enemigo (SpineGameObject)
	        const enemyX = this.x;
	        const enemyY = this.y;

	        // Posición global del jugador
	        const playerX = player.x;
	        const playerY = player.y;

	        // Calcula el ángulo entre el bone (en el mundo) y el jugador
	        // El bone.worldX/worldY ya están en coordenadas globales relativas al esqueleto
	        const angleWeapon1 = Phaser.Math.Angle.Between(
	            enemyX + weapon1.worldX * this.scaleX,
	            enemyY + weapon1.worldY * this.scaleY,
	            playerX,
	            playerY
	        );
	        const angleWeapon2 = Phaser.Math.Angle.Between(
	            enemyX + weapon2.worldX * this.scaleX,
	            enemyY + weapon2.worldY * this.scaleY,
	            playerX,
	            playerY
	        );

			// Ajusta la rotación local del bone para que apunte al jugador
			// Restamos el rotation del parent para que solo rote sobre su eje local
			if (weapon1.parent && weapon2.parent) {
				weapon1.rotation = Phaser.Math.RadToDeg(angleWeapon1);
				weapon2.rotation = Phaser.Math.RadToDeg(angleWeapon2);
			}
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
