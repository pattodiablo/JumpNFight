
// You can write more code here

/* START OF COMPILED CODE */

import WeveanaJoystick from "./WeveanaJoystick";
/* START-USER-IMPORTS */

/* END-USER-IMPORTS */

export default class GameUI extends Phaser.Scene {

	constructor() {
		super("GameUI");

		/* START-USER-CTR-CODE */

		

		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// weveanaJoystick
		const weveanaJoystick = new WeveanaJoystick(this, 0, 0);
		this.add.existing(weveanaJoystick);
		weveanaJoystick.name = "weveanaJoystick";

		// JumpBtn
		const jumpBtn = this.add.image(387, 675, "JumpBtn");
		jumpBtn.scaleX = 0.5;
		jumpBtn.scaleY = 0.5;

		this.weveanaJoystick = weveanaJoystick;
		this.jumpBtn = jumpBtn;

		this.events.emit("scene-awake");
	}

	public weveanaJoystick!: WeveanaJoystick;
	public jumpBtn!: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
		const factor = this.scale.height / this.scale.width;

		this.input.addPointer(2); // Agregar dos punteros adicionales


		this.weveanaJoystick.on('move', (direction: { x: number, y: number }) => {
            this.events.emit('joystickMove', direction);
        });

		this.jumpBtn.setInteractive();
		this.jumpBtn.on("pointerdown", () => {
			this.jumpBtn.setTint(0xff0000); // Agregar tinte rojizo
			this.events.emit('jump',true);
		});
		this.jumpBtn.on("pointerup", () => {
            this.jumpBtn.clearTint(); // Eliminar tinte
			this.events.emit('jump',false);
        });
        this.jumpBtn.on("pointerout", () => {
            this.jumpBtn.clearTint(); // Eliminar tinte si el puntero sale del botón
			this.events.emit('jump',false);
        });

		this.jumpBtn.setScale(factor/2);
		this.weveanaJoystick.setScale(factor/2);

	
		
		this.jumpBtn.setPosition(this.scale.width*0.15,this.scale.height-this.scale.height*0.25);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
