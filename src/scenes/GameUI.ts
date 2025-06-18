// You can write more code here
import ScoreCounter from "../components/ScoreCounter";
import PlayerPrefab from "./PlayerPrefab";
/* START OF COMPILED CODE */

import WeveanaJoystick from "./WeveanaJoystick";
import UpgradeSystemUI from "./UpgradeSystemUI";
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
	

		// fullScreenBtn
		const fullScreenBtn = this.add.image(0, 0, "FullScreenBtn");
		fullScreenBtn.scaleX = 0.5;
		fullScreenBtn.scaleY = 0.5;

		// UpgradeSystem
		const upgradeSystem = new UpgradeSystemUI(this, 0, 0);
		this.add.existing(upgradeSystem);

		// restartBtn
		const restartBtn = this.add.sprite(769, 1398, "FinalBtn");

		// fxOnBtn
		const fxOnBtn = this.add.image(0, 0, "FxOnBtn");
		fxOnBtn.scaleX = 0;

		// musicOnBtn
		const musicOnBtn = this.add.sprite(0, 0, "MusicOnBtn");
		musicOnBtn.scaleX = 0;

		// finalImage
		const finalImage = this.add.image(340, 291, "FinalImage");
		finalImage.scaleX = 0.5108707683450882;
		finalImage.scaleY = 0.5108707683450882;

		// finalBtn
		const finalBtn = this.add.image(679, 427, "FinalBtn");
		finalBtn.scaleX = 0;

		// helpPc
		const helpPc = this.add.image(0, 0, "HelpPc");

		this.weveanaJoystick = weveanaJoystick;
		this.jumpBtn = jumpBtn;
		this.fullScreenBtn = fullScreenBtn;
		this.upgradeSystem = upgradeSystem;
		this.restartBtn = restartBtn;
		this.fxOnBtn = fxOnBtn;
		this.musicOnBtn = musicOnBtn;
		this.finalImage = finalImage;
		this.finalBtn = finalBtn;
		this.helpPc = helpPc;

		this.events.emit("scene-awake");
	}

	public weveanaJoystick!: WeveanaJoystick;
	public jumpBtn!: Phaser.GameObjects.Image;
	public fullScreenBtn!: Phaser.GameObjects.Image;
	public upgradeSystem!: UpgradeSystemUI;
	public restartBtn!: Phaser.GameObjects.Sprite;
	public fxOnBtn!: Phaser.GameObjects.Image;
	public musicOnBtn!: Phaser.GameObjects.Sprite;
	private finalImage!: Phaser.GameObjects.Image;
	private finalBtn!: Phaser.GameObjects.Image;
	public helpPc!: Phaser.GameObjects.Image;

	/* START-USER-CODE */
	public levelText!: Phaser.GameObjects.Text;
	public levelBar!: Phaser.GameObjects.Rectangle;
	public updateBar!: Phaser.GameObjects.Rectangle;
	public strokeBar!: Phaser.GameObjects.Graphics;
	public level: number = 1;
	private LevelReach: number = 40;
	private collectedParticles: number = 0;
	public scoreCounter!: ScoreCounter;
	public optionPosition: Phaser.Math.Vector2[] = []; // Array to store positions
	private currentOptionIndex: number = 0; // Index to track the current position
	private selector!: Phaser.GameObjects.Rectangle; // Selector object
	public isMusicOn: boolean = true;
	public isFxOn: boolean = true;
	// Write your code here

	create() {
		this.editorCreate();

		// Crea primero las barras y el texto de nivel
		const levelBar = this.add.rectangle(this.scale.width / 2, 40, this.scale.width / 2, 35, 0xffffff);
		levelBar.setOrigin(0.5, 0.5);

		const UpdateBar = this.add.rectangle(this.scale.width / 2 - this.scale.width / 4, 40, this.scale.width / 2, 35, 0xff0000);
		UpdateBar.setOrigin(0, 0.5);
		UpdateBar.scaleX = 0;

		const strokeBar = this.add.graphics();
		strokeBar.lineStyle(6, 0x000000);
		strokeBar.strokeRoundedRect(this.scale.width / 4 - 2, 23, this.scale.width / 2 + 4, 35, 10);

		const levelText = this.add.text(this.scale.width / 4 + 10, 40, 'Level 1', {
			fontFamily: 'Bahiana',
			fontSize: '24px',
			color: '#e1e1e1',
			fontStyle: 'bold'
		});
		levelText.setOrigin(0, 0.5);

		this.levelBar = levelBar;
		this.updateBar = UpdateBar;
		this.strokeBar = strokeBar;
		this.levelText = levelText;

		// Detectar si es móvil
		const isMobile = this.game.device.os.android || this.game.device.os.iOS;
		const factor = this.scale.height / this.scale.width;

		// Ajustes para móvil
		if (isMobile) {

			this.finalImage.setScale(0.5 * factor);
			this.finalImage.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
			this.finalBtn.setVisible(false);
			// Reposicionar el botón final
			this.finalBtn.setPosition(this.cameras.main.centerX, this.cameras.main.centerY + 200 * factor);
			this.finalBtn.setScale(0.5 * factor);
			// Escalar y reposicionar elementos principales
			this.helpPc.setScale(0.7 * factor);
			this.helpPc.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

	//		this.jumpBtn.setScale(100);
			this.weveanaJoystick.setScale(factor / 1.2);

			this.levelBar.setScale(1, 1);
			this.updateBar.setScale(1, 1);
			this.strokeBar.setScale(1, 1);

			this.levelText.setFontSize(18);
			this.levelText.setPosition(this.scale.width / 4 + 10, 40 );

			this.musicOnBtn.setScale(0.4 * factor);
			this.fxOnBtn.setScale(0.4 * factor);

			this.musicOnBtn.setPosition(this.scale.width - 50 * factor, this.levelBar.y);
			this.fxOnBtn.setPosition(this.scale.width - 120 * factor, this.levelBar.y);

			this.jumpBtn.setPosition(0.3, 0.3);
			this.weveanaJoystick.setPosition(this.scale.width * 0.15, this.scale.height - this.scale.height * 0.08);

			this.fullScreenBtn.setVisible(true); // Opcional: ocultar en móvil
					this.restartBtn.setVisible(false);
		} else {
			// Desktop: dejar todo como está
			this.helpPc.setScale(0.8, 0.8);
			this.helpPc.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
			//this.jumpBtn.setScale(factor / 2);
			this.weveanaJoystick.setScale(factor / 1.5);
			this.musicOnBtn.setScale(0.5);
			this.fxOnBtn.setScale(0.5);
			this.musicOnBtn.setPosition(this.scale.width - 50, this.levelBar.y);
			this.fxOnBtn.setPosition(this.scale.width - 120, this.levelBar.y);
			this.jumpBtn.setPosition(this.scale.width * 0.15, this.scale.height - this.scale.height * 0.25);
			this.weveanaJoystick.setPosition(this.weveanaJoystick.x, this.weveanaJoystick.y);
			this.fullScreenBtn.setVisible(false);
			this.finalBtn.setVisible(false);
	
		}

		
		this.helpPc.setOrigin(0.5, 0.5);
		this.physics.add.existing(this.helpPc, false); // false = no estático, true = estático
		(this.helpPc.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

		this.helpPc.setInteractive();
		this.helpPc.setVisible(false);
		this.helpPc.on("pointerdown", () => {
			this.helpPc.setVisible(false);
		});

		this.restartBtn.visible = false;
		this.restartBtn.setInteractive();
		this.restartBtn.on("pointerdown", () => {
			this.game.events.emit("RestartLevel");
		});

		if (this.input.keyboard) {
			this.input.keyboard.on("keydown-ENTER", () => {
				if (this.restartBtn.visible) {
					this.game.events.emit("RestartLevel");
				}
			});
		}
		// const levelBar = this.add.rectangle(this.scale.width / 2, 40, this.scale.width / 2, 35, 0xffffff);
  //       levelBar.setOrigin(0.5, 0.5);

		// const UpdateBar = this.add.rectangle(this.scale.width / 2-this.scale.width/4, 40, this.scale.width / 2, 35, 0xff0000);
  //       UpdateBar.setOrigin(0, 0.5);
		// UpdateBar.scaleX=0;

		// const strokeBar = this.add.graphics();
  //       strokeBar.lineStyle(6, 0x000000); // Grosor de 2 píxeles y color blanco
		// strokeBar.strokeRoundedRect(this.scale.width / 4-2, 23, this.scale.width / 2+4, 35, 10); // Dibuja el rectángulo con bordes redondeados

		// const levelText = this.add.text(this.scale.width / 4+10, 40, 'Level 1', {
		// 	fontFamily: 'Bahiana',
  //           fontSize: '24px',
  //           color: '#e1e1e1',
  //           fontStyle: 'bold'
  //       });
  //       levelText.setOrigin(0, 0.5);

		// this.levelBar = levelBar;
  //       this.updateBar = UpdateBar;
  //       this.strokeBar = strokeBar;
  //       this.levelText = levelText;

		this.musicOnBtn.setPosition(this.scale.width-50, this.levelBar.y);
		this.musicOnBtn.setScale(0.5);
		this.fxOnBtn.setPosition(this.scale.width-120, this.levelBar.y);
		this.fxOnBtn.setScale(0.5);

		this.musicOnBtn.setInteractive();
		this.fxOnBtn.setInteractive();
		this.musicOnBtn.on("pointerover", () => {
			this.musicOnBtn.setTint(0xff0000); // Agregar tinte rojizo

		});
		this.musicOnBtn.on("pointerup", () => {
			this.musicOnBtn.clearTint(); // Eliminar tinte
		});
		this.fxOnBtn.on("pointerover", () => {
			this.fxOnBtn.setTint(0xff0000); // Agregar tinte rojizo

		});
		this.fxOnBtn.on("pointerup", () => {
			this.fxOnBtn.clearTint(); // Eliminar tinte
		});
		this.fxOnBtn.on("pointerout", () => {
			this.fxOnBtn.clearTint(); // Eliminar tinte si el puntero sale del botón
		});
		this.musicOnBtn.on("pointerout", () => {
			this.musicOnBtn.clearTint(); // Eliminar tinte si el puntero sale del botón
		});
		this.musicOnBtn.on("pointerdown", () => {
			if(this.isMusicOn){
				this.musicOnBtn.setTexture("MusicOffBtn");
				this.isMusicOn = false;
				const levelScene = this.scene.get('Level') as Phaser.Scene;
				(levelScene as any).setMusic(false);
			}else{
				this.isMusicOn = true;
				this.musicOnBtn.setTexture("MusicOnBtn");
				(levelScene as any).setMusic(true);
			}

		});

		this.fxOnBtn.on("pointerdown", () => {
			if(this.isFxOn){
				this.fxOnBtn.setTexture("FxOffBtn");
				this.isFxOn = false;
				const levelScene = this.scene.get('Level') as Phaser.Scene;
				(levelScene as any).setFX(false);
			}else{
				this.isFxOn = true;
				this.fxOnBtn.setTexture("FxOnBtn");
				(levelScene as any).setFX(true);
			}

		});


		// const factor = this.scale.height / this.scale.width; // Removed duplicate declaration

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

		this.jumpBtn.setScale(0.2);
		this.weveanaJoystick.setScale(factor/1.5);


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

		// Escuchar el evento 'particleCollected'
		const levelScene = this.scene.get('Level') as Phaser.Scene;
		levelScene.events.on('particleCollected', this.updateLevelBar, this);

		//posicion pantalla ScoreCounter
		this.scoreCounter = new ScoreCounter(this, this.levelBar.x-this.levelBar.width+20, this.levelBar.y-this.levelBar.height/2);
		// cambia el tamaño del valor
		this.scoreCounter.setScaleFactor(0.01);
		// Espera a que el jugador aparezca para fijar la posición inicial
		levelScene.events.once("playerMove", (playerX: number) => {
			this.scoreCounter.setInitialX(playerX);
		});

		// Luego escucha los movimientos del jugador
		levelScene.events.on("playerMove", (playerX: number) => {
			this.scoreCounter.update(playerX);
		});

		this.game.events.on("PlayerIsDead", this.ShowResults, this);

		this.finalImage.setVisible(false);
	//	this.ShowResults();
	}



	public ShowResults(): void {
    const factor = this.scale.height / this.scale.width;
    this.levelBar.setVisible(false);
    this.updateBar.setVisible(false);
    this.strokeBar.setVisible(false);
    this.levelText.setVisible(false);

    this.jumpBtn.setVisible(false);	
    this.weveanaJoystick.setVisible(false);
    this.fullScreenBtn.setVisible(false);
    this.finalImage.setVisible(true);

    const fixerY = 30;
    const isMobile = this.game.device.os.android || this.game.device.os.iOS;

    if (isMobile) {
        const fixerY = 90;
        this.finalImage.setPosition(150, this.cameras.main.centerY);
        this.finalBtn.setVisible(false);
        this.weveanaJoystick.setVisible(false);
        const disntancetraveled = this.add.text(400, 200-fixerY, 'Distance traveled', {
				fontFamily: 'Bahiana',
				fontSize: '60px',
				color: '#ffffff',
				fontStyle: 'bold'
			});
			disntancetraveled.setOrigin(0.5, 0.5);
			disntancetraveled.setScale(factor);

			const distancereached = (this.scoreCounter as any).GetDistance();
			const distanceReachedText = this.add.text(400, 260-fixerY, distancereached + " " + "M", {
				fontFamily: 'Bahiana',
				fontSize: '100px',
				color: '#ff0000',
				fontStyle: 'bold'
			});
			distanceReachedText.setOrigin(0.5, 0.5);
			distanceReachedText.setScale(factor);

			const LevelReachedText = this.add.text(400, 330-fixerY, 'Level reached', {
				fontFamily: 'Bahiana',
				fontSize: '60px',
				color: '#ffffff',
				fontStyle: 'bold'
			});
			LevelReachedText.setOrigin(0.5, 0.5);
			LevelReachedText.setScale(factor);

			const LevelGet = this.level.toString();
			const LevelReached = this.add.text(400, 390-fixerY, LevelGet, {
				fontFamily: 'Bahiana',
				fontSize: '100px',
				color: '#ff0000',
				fontStyle: 'bold'
			});
			LevelReached.setOrigin(0.5, 0.5);
			LevelReached.setScale(factor);

			this.restartBtn.setVisible(true);
			this.restartBtn.setPosition(400, 500 - fixerY);
			this.restartBtn.setScale(factor);

			// Reiniciar el juego al tocar la pantalla en mobile
			this.input.once('pointerdown', () => {
				this.game.events.emit("RestartLevel");
			});
    } else {
        const disntancetraveled = this.add.text(750, 200-fixerY, 'Distance traveled', {
				fontFamily: 'Bahiana',
				fontSize: '80px',
				color: '#ffffff',
				fontStyle: 'bold'
			});
			disntancetraveled.setOrigin(0.5, 0.5);
			disntancetraveled.setScale(factor);

			const distancereached = (this.scoreCounter as any).GetDistance();
			const distanceReachedText = this.add.text(750, 260-fixerY, distancereached + " " + "M", {
				fontFamily: 'Bahiana',
				fontSize: '120px',
				color: '#ff0000',
				fontStyle: 'bold'
			});
			distanceReachedText.setOrigin(0.5, 0.5);
			distanceReachedText.setScale(factor);

			const LevelReachedText = this.add.text(750, 330-fixerY, 'Level reached', {
				fontFamily: 'Bahiana',
				fontSize: '80px',
				color: '#ffffff',
				fontStyle: 'bold'
			});
			LevelReachedText.setOrigin(0.5, 0.5);
			LevelReachedText.setScale(factor);

			const LevelGet = this.level.toString();
			const LevelReached = this.add.text(750, 390-fixerY, LevelGet, {
				fontFamily: 'Bahiana',
				fontSize: '120px',
				color: '#ff0000',
				fontStyle: 'bold'
			});
			LevelReached.setOrigin(0.5, 0.5);
			LevelReached.setScale(factor);

			this.restartBtn.setVisible(true);
			this.restartBtn.setPosition(750, 500 - fixerY);
			this.restartBtn.setScale(factor);
    }

    // Esperar unos segundos y luego pausar el nivel
    this.time.delayedCall(1500, () => {
        this.scene.pause('Level');
    });
}

	updateLevelBar(collectedParticles: number) {
        this.collectedParticles += collectedParticles;

        // Calcular el progreso actual
        const progress = this.collectedParticles / this.LevelReach;

        // Actualizar la barra de progreso
        this.updateBar.scaleX = progress;

        // Verificar si el jugador ha alcanzado el nivel actual
        if (this.collectedParticles >= this.LevelReach) {
				const levelScene = this.scene.get('Level') as Phaser.Scene;
		if(!(levelScene as any).isFxMuted){
			const jumpSounds = ['powerUp_01'];
		// Select a random sound
		const randomSound = Phaser.Math.RND.pick(jumpSounds);
		// Play the selected sound
		this.sound.play(randomSound);
		}

            this.level++;
            this.LevelReach+= this.LevelReach * 0.5; // Incrementar el requisito de partículas para el siguiente nivel
            this.collectedParticles = 0; // Reiniciar el conteo de partículas recolectadas

            // Actualizar el texto del nivel
            this.levelText.setText(`Level ${this.level}`);

            // Reiniciar la barra de progreso
            this.updateBar.scaleX = 0;
        }else if(this.collectedParticles < 0){
			this.collectedParticles = 0;
			this.updateBar.scaleX = 0;
		}
    }


	handleResize() {
        const factor = this.scale.height / this.scale.width;
     //   this.jumpBtn.setScale(factor / 4);
        this.weveanaJoystick.setScale(factor / 2);
        this.jumpBtn.setPosition(this.scale.width * 0.15, this.scale.height - this.scale.height * 0.25);
    }


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
