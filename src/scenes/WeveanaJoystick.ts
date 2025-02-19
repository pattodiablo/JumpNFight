
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class WeveanaJoystick extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		this.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// base
		const base = scene.add.ellipse(0, 0, 384, 384);
		base.isStroked = true;
		base.strokeColor = 16711680;
		base.lineWidth = 16;
		this.add(base);

		// thumb
		const thumb = scene.add.ellipse(0, 0, 128, 128);
		thumb.isFilled = true;
		thumb.fillColor = 0;
		thumb.isStroked = true;
		thumb.lineWidth = 12;
		this.add(thumb);

		this.base = base;
		this.thumb = thumb;

		/* START-USER-CTR-CODE */

		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this.scene.events.on("update", () => this.update(this.scene.input.activePointer));
		/* END-USER-CTR-CODE */
	}

	public base: Phaser.GameObjects.Ellipse;
	public thumb: Phaser.GameObjects.Ellipse;
	public pointerId!:  number | null;
	public LastX: number = 0;
	public LastY: number = 0;
	public maxRadius: number = 200;
	public direction!: {};
	public activePointerId: number | null = null;

	/* START-USER-CODE */

	create(){
		this.setDepth(1000);
		this.base.setInteractive();
        this.thumb.setInteractive();
		this.scene.input.on('pointerdown', this.onPointerDown, this);
        this.scene.input.on('pointerup', this.onPointerUp, this);
        this.scene.input.on('pointermove', this.onPointerMove, this);
		this.visible=false;
		this.base.setScrollFactor(0);
	}

	private onPointerDown(pointer: Phaser.Input.Pointer) {
		if (this.activePointerId === null) {
			this.activePointerId = pointer.id;
			this.setPosition(pointer.x, pointer.y);
			this.visible=true;
			this.thumb.setPosition(0,0);
			this.direction = { x: 0, y: 0 };
			this.emit('move', this.direction);

		}
	

    }

	private onPointerUp(pointer: Phaser.Input.Pointer) {
		if (pointer.id === this.activePointerId) {
			this.activePointerId = null;
			this.visible=false;
			this.thumb.setPosition(0,0);
			this.direction = { x: 0, y: 0 };
			this.emit('move', this.direction);
		}
    }

	private onPointerMove(pointer: Phaser.Input.Pointer) {
		if (pointer.id === this.activePointerId) {
			this.thumb.x = pointer.x-this.x;
			this.thumb.y = pointer.y-this.y;

			const dx = this.thumb.x - this.base.x;
			const dy = this.thumb.y - this.base.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > this.maxRadius) {	
				const angle = Math.atan2(dy, dx);
				this.thumb.x = this.base.x + Math.cos(angle) * this.maxRadius;
				this.thumb.y = this.base.y + Math.sin(angle) * this.maxRadius;
			}

			this.direction = { x: this.thumb.x / this.maxRadius, y: this.thumb.y / this.maxRadius }; // Normalizar el movimiento

			this.emit('move', this.direction);
		}
    }

	update(pointer: Phaser.Input.Pointer) {
	//	this.base.setPosition(this.LastX+this.scene.cameras.main.scrollX, this.LastY-this.scene.cameras.main.scrollY);
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
