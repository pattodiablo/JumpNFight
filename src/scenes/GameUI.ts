
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

		// fullScreenBtn
		const fullScreenBtn = this.add.image(0, 0, "FullScreenBtn");
		fullScreenBtn.scaleX = 0.5;
		fullScreenBtn.scaleY = 0.5;

		this.weveanaJoystick = weveanaJoystick;
		this.jumpBtn = jumpBtn;
		this.fullScreenBtn = fullScreenBtn;

		this.events.emit("scene-awake");
	}

	public weveanaJoystick!: WeveanaJoystick;
	public jumpBtn!: Phaser.GameObjects.Image;
	public fullScreenBtn!: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	public levelText!: Phaser.GameObjects.Text;
	// Write your code here

	create() {

		this.editorCreate();

		const levelBar = this.add.rectangle(this.scale.width / 2, 30, this.scale.width / 2, 35, 0xffffff);
        levelBar.setOrigin(0.5, 0.5);

		const UpdateBar = this.add.rectangle(this.scale.width / 2-this.scale.width/4, 30, this.scale.width / 2, 35, 0xff0000);
        UpdateBar.setOrigin(0, 0.5);
		UpdateBar.scaleX=0;

		const strokeBar = this.add.graphics();
        strokeBar.lineStyle(6, 0x000000); // Grosor de 2 píxeles y color blanco
		strokeBar.strokeRoundedRect(this.scale.width / 4-2, 13, this.scale.width / 2+4, 35, 10); // Dibuja el rectángulo con bordes redondeados
		
		const levelText = this.add.text(this.scale.width / 4+10, 30, 'Lv.1', {
            fontSize: '24px',
            color: '#e1e1e1',
            fontStyle: 'bold'
        });
        levelText.setOrigin(0, 0.5);

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
		this.weveanaJoystick.setScale(factor/1.5);
		console.log(this.game.device.os.desktop);

		this.fullScreenBtn.setInteractive();
		this.fullScreenBtn.on("pointerdown", () => {
			if (this.scene.scene.scale.isFullscreen) {
				this.scene.scene.scale.stopFullscreen();
				// On stop fulll screen
			} else {
				this.scene.scene.scale.startFullscreen();
				// On start fulll screen
			}
		});

		this.jumpBtn.setPosition(this.scale.width*0.15,this.scale.height-this.scale.height*0.25);
		if(this.game.device.os.desktop){
			this.jumpBtn.setVisible(false);
			this.fullScreenBtn.setVisible(false);
			}else{
			
			this.fullScreenBtn.setPosition(this.scale.width-this.scale.width*0.05,this.scale.height-this.scale.height*0.1);

		}
		this.scale.on('enterfullscreen', this.handleResize, this);
        this.scale.on('leavefullscreen', this.handleResize, this);
        window.addEventListener('resize', this.handleResize.bind(this));
	}
	handleResize() {
        const factor = this.scale.height / this.scale.width;
        this.jumpBtn.setScale(factor / 2);
        this.weveanaJoystick.setScale(factor / 2);
        this.jumpBtn.setPosition(this.scale.width * 0.15, this.scale.height - this.scale.height * 0.25);
    }
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
