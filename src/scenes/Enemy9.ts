
// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import Enemy1V1 from "./Enemy1V1";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Enemy9 extends Enemy1V1 {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "Enemy9", atlasKey ?? "Enemy9-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");
		this.scaleX = 1.6;
		this.scaleY = 1.6;

		/* START-USER-CTR-CODE */
		this.canShoot = true;
		this.shotInterval = 1000;
		this.shootingRadius*= 2;
		this.laserSpeed*=1.5;
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
