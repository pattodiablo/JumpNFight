
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class CollectableParticle extends Phaser.GameObjects.Ellipse {

	constructor(scene: Phaser.Scene, x?: number, y?: number, width?: number, height?: number) {
		super(scene, x ?? 0, y ?? 0, width ?? 26, height ?? 26);

		this.scaleX = 2.0449978628728975;
		this.scaleY = 2.0449978628728975;
		this.isFilled = true;
		this.fillColor = 16711680;

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this.scene.events.on("update", (time: number, delta: number) => this.update(time, delta));
		/* END-USER-CTR-CODE */
	}

	public attractionRange: number = 600;
	public attractionSpeed: number = 2000;
	public player!: Phaser.GameObjects.Sprite ;
	public isDestroyed: boolean = false;
	public MaxKillTime: number = 10000;
	public LevelPoins: number = 0;

	/* START-USER-CODE */

	create() {
		this.scene.physics.add.existing(this);
		const body = this.body as Phaser.Physics.Arcade.Body;
		body.setCircle(this.width * 3); 
		body.setOffset(-this.width*1.5, -this.height*1.5);

		body.setAllowGravity(false);
		body.setImmovable(true);
		this.player = (this.scene as Phaser.Scene & { player: Phaser.GameObjects.Sprite }).player;
		this.scene.physics.add.overlap(this, this.player, this.handlePlayerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

		// Iniciar el temporizador para la destrucción automática
        this.scene.time.delayedCall(this.MaxKillTime, this.autoDestroy, [], this);
	}

	autoDestroy() {
		if (this.isDestroyed) return; // Verificar si la partícula ha sido destruida
        if (!this.isDestroyed) {
            this.isDestroyed = true; // Marcar la partícula como destruida
            this.destroy(); // Destruir la partícula
        }
    }
	update(time: number, delta: number) {
		if (!this.isDestroyed) {  
			 this.checkDistanceToPlayer();
		}

    }

	checkDistanceToPlayer() {
		try {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

            if (distance < this.attractionRange) {
                this.moveToPlayer();
            }
        } catch (error) {
			this.destroy();

        }
    }

	moveToPlayer() {
		if (this.isDestroyed) return; // Verificar si la partícula ha sido destruida
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(
            Math.cos(angle) * this.attractionSpeed,
            Math.sin(angle) * this.attractionSpeed
        );
    }

	handlePlayerCollision(particle: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {
		this.isDestroyed = true; // Marcar la partícula como destruida
		this.scene.tweens.add({
			targets: this,
			y: this.y-1000,
			scale: 0,
			alpha:0,
			ease: 'Quadratic.Out',
			duration: 500,
			callbackScope: this,
			onComplete: function () {
				(player as any).collectParticle(1);
				this.destroy();
			}

		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
