// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class AlertLabel extends Phaser.GameObjects.Image {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string, offsetX?: number, offsetY?: number) {
		super(scene, x ?? 0, y ?? 0, texture || "AlertImg", frame);

		/* START-USER-CTR-CODE */
        if (offsetX !== undefined) this.offsetX = offsetX;
        if (offsetY !== undefined) this.offsetY = offsetY;
        this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
        this.scene.events.on("update", this.update, this);
        /* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */
    private blinkCount: number = 0;
    private maxBlinks: number = 12; // Número de parpadeos (on/off)
    private blinkInterval: number = 150; // ms entre parpadeos
    private followingPlayer: boolean = true;
    private blinkEvent?: Phaser.Time.TimerEvent;

    private offsetX: number = 120;
    private offsetY: number = 200;

    create() {
        this.startBlink();
    }

    startBlink() {
        this.blinkCount = 0;
        this.setVisible(true);
              this.blinkEvent =   this.scene.time.addEvent({
            delay: this.blinkInterval,
            repeat: this.maxBlinks * 2 - 1, // on/off por blink
            callback: () => {
                this.setVisible(!this.visible);
                this.blinkCount++;
                if (this.blinkCount >= this.maxBlinks * 2) {
                    if (this.blinkEvent) {
                        this.blinkEvent.remove(false);
                    }
                    this.destroy();
                }
            }
        });
    }

    update(_: number, delta: number) {	
        if (!this.followingPlayer) return;
        const sceneAny = this.scene as any;
        const player = sceneAny && sceneAny.player;
        if (player && player.x !== undefined && player.y !== undefined) {
            // Lerp para suavizar el seguimiento con offset configurable
            this.x += ((player.x + this.offsetX) - this.x) * Math.min(1, delta / 200);
            this.y += ((player.y + this.offsetY - (player.height ? player.height / 2 : 0)) - this.y) * Math.min(1, delta / 200);
        }
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
