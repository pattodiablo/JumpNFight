// You can write more code here

/* START OF COMPILED CODE */

import Upgrade from "./Upgrade";
/* START-USER-IMPORTS */

/* END-USER-IMPORTS */

export default class UpgradeSystemUI extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

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

		// selector
		const selector = scene.add.image(520, 575, "selector");
		this.add(selector);

		this.btn1 = btn1;
		this.btn2 = btn2;
		this.btn3 = btn3;
		this.upgrade1 = upgrade1;
		this.upgrade2 = upgrade2;
		this.upgrade3 = upgrade3;
		this.selector = selector;

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
	public selector: Phaser.GameObjects.Image;
	public PlayerSpeed: Array<any> = [200,"RunningIcon","Player", 0,"PlayerSpeed","add","Player speed"];
	public CannonVelo: Array<any> = [1000,"RunningIcon","Cannon", 0,"CannonVelo","add", "Initial fire speed"];
	public background!: Phaser.GameObjects.Rectangle;
	public currentOption: number = 0;

	/* START-USER-CODE */

	public MissileVelocity: Array<any> = [225,"MissileVelocity","LaserShot", 0,"MissileVelocity","add", "Missile velocity"];
	public MissileSize: Array<any> = [1.5,"MissileSize","LaserShot", 0,"MissileSize","multiply", "Missile size"];
	public MissileDamage: Array<any> = [1.5,"MissilePower","LaserShot", 0,"MissileDamage","multiply", "Missile damage"];
	public MissileInterval: Array<any> = [200,"MissileInterval","LaserShot", 0,"MissileInterval","substract", "Missile Interval"];

	public LaserDamage: Array<any> = [2,"LaserPower","LaserShot", 0,"LaserDamage","multiply", "Laser Power"];
	public LaserInterval: Array<any> = [150,"LaserInterval","LaserShot", 0,"LaserShotsInterval","substract", "Laser Interval"];
	public LaserVelocity: Array<any> = [300,"LaserSpeed","LaserShot", 0,"LaserVelocity","add", "Laser Velocity"];

	public MineDamage: Array<any> = [1.5,"MinePower","LaserShot", 0,"swordWeaponDamage","multiply", "Mine Damage"];
	public MineVelocity: Array<any> = [300,"MineSpeed","LaserShot", 0,"SwordVelocity","add", "Mine Velocity"];
	public MineInterval: Array<any> = [500,"MineInterval","LaserShot", 0,"SwordInterval","substract", "Mine Interval"];

	public RainDamage: Array<any> = [1.5,"RainPower","LaserShot", 0,"rainDamage","multiply", "Rain Damage"];
	public RainVelocity: Array<any> = [300,"RainVelocity","LaserShot", 0,"RainVelocity","add", "Rain Velocity"];
	public RainInterval: Array<any> = [250,"RainInterval","LaserShot", 0,"rainInterval","substract", "Rain Interval"];

	public SawMissileDamage: Array<any> = [2,"SawPower","Player", 0,"SawMissile","multiply", "Saw Damage"];
	public SawMissileVelocity: Array<any> = [300,"SawSpeed","Player", 0,"SawMissileVelocity","add", "Saw Missile Velocity"];
	public SawMissileInterval: Array<any> = [1000,"SawInterval","Player", 0,"LastSawMissileTime","substract", "Saw Interval"];
	public SawMissileSize: Array<any> = [1.5,"SawSize","Player", 0,"SawMissileSize","multiply", "Saw Size"];
	public SawMissileLifetime: Array<any> = [1500,"SawBouncingTime","Player", 0,"SawBulletLifeTime","add", "Saw Lifetime"];

	public upgrades: Array<any> = [this.SawMissileInterval];	
	public optionPositions: Array<any> = [];
//	public upgrades: Array<any> = [this.MissileSize];	
	public AvailableUpgrades: Array<any> = [...this.upgrades];
	public isUpgradeSelected = false;
	
	
	create(){
	this.alpha = 0;
	}

	createUpgradeWindow() {
		console.log("is upgrade selected " + this.isUpgradeSelected);
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

		const buttonOriginalWidth = this.btn1.width; // Ancho original del botón
		const numButtons = 3;
		const spacingRatio = 0.15; 
		const totalSpacing = (numButtons + 1) * spacingRatio	; // Espacios entre y a los lados
		const scaleRation = (width * (1 - totalSpacing)) / (numButtons * buttonOriginalWidth);
		this.btn1.scaleX =  scaleRation;
        this.btn1.scaleY = scaleRation;
		this.btn2.scaleX = scaleRation;
        this.btn2.scaleY = scaleRation;
		this.btn3.scaleX = scaleRation;
        this.btn3.scaleY = scaleRation;
		const btnSpacing = (width / numButtons)+spacingRatio;
		this.btn1.setPosition(width / 2 - btnSpacing, this.scene.scale.height / 2);
        this.btn2.setPosition(width / 2, this.scene.scale.height / 2);
        this.btn3.setPosition(width / 2 + btnSpacing, this.scene.scale.height / 2);
		this.btn1.setDepth(2);
		this.btn2.setDepth(2);
		this.btn3.setDepth(2);

		this.optionPositions.push({posx: this.btn1.x, posy:this.btn1.y});
		this.optionPositions.push({posx: this.btn2.x, posy:this.btn2.y});
		this.optionPositions.push({posx: this.btn3.x, posy:this.btn3.y});

		this.selector.setOrigin(0.5, 0.5);
		this.selector.setScale(this.btn1.scaleX*1.5);
		this.selector.setPosition(this.btn1.x, this.btn1.y);
		this.selector.setVisible(false);

		if (this.scene.input.keyboard) {
			this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
				if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
					this.moveSelector(1); // Move to the next position
				} else if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
					this.moveSelector(-1); // Move to the previous position
				}
				if (event.key === 'Enter'  || event.key === 's' || event.key === 'ArrowDown') {
					switch (this.currentOption) {
						case 0:
							if(this.selector.visible){
								this.handleUpgradeClick(this.upgrade1);
							}
							
							break;
						case 1:
							if(this.selector.visible){
							this.handleUpgradeClick(this.upgrade2);
							}
							break;
						case 2:
							if(this.selector.visible){
							this.handleUpgradeClick(this.upgrade3);
							}
							break;
						default:
							break;
					}
					this.closeUpgradeSystem();
				}
			});
		}

		
		this.scene.tweens.add({
            targets: this.background,
            x: width / 2,
            duration: 250,
            ease: 'Power2',
            onComplete: () => {
                // Animaciones tween para que los botones aparezcan desde fuera de la pantalla de la parte inferior, uno por uno
                this.scene.tweens.add({
                    targets: this.selector,
                    scaleX: { from: this.btn1.scaleX*1, to: this.btn1.scaleX*1.1 },
					scaleY: { from: this.btn1.scaleY*1, to: this.btn1.scaleY*1.1 },
                    duration: 500,
                    ease: 'Linear',
					repeat: -1,
					yoyo: true,
                });
            
            }
        })
		const factor = this.scene.scale.height/this.scene.scale.width;
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

		this.btn1.setScale(factor);
		this.btn2.setScale(factor);
		this.btn3.setScale(factor);
		this.upgrade1.setScale(factor);
		this.upgrade2.setScale(factor);
		this.upgrade3.setScale(factor);

		// Agregar el texto "Upgrade" en el centro arriba de los botones
        const upgradeText = this.scene.add.text(width / 2, height-40, 'Upgrade', {
            fontFamily: 'Bahiana',
			fontSize: '64px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        upgradeText.setOrigin(0.5, 0.5);
		upgradeText.setScale(factor);
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
                    ease: 'Bounce.easeOut',
					onComplete: () => {
						this.selector.setVisible(true);
					}
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

	private moveSelector(direction: number) {

		// Update the current option index
		this.currentOption = (this.currentOption + direction + this.optionPositions.length) % this.optionPositions.length;
		// Move the selector to the new position
		const newPosition = this.optionPositions[this.currentOption];
		this.selector.setPosition(newPosition.posx, newPosition.posy);
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
		if(!this.isUpgradeSelected){
	
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
						} else if (upgradeType.randomUpgrade[2] == "LaserShot") {
							console.log("entro en upgrade de laserShot " );
							switch (upgradeType.randomUpgrade[5]) {
								case "add":
									currentLevel.laserShot[propertyName] += upgradeType.randomUpgrade[0];
									break;
								case "substract":
									currentLevel.laserShot[propertyName] -= upgradeType.randomUpgrade[0];
									break;
								case "multiply":
									currentLevel.laserShot[propertyName] *= upgradeType.randomUpgrade[0];
									break;
								case "divide":
									currentLevel.laserShot[propertyName] /= upgradeType.randomUpgrade[0];
									break;
							}
							console.log("Property " + propertyName + " " + currentLevel.laserShot[propertyName]);
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
		

	}



	closeUpgradeSystem() {
		this.isUpgradeSelected = true;
        this.scene.scene.resume('Level');
		this.background.destroy(); // Destruir el rectángulo
		this.alpha = 0; // Ocultar el contenedor UpgradeSystemUI
		//this.destroy(); // Destruir el contenedor UpgradeSystemUI
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
