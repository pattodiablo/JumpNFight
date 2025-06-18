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
	public direction: number = 0; // Variable para controlar la dirección del selector

	/* START-USER-CODE */

	private canSelectUpgrade: boolean = false;
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

	public SawMissileDamage: Array<any> = [2,"SawPower","Player", 0,"SawMissileDamage","multiply", "Saw Damage"];
	public SawMissileVelocity: Array<any> = [300,"SawSpeed","Player", 0,"SawMissileVelocity","add", "Saw Missile Velocity"];
	public SawMissileInterval: Array<any> = [1000,"SawInterval","Player", 0,"LastSawMissileTime","substract", "Saw Interval"];
	public SawMissileSize: Array<any> = [1.5,"SawSize","Player", 0,"SawMissileSize","multiply", "Saw Size"];
	public SawMissileLifetime: Array<any> = [1500,"SawBouncingTime","Player", 0,"SawBulletLifeTime","add", "Saw Lifetime"];

	public Playerspeed: Array<any> = [300,"PlayerSpeed","Player", 0,"PlayerSpeed","add","Player speed"];
	public MagnetPower: Array<any> = [2,"MagnetPower","Player", 0,"AttractionRange","multiply","Magnet Power"];
	public AttractionSpeed: Array<any> = [1.5,"MagnetSpeed","Player", 0,"AttractionSpeed","multiply","Attraction Speed"];

	public ShieldLifeTime: Array<any> = [2000,"ShieldLife","Player", 0,"ShieldRestoreTime","substract","Shield Life Time"];
	public ShieldLife: Array<any> = [2,"ShieldLife","Player", 0,"ShieldLife","multiply","Shield Life"];

	public upgrades: Array<any> = [this.MissileVelocity, this.MissileSize, this.MissileDamage, this.MissileInterval,
		this.LaserDamage, this.LaserInterval, this.LaserVelocity,
		this.MineDamage, this.MineVelocity, this.MineInterval,
		this.RainDamage, this.RainVelocity, this.RainInterval,
		this.SawMissileDamage, this.SawMissileVelocity, this.SawMissileInterval, this.SawMissileSize, this.SawMissileLifetime,
		this.Playerspeed, this.MagnetPower, this.AttractionSpeed,
		this.ShieldLifeTime, this.ShieldLife];

	public optionPositions: Array<any> = [];
//	public upgrades: Array<any> = [this.MissileSize];	
	public AvailableUpgrades: Array<any> = [...this.upgrades];
	public isUpgradeSelected = false;
	public IsWindowActive = false;
	private keyboardListenerAdded: boolean = false;


        async showPokiAdAndPauseGame() {
            const poki = this.scene.plugins.get('poki');
            if (poki) {
                // Pausa el juego antes del anuncio
                this.scene.scene.pause(); // Pausa la escena actual
                (poki as any).gameplayStop();

                // Espera a que termine el comercial
                await (poki as any).commercialBreak();

                // Reanuda el juego después del anuncio
                (poki as any).gameplayStart();
                this.scene.scene.resume(); // Reanuda la escena actual
            }
        }
	
	create(){
	this.alpha = 0;
	this.IsWindowActive = false;
	}

	createUpgradeWindow() {
    this.showPokiAdAndPauseGame();
    this.canSelectUpgrade = false;
    this.AvailableUpgrades = [...this.upgrades];

    this.upgrade1.getRandomUpgrade(this.AvailableUpgrades);
    this.upgrade2.getRandomUpgrade(this.AvailableUpgrades);
    this.upgrade3.getRandomUpgrade(this.AvailableUpgrades);

    this.alpha = 1;
    this.IsWindowActive = true;
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

    // Detectar si es móvil
    const isMobile = this.scene.sys.game.device.os.android || this.scene.sys.game.device.os.iOS;
    const factor = this.scene.scale.height / this.scene.scale.width;

    // Ajustes para móvil
    let btnScale = factor;
    let upgradeScale = factor;
    let upgradeFontSize = 64 * factor;
    let btnYOffset = 0;
    let upgradeTextY = height - 40;
    let btnY = this.scene.scale.height / 2;

    if (isMobile) {
        btnScale =  0.4;
        upgradeScale = 0.4;
        upgradeFontSize = 40 * factor;
        btnYOffset = 10 * factor;
        upgradeTextY = height - 20 * factor;
        btnY = this.scene.scale.height / 2 + btnYOffset;
    }

    this.background = this.scene.add.rectangle(width / 2, this.scene.scale.height / 2, width, height, 0x000000, 0.8);
    this.background.setOrigin(0.5, 0.5);
    this.background.setDepth(-11);

    const buttonOriginalWidth = this.btn1.width;
    const numButtons = 3;
    const spacingRatio = 0.15;
    const totalSpacing = (numButtons + 1) * spacingRatio;
    const scaleRation = (width * (1 - totalSpacing)) / (numButtons * buttonOriginalWidth);

    this.btn1.scaleX = btnScale;
    this.btn1.scaleY = btnScale;
    this.btn2.scaleX = btnScale;
    this.btn2.scaleY = btnScale;
    this.btn3.scaleX = btnScale;
    this.btn3.scaleY = btnScale;

    const btnSpacing = (width / numButtons) + spacingRatio;
    this.btn1.setPosition(width / 2 - btnSpacing, btnY);
    this.btn2.setPosition(width / 2, btnY);
    this.btn3.setPosition(width / 2 + btnSpacing, btnY);
    this.btn1.setDepth(2);
    this.btn2.setDepth(2);
    this.btn3.setDepth(2);
	

    this.optionPositions = [];
    this.optionPositions.push({ posx: this.btn1.x, posy: this.btn1.y });
    this.optionPositions.push({ posx: this.btn2.x, posy: this.btn2.y });
    this.optionPositions.push({ posx: this.btn3.x, posy: this.btn3.y });

    // Coloca el selector en la opción inicial
    this.currentOption = 0;
    this.selector.setPosition(this.optionPositions[0].posx, this.optionPositions[0].posy);

    // Solo agrega el listener de teclado una vez
    if (!this.keyboardListenerAdded) {
      if (this.scene.input.keyboard) {
        this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
          if (!this.IsWindowActive || !this.canSelectUpgrade) return;
          if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
            this.moveSelector(1);
          } else if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
            this.moveSelector(-1);
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
      this.keyboardListenerAdded = true;
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
		const localFactor = this.scene.scale.height/this.scene.scale.width;
		this.upgrade1.x = this.btn1.x;
		this.upgrade1.y = this.btn1.y;	
		this.upgrade2.x = this.btn2.x;
		this.upgrade2.y = this.btn2.y;
		this.upgrade3.x = this.btn3.x;
		this.upgrade3.y = this.btn3.y;

		this.background.x = width + width / 2;

		this.btn1.y = btnY;
		this.btn2.y = btnY;
		this.btn3.y = btnY;

		this.btn1.setScale(btnScale);
		this.btn2.setScale(btnScale);
		this.btn3.setScale(btnScale);
		this.upgrade1.setScale(upgradeScale);
		this.upgrade2.setScale(upgradeScale);
		this.upgrade3.setScale(upgradeScale);

		// Agregar el texto "Upgrade" en el centro arriba de los botones
        const upgradeText = this.scene.add.text(width / 2, upgradeTextY, 'Upgrade', {
            fontFamily: 'Bahiana',
			fontSize: `${upgradeFontSize}px`,
            color: '#ffffff',
            fontStyle: 'bold'
        });
        upgradeText.setOrigin(0.5, 0.5);
		upgradeText.setScale(localFactor);
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
						 this.canSelectUpgrade = true; // <-- Habilita la selección aquí
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
		this.selector.setVisible(true); // Asegurarse de que el selector esté visible
		if(!this.IsWindowActive) return; // No hacer nada si la ventana no está activa
		this.direction = direction; // Update the direction variable
		// Update the current option index
		this.currentOption = (this.currentOption + this.direction + this.optionPositions.length) % this.optionPositions.length;
		// Move the selector to the new position
		
		this.selector.setPosition(this.optionPositions[this.currentOption].posx, this.optionPositions[this.currentOption].posy);
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
        if (!this.canSelectUpgrade) return;
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
							//console.log("Property " + propertyName + " " + currentLevel.player[propertyName]);
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
							//console.log("Property " + propertyName + " " + currentLevel.laserShot[propertyName]);
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
							//console.log("Property " + propertyName + " " + currentLevel.player[propertyName]);
						}else if (upgradeType.randomUpgrade[2] == "CollectableParticle") {
							switch (upgradeType.randomUpgrade[5]) {
								case "add":
									currentLevel.collectableParticle[propertyName] += upgradeType.randomUpgrade[0];
									break;
								case "substract":
									currentLevel.collectableParticle[propertyName] -= upgradeType.randomUpgrade[0];
									break;
								case "multiply":
									currentLevel.collectableParticle[propertyName] *= upgradeType.randomUpgrade[0];
									break;
								case "divide":
									currentLevel.collectableParticle[propertyName] /= upgradeType.randomUpgrade[0];
									break;
							}
							//console.log("Property " + propertyName + " " + currentLevel.collectableParticle[propertyName]);
						}
					}
	
	
				}
			});
		
		}
		

	}



	closeUpgradeSystem() {
		this.IsWindowActive = false;
		this.isUpgradeSelected = true;
        this.scene.scene.resume('Level');
		this.background.destroy(); // Destruir el rectángulo
		this.alpha = 0; // Ocultar el contenedor UpgradeSystemUI
		
		this.selector.setVisible(false); // Ocultar el selector


		//this.destroy(); // Destruir el contenedor UpgradeSystemUI
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
