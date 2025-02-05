
// You can write more code here

/* START OF COMPILED CODE */

import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SpineGameObject } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// idle
		const idle = this.add.spine(651, 379, "Idle", "Idle-atlas", new SkinsAndAnimationBoundsProvider("animation", ["default"]));
		idle.skeleton.setSkinByName("default");
		idle.animationStateData.defaultMix = 1;
		idle.scaleX = 0.313331752455583;
		idle.scaleY = 0.313331752455583;

		this.idle = idle;

		this.events.emit("scene-awake");
	}

	public idle!: SpineGameObject;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
		this.idle.animationState.setAnimation(0, "animation", true);

	}

	update(time: number, delta: number): void {

	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
