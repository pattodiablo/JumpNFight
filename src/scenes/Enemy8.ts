
// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import Enemy1V1 from "./Enemy1V1";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Enemy8 extends Enemy1V1 {

	private hasDived = false;
	private diveTime = 0;
	private originalY = this.y;
	private isDiving = false
	private diveCooldown = 3000; // en milisegundos
	private diveCooldownTimer = 0;

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "Enemy8", atlasKey ?? "Enemy8-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");
		this.scaleX = 2;
		this.scaleY = 2;

		/* START-USER-CTR-CODE */
		this.canHitPlayer = true;
		this.scene.events.on("update", (time: number, delta: number) => this.update(delta));

		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	update(delta: number) {
		const speed = 0.005; // velocidad del seno
		const amplitude = 250; // qué tan abajo se mueve
	
		if (this.IsNearPlayer && !this.hasDived) {
			this.isDiving = true;
			this.diveTime = 0;
			this.hasDived = true;
			this.diveCooldownTimer = 0; // reinicia el contador de cooldown
		}
	
		if (this.isDiving) {
			this.diveTime += delta;
	
			// Movimiento senoide hacia abajo (solo ida)
			const progress = Math.min(this.diveTime * speed, Math.PI); // limita el seno hasta PI
			this.y = this.originalY + Math.sin(progress) * amplitude;
	
			if (progress >= Math.PI) {
				this.isDiving = false;
				this.y = this.originalY; // regresar exactamente a su posición original
			}
		}

		// Manejar el cooldown para permitir otra zambullida
	if (this.hasDived && !this.isDiving) {
		this.diveCooldownTimer += delta;
		if (this.diveCooldownTimer >= this.diveCooldown) {
			this.hasDived = false;
		}
	}

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
