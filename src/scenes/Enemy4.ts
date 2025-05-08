
// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import Enemy1V1 from "./Enemy1V1";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Enemy4 extends Enemy1V1 {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "Enemy4", atlasKey ?? "Enemy4-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");
		this.scaleX = 2;
		this.scaleY = 2;

		/* START-USER-CTR-CODE */
		
		this.EnemyLife = 12;
		this.canFlip = false;
		this.canPlayerStand = true;

		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
