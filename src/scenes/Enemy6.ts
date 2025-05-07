
// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import Enemy1V1 from "./Enemy1V1";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Enemy6 extends Enemy1V1 {
	elapsedTime: number;
	rotationSpeed: number;
	baseX: number;
	radius: number;
	baseY: number;
	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "Enemy6", atlasKey ?? "Enemy6-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");
		this.scaleX = 1.5;
		this.scaleY = 1.5;

		/* START-USER-CTR-CODE */
		this.elapsedTime = 0;
		this.canShoot = true;
		this.rotationSpeed = 0.005; // Velocidad angular (radianes/ms)
		this.baseX = x;
		this.baseY = y;
		this.radius = 40; // Radio del círculo
		this.angle = 0; // Ángulo inicial
		this.scene.events.on("update", (time: number, delta: number) => this.update(delta));
		
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	update(delta: number) {
		this.elapsedTime += delta;
	

		
		this.y = this.baseY + Math.sin(this.angle) * this.radius;
	}


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
