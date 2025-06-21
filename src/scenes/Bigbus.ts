// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Bigbus extends SpineGameObject {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "BIGBUS", atlasKey ?? "BIGBUS-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.skeleton.setSkinByName(skin ?? "default");

		/* START-USER-CTR-CODE */
		
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this.scene.events.on("update", this.update, this);
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

		create() {
			const randomScale = Phaser.Math.FloatBetween(2, 3);
			this.setScale(randomScale);

			this.scene.physics.add.existing(this);
			const busBody = this.body as Phaser.Physics.Arcade.Body;
			busBody.setGravityY(0);
			busBody.setAllowGravity(false);
			busBody.setImmovable(true);
			this.animationState.setAnimation(0, "idle", true);
			busBody.setVelocityX(-Phaser.Math.Between(100, 2000));

			// Body más pequeño y ubicado en la parte superior de la imagen
			const newWidth = this.width * 0.6;
			const newHeight = this.height * 0.15; // Más bajo (35% de la altura)
			busBody.setSize(newWidth, newHeight);
			busBody.setOffset((this.width - newWidth) / 2, 0); // Offset Y en 0 para que quede arriba

			// Siempre detrás del player
			const player = (this.scene as Phaser.Scene & { player: Phaser.GameObjects.Sprite }).player;
			if (player) {
				this.setDepth(player.depth - 1);
				this.scene.physics.add.collider(this, player, this.handlePlayerCollisionStand as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
			}
		}


	handlePlayerCollisionStand(bigbus: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {
		// TODO: Implement collision logic here
	}

	update() {
        const player = (this.scene as Phaser.Scene & { player: Phaser.GameObjects.Sprite }).player;
        if (player && this.active) {
            // Si el Bigbus está a más de 20000px a la izquierda del player, reaparece a la derecha
            if (this.x < player.x - 20000) {
                this.x = player.x + 20000;
                // Recalcula la posición Y: random entre player.y - 2000 y player.y
                this.y = player.y - Phaser.Math.Between(player.y, 2000);

                // Opcional: randomiza escala y velocidad al reaparecer
                const randomScale = Phaser.Math.FloatBetween(1.5, 2);
                this.setScale(randomScale);

                const busBody = this.body as Phaser.Physics.Arcade.Body;
                const newWidth = this.width * 0.6;
                const newHeight = this.height * 0.9;
             

                busBody.setVelocityX(-Phaser.Math.Between(1000, 3000));
            }
        }
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
