// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class InfoSphere extends SpineGameObject {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "InfoSphere", atlasKey ?? "InfoSphere-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");
		this.scaleX = 3.6406729013562154;
		this.scaleY = 3.6406729013562154;

		/* START-USER-CTR-CODE */
				this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	create() {
		this.animationState.setAnimation(0, "idle", true);

		// Habilita físicas para InfoSphere si no lo has hecho ya
		this.scene.physics.add.existing(this, false);
		(this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

		// Detecta overlap con el player
		const player = (this.scene as any).player;
		if (player) {
			let isOverlapping = false;

			this.scene.events.on('update', () => {
				if (!player.body || !this.body) return;

				// --- Destruir InfoSphere si está a más de 6000px del jugador ---
				const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
				if (distance > 6000) {
					this.destroy();
					return;
				}

				// --- Overlap UI logic ---
				const thisBody = this.body as Phaser.Physics.Arcade.Body;
				const playerBody = player.body as Phaser.Physics.Arcade.Body;
				const thisRect = new Phaser.Geom.Rectangle(thisBody.x, thisBody.y, thisBody.width, thisBody.height);
				const playerRect = new Phaser.Geom.Rectangle(playerBody.x, playerBody.y, playerBody.width, playerBody.height);
				const overlapping = Phaser.Geom.Intersects.RectangleToRectangle(thisRect, playerRect);
				const gameUIScene = this.scene.scene.get('GameUI') as Phaser.Scene & { helpPc?: Phaser.GameObjects.Image };

				if (overlapping) {
					if (!isOverlapping && gameUIScene && gameUIScene.helpPc) {
						// Detectar si es móvil y cambiar la textura si corresponde
						const isMobile = this.scene.sys.game.device.os.android || this.scene.sys.game.device.os.iOS;
						if (isMobile) {
							gameUIScene.helpPc.setTexture("HelpMovile");
						} else {
							gameUIScene.helpPc.setTexture("helpPc");
						}
						gameUIScene.helpPc.setVisible(true);
					}
					isOverlapping = true;
				} else {
					if (isOverlapping && gameUIScene && gameUIScene.helpPc) {
						gameUIScene.helpPc.setVisible(false);
					}
					isOverlapping = false;
				}
			});
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
