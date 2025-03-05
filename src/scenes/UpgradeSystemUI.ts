// You can write more code here

/* START OF COMPILED CODE */

import Upgrade from "./Upgrade";
/* START-USER-IMPORTS */

/* END-USER-IMPORTS */

export default class UpgradeSystemUI extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		this.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// Btn1
		const btn1 = scene.add.image(517, 582, "UpgradeBtn");
		this.add(btn1);

		// Btn2
		const btn2 = scene.add.image(1017, 582, "UpgradeBtn");
		this.add(btn2);

		// Btn3
		const btn3 = scene.add.image(1502, 582, "UpgradeBtn");
		this.add(btn3);

		// upgrade1
		const upgrade1 = new Upgrade(scene, 526, 569);
		this.add(upgrade1);

		// upgrade2
		const upgrade2 = new Upgrade(scene, 1017, 545);
		this.add(upgrade2);

		// upgrade3
		const upgrade3 = new Upgrade(scene, 1504, 569);
		this.add(upgrade3);

		this.btn1 = btn1;
		this.btn2 = btn2;
		this.btn3 = btn3;
		this.upgrade1 = upgrade1;
		this.upgrade2 = upgrade2;
		this.upgrade3 = upgrade3;

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);

		/* END-USER-CTR-CODE */
	}

	private btn1: Phaser.GameObjects.Image;
	private btn2: Phaser.GameObjects.Image;
	private btn3: Phaser.GameObjects.Image;
	private upgrade1: Upgrade;
	private upgrade2: Upgrade;
	private upgrade3: Upgrade;
	public PlayerSpeed: Array<any> = [200,"RunningIcon","Player", 0,"PlayerSpeed","add","Player speed"];
	public fallMultiplier: Array<any> = [0.5,"ShieldIcon","Player", 0,"fallMultiplier","add","Gravity when fall"];
	public JumpVelocity: Array<any> = [100,"ShieldIcon","Player", 0,"JumpVelocity","add","Jump speed"];
	public lastShotTime: Array<any> = [100,"ShieldIcon","Player", 0,"lastShotTime","add", "Last shot time"];
	public shotInterval: Array<any> = [40,"ShieldIcon","Laser", 0,"shotInterval","add", "Shot interval"];
	public laserColor: Array<any> = [1,"LaserIcon","Laser", 0,"laserColor","add", "laser color"];
	public laserSpeed: Array<any> = [100,"LaserIcon","Laser", 0,"laserSpeed","add", "laser speed"];
	public laserDuration: Array<any> = [100,"LaserIcon","Laser", 0,"laserDuration","add", "Laser duration"];
	public collectedParticles: Array<any> = [500,"ShieldIcon","Player", 0,"collectedParticles","add", "Collected Particles"];
	public CannonVelo: Array<any> = [1000,"MissileIcon","Cannon", 0,"CannonVelo","add", "Initial fire speed"];
	public upgrades: Array<any> = [this.PlayerSpeed, this.fallMultiplier, this.JumpVelocity, this.lastShotTime, this.shotInterval, this.laserColor, this.laserSpeed, this.laserDuration, this.collectedParticles, this.CannonVelo];
	public background!: Phaser.GameObjects.Rectangle;
	public AvailableUpgrades: Array<any> = [...this.upgrades];

	/* START-USER-CODE */
create(){
	this.alpha = 0;


}
	createUpgradeWindow() {
		this.AvailableUpgrades = [...this.upgrades];

		this.upgrade1.getRandomUpgrade(this.AvailableUpgrades);
		this.upgrade2.getRandomUpgrade(this.AvailableUpgrades);
		this.upgrade3.getRandomUpgrade(this.AvailableUpgrades);

		this.alpha = 1;

		this.scene.scene.pause('Level');
		this.upgrade1.visible = true;
		this.upgrade2.visible = true;			
		this.upgrade3.visible = true;
		this.upgrade1.alpha = 0;
		this.upgrade2.alpha = 0;
		this.upgrade3.alpha = 0;
		this.upgrade1.setScale(0.5);
		this.upgrade2.setScale(0.5);
		this.upgrade3.setScale(0.5);

		const width = this.scene.scale.width;
        const height = this.scene.scale.height;

     	this.background = this.scene.add.rectangle(width / 2, this.scene.scale.height / 2, width, height, 0x000000, 0.8);
        this.background.setOrigin(0.5, 0.5)
		//this.add(this.background);
		this.background.setDepth(-11);


		this.btn1.scaleX = 0.4;
        this.btn1.scaleY = 0.4;
		this.btn2.scaleX = 0.4;
        this.btn2.scaleY = 0.4;
		this.btn3.scaleX = 0.4;
        this.btn3.scaleY = 0.4;
		const btnSpacing = width / 5;
		this.btn1.setPosition(width / 2 - btnSpacing, this.scene.scale.height / 2);
        this.btn2.setPosition(width / 2, this.scene.scale.height / 2);
        this.btn3.setPosition(width / 2 + btnSpacing, this.scene.scale.height / 2);
		this.btn1.setDepth(2);
		this.btn2.setDepth(2);
		this.btn3.setDepth(2);



		this.upgrade1.x = this.btn1.x;
		this.upgrade1.y = this.btn1.y;	
		this.upgrade2.x = this.btn2.x;
		this.upgrade2.y = this.btn2.y;
		this.upgrade3.x = this.btn3.x;
		this.upgrade3.y = this.btn3.y;

		this.background.x = width+width/2;

		this.btn1.y = this.scene.scale.height;
		this.btn2.y = this.scene.scale.height;
		this.btn3.y = this.scene.scale.height;

		// Agregar el texto "Upgrade" en el centro arriba de los botones
        const upgradeText = this.scene.add.text(width / 2, this.scene.scale.height / 3.5, 'Upgrade', {
            fontFamily: 'Bahiana',
			fontSize: '64px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        upgradeText.setOrigin(0.5, 0.5);
        this.add(upgradeText);


		// Animación tween para que el cuadrado negro transparente aparezca de derecha a izquierda
        this.scene.tweens.add({
            targets: this.background,
            x: width / 2,
            duration: 250,
            ease: 'Power2',
            onComplete: () => {
                // Animaciones tween para que los botones aparezcan desde fuera de la pantalla de la parte inferior, uno por uno
                this.scene.tweens.add({
                    targets: this.btn1,
                    y: this.scene.scale.height / 2,
                    duration: 500,
                    ease: 'Bounce.easeOut'
                });
                this.scene.tweens.add({
                    targets: this.btn2,
                    y: this.scene.scale.height / 2,
                    duration: 500,
                    delay: 250,
                    ease: 'Bounce.easeOut'
                });
                this.scene.tweens.add({
                    targets: this.btn3,
                    y: this.scene.scale.height / 2,
                    duration: 500,
                    delay: 500,
                    ease: 'Bounce.easeOut'
                });
				this.scene.tweens.add({
                    targets: this.upgrade1,
                    scale: { from: 0.6, to: 0.5 },
                    duration: 200,
					alpha: 1,
					opacity: 0,
                    delay: 700,
                    ease: 'Bounce.easeOut'
                });
				this.scene.tweens.add({
                    targets: this.upgrade2,
                    scale: { from: 0.6, to: 0.5 },
                    duration: 200,
					alpha: 1,
					opacity: 0,
                    delay: 800,
                    ease: 'Bounce.easeOut'
                });
				this.scene.tweens.add({
                    targets: this.upgrade3,
                    scale: { from: 0.6, to: 0.5 },
                    duration: 200,
					alpha: 1,
					opacity: 0,
                    delay: 900,
                    ease: 'Bounce.easeOut'
                });
            }
        })
   // Agregar eventos de entrada para cambiar el color de los botones al pasar el mouse
   this.addHoverEffect(this.btn1);
   this.addHoverEffect(this.btn2);
   this.addHoverEffect(this.btn3);

   // Agregar eventos de clic a los botones de mejora
   this.addClickEvent(this.btn1, this.upgrade1);
   this.addClickEvent(this.btn2, this.upgrade2);
   this.addClickEvent(this.btn3, this.upgrade3);

	}

	addHoverEffect(button: Phaser.GameObjects.Image) {
        button.setInteractive();
        button.on('pointerover', () => {
            button.setTint(0xff0000); // Cambiar el color a rojo
        });
        button.on('pointerout', () => {
            button.clearTint(); // Eliminar el tinte
        });
    }

	addClickEvent(button: Phaser.GameObjects.Image, upgrade: Upgrade) {
        button.setInteractive();
        button.on('pointerdown', () => {

          this.handleUpgradeClick(upgrade);
		  this.closeUpgradeSystem();



        });
    }

	handleUpgradeClick(upgrade: Upgrade) {
		const upgradeType = upgrade;
		const currentLevel = this.scene.scene.get('Level') as any;
		const propertyName = upgradeType.randomUpgrade[4];

		this.upgrades.forEach(upgrade => {

			if(upgrade[4]==upgradeType.randomUpgrade[4]){


				if (upgrade[4] == upgradeType.randomUpgrade[4]) {
					if (upgradeType.randomUpgrade[2] == "Player") {
						switch (upgradeType.randomUpgrade[5]) {
							case "add":
								currentLevel.player[propertyName] += upgradeType.randomUpgrade[0];
								break;
							case "substract":
								currentLevel.player[propertyName] -= upgradeType.randomUpgrade[0];
								break;
							case "multiply":
								currentLevel.player[propertyName] *= upgradeType.randomUpgrade[0];
								break;
							case "divide":
								currentLevel.player[propertyName] /= upgradeType.randomUpgrade[0];
								break;
						}
						console.log("Property " + propertyName + " " + currentLevel.player[propertyName]);
					} else if (upgradeType.randomUpgrade[2] == "Laser") {
						switch (upgradeType.randomUpgrade[5]) {
							case "add":
								currentLevel.player[propertyName] += upgradeType.randomUpgrade[0];
								break;
							case "substract":
								currentLevel.player[propertyName] -= upgradeType.randomUpgrade[0];
								break;
							case "multiply":
								currentLevel.player[propertyName] *= upgradeType.randomUpgrade[0];
								break;
							case "divide":
								currentLevel.player[propertyName] /= upgradeType.randomUpgrade[0];
								break;
						}
						console.log("Property " + propertyName + " " + currentLevel.player[propertyName]);
					} else if (upgradeType.randomUpgrade[2] == "Cannon") {
						switch (upgradeType.randomUpgrade[5]) {
							case "add":
								currentLevel.player[propertyName] += upgradeType.randomUpgrade[0];
								break;
							case "substract":
								currentLevel.player[propertyName] -= upgradeType.randomUpgrade[0];
								break;
							case "multiply":
								currentLevel.player[propertyName] *= upgradeType.randomUpgrade[0];
								break;
							case "divide":
								currentLevel.player[propertyName] /= upgradeType.randomUpgrade[0];
								break;
						}
						console.log("Property " + propertyName + " " + currentLevel.player[propertyName]);
					}
				}


			}
		});

	}



	closeUpgradeSystem() {
        this.scene.scene.resume('Level');
		this.background.destroy(); // Destruir el rectángulo
		this.alpha = 0; // Ocultar el contenedor UpgradeSystemUI
	//	this.destroy(); // Destruir el contenedor UpgradeSystemUI
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
