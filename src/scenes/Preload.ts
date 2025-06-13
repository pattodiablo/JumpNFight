// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import assetPackUrl from "../../static/assets/asset-pack.json";
/* END-USER-IMPORTS */

export default class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// Fondo negro que cubre toda la pantalla
		const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 1);
		bg.setOrigin(0, 0);

		// Dimensiones de la barra
		const barWidth = this.scale.width / 2;
		const barHeight = 32;
		const barX = (this.scale.width - barWidth) / 2;
		const barY = (this.scale.height - barHeight) / 2;

		// Barra de fondo (solo bordes, roja)
		const progressBarBg = this.add.graphics();
		progressBarBg.lineStyle(4, 0xff0000, 1);
		progressBarBg.strokeRect(barX, barY, barWidth, barHeight);

		// Barra de progreso (roja, relleno)
		const progressBar = this.add.graphics();
		this.progressBar = progressBar;
		this.progressBarX = barX;
		this.progressBarY = barY;
		this.progressBarWidth = barWidth;
		this.progressBarHeight = barHeight;

		// Texto centrado
		const loadingText = this.add.text(this.scale.width / 2, barY - 40, "Loading...", {
			color: "#ff0000",
			fontFamily: "arial",
			fontSize: "24px"
		});
		loadingText.setOrigin(0.5, 0.5);

		this.events.emit("scene-awake");
	}

	private progressBar!: Phaser.GameObjects.Graphics;
	private progressBarX!: number;
	private progressBarY!: number;
	private progressBarWidth!: number;
	private progressBarHeight!: number;

	/* START-USER-CODE */

	// Write your code here

	preload() {

		this.editorCreate();

		this.load.pack("asset-pack", assetPackUrl);

		this.load.on("progress", (value: number) => {
			this.progressBar.clear();
			this.progressBar.fillStyle(0xff0000, 1);
			this.progressBar.fillRect(
				this.progressBarX,
				this.progressBarY,
				this.progressBarWidth * value,
				this.progressBarHeight
			);
		});
	}

	create() {

		if (process.env.NODE_ENV === "development") {

			const start = new URLSearchParams(location.search).get("start");

			if (start) {

				console.log(`Development: jump to ${start}`);
			

				    const poki = this.plugins.get('poki');
				(poki as any).gameLoadingFinished();
			

				return;
			}
		}

		this.scene.start("Level");
		this.scene.start("GameUI");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
