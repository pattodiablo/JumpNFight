
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Upgrade extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		this.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// upgradeIcon
		const upgradeIcon = scene.add.image(0, -46, "BulletIcon");
		this.add(upgradeIcon);

		// UpgradeType
		const upgradeType = scene.add.text(0, 72, "", {});
		upgradeType.setOrigin(0.5, 0.5);
		upgradeType.text = "UpgradeType";
		upgradeType.setStyle({ "align": "right", "color": "#fffff", "fontFamily": "Arial", "fontSize": "30px" });
		this.add(upgradeType);

		// LevelText
		const levelText = scene.add.text(-16, 106, "", {});
		levelText.setOrigin(0.5, 0.5);
		levelText.text = "level";
		levelText.setStyle({ "align": "right", "color": "#fffff", "fontFamily": "Arial", "fontSize": "30px" });
		this.add(levelText);

		// LevelNumber
		const levelNumber = scene.add.text(23, 106, "", {});
		levelNumber.setOrigin(0, 0.5);
		levelNumber.text = "0";
		levelNumber.setStyle({ "align": "right", "color": "#fffff", "fontFamily": "Arial", "fontSize": "30px" });
		this.add(levelNumber);

		this.upgradeIcon = upgradeIcon;
		this.upgradeType = upgradeType;
		this.levelNumber = levelNumber;

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		/* END-USER-CTR-CODE */
	}

	private upgradeIcon: Phaser.GameObjects.Image;
	private upgradeType: Phaser.GameObjects.Text;
	private levelNumber: Phaser.GameObjects.Text;
	public randomUpgrade: any = [];

	/* START-USER-CODE */

	create(){
		this.getRandomUpgrade();
	}

	getRandomUpgrade(){
		const parentContainer = this.parentContainer as any;
		const upgrades = parentContainer.upgrades;

		if(upgrades != undefined){
			this.randomUpgrade = Phaser.Math.RND.pick(upgrades);
			this.upgradeIcon.setTexture(this.randomUpgrade[1] as string);
			this.upgradeType.text = this.randomUpgrade[4] as string;
			let LevelNumber = this.randomUpgrade[3] as number;
			LevelNumber++;
			this.levelNumber.text = LevelNumber.toString();
		}



	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
