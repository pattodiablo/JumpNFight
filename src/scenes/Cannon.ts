
// You can write more code here

import GameUI from "./GameUI";

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Cannon extends Phaser.GameObjects.Image {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "Cannon", frame);

		this.scaleX = 0.5;
		this.scaleY = 0.5;

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
	
		/* END-USER-CTR-CODE */
	}

	public IsActiveCannon: boolean = true;

	/* START-USER-CODE */

create() {
	this.scene.physics.add.existing(this);
	const cannonBody = this.body as Phaser.Physics.Arcade.Body;
	cannonBody.setCollideWorldBounds(false);
	cannonBody.setAllowGravity(true);
	cannonBody.setSize(this.texture.source[0].width/2, this.texture.source[0].height);
	cannonBody.setOffset(this.texture.source[0].width/4, 0);

	this.setDepth(1000);

	const player = (this.scene as Phaser.Scene & { player: Phaser.GameObjects.Sprite }).player;
	this.scene.physics.add.overlap(this, player, this.handlePlayerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

	const platforms = (this.scene as Phaser.Scene & { platforms: Phaser.GameObjects.Group }).platforms;
	this.scene.physics.add.collider(this, platforms, this.handleFloorColision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);


}
handleFloorColision(cannon: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {

}

handlePlayerCollision(cannon: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {

	if (this.IsActiveCannon){
		const gameUI = this.scene.scene.get('GameUI') as any;
		gameUI.upgradeSystem.createUpgradeWindow();

		const playerSprite = player as Phaser.GameObjects.Sprite & { hideAndRoll: (x:number,y:number) => void };
		playerSprite.hideAndRoll(this.x, this.y);
		this.IsActiveCannon = false;
		this.setTint(0xff0000);
		this.scene.time.delayedCall(6000, () => {
			this.IsActiveCannon = false;
		}
		, [], this);
	}





}



	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
