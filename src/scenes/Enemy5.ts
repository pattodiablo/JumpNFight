
// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import Enemy1V1 from "./Enemy1V1";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Enemy5 extends Enemy1V1 {
	baseY: number;
	waveAmplitude: number;
	waveSpeed: number;
	elapsedTime: number;

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "Enemy5", atlasKey ?? "Enemy5-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");
		this.scaleX = 1.8;
		this.scaleY = 1.8;

		/* START-USER-CTR-CODE */
		this.baseY = y; // Guarda la posición base
		this.waveAmplitude = 120; // Altura de la onda
		this.waveSpeed = 0.005; // Velocidad de oscilación
		this.elapsedTime = 0;
		this.scene.events.on("update", (time: number, delta: number) => this.update(delta));
		/* END-USER-CTR-CODE */
	}

	

	/* START-USER-CODE */

	update(delta: number) {
		this.elapsedTime += delta;
		this.y = this.baseY + Math.sin(this.elapsedTime * this.waveSpeed) * this.waveAmplitude;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
