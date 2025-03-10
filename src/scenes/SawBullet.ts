
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class SawBullet extends Phaser.GameObjects.Image {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "sawBullet", frame);

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this.scene.events.on("update", (time: number, delta: number) => this.update(delta));

		/* END-USER-CTR-CODE */
	}

	public BulletGravity: number = 100;
	public BulletVelocity: number = 2000;

	/* START-USER-CODE */

	create(){

		this.scene.physics.add.existing(this);
		const bulletBody = this.body as Phaser.Physics.Arcade.Body;
		bulletBody.setVelocityX(this.BulletVelocity);
		bulletBody.setVelocityY(this.BulletVelocity);
		bulletBody.setGravityY(this.BulletGravity); // Configura la gravedad para el jugador\
		bulletBody.setImmovable(true); // Hacer que el enemigo sea inmovible
		bulletBody.setAllowGravity(false); // Desactiva la gravedad para el enemigo
		bulletBody.setBounce(1); // Hacer que el sawBullet rebote completamente
        bulletBody.setCollideWorldBounds(true); // Habilitar colisiones con los bordes del mundo
		//bulletBody.setGravityY(this.BulletGravity);
	}

	update(delta: number):void {
	//	this.updateWorldBounds();
	}
	

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
