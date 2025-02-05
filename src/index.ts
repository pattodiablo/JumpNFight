import Phaser from "phaser";
import Level from "./scenes/Level";
import preloadAssetPackUrl from "../static/assets/preload-asset-pack.json";
import Preload from "./scenes/Preload";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";

class Boot extends Phaser.Scene {

    constructor() {
        super("Boot");
    }

    preload() {

        this.load.pack("pack", preloadAssetPackUrl);
    }

    create() {

       this.scene.start("Preload");
    }
}

window.addEventListener('load', function () {
	
	const game = new Phaser.Game({
		width: this.window.innerWidth,
		height: this.window.innerHeight,
		backgroundColor: "#2A7FDB",
		scale: {
			mode: Phaser.Scale.ScaleModes.WIDTH_CONTROLS_HEIGHT,
			autoCenter: Phaser.Scale.Center.CENTER_BOTH
		}, 
		plugins: {
			scene: [{
				key: "spine.SpinePlugin",
				plugin: SpinePlugin,
				mapping: "spine"
			  }]
		  },
		
		scene: [Boot, Preload, Level]
	});

	game.scene.start("Boot");
});