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
		width: 1920,
		height: 1080,
		backgroundColor: "#e2e2e2",
		scale: {
			mode: Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
			autoCenter: Phaser.Scale.Center.CENTER_BOTH
		}, 
		plugins: {
			scene: [{
				key: "spine.SpinePlugin",
				plugin: SpinePlugin,
				mapping: "spine"
			  }]
		  },
		
		scene: [Boot, Preload, Level],
        input: {
            keyboard: true, // Asegúrate de que el sistema de teclado esté habilitado
            mouse: true,    // Asegúrate de que el sistema de ratón esté habilitado
            touch: true,    // Asegúrate de que el sistema de toque esté habilitado
            gamepad: true   // Asegúrate de que el sistema de gamepad esté habilitado
        },
		physics: {
            default: 'arcade',
            arcade: {
                gravity: { x:0,y: 300 }, // Configura la gravedad en el eje Y
                debug: false // Activa la depuración de colisiones
            }
        },
		render: {
            pixelArt: false, // Habilita el modo de pixel art
            antialias: true, // Desactiva el antialiasing
            roundPixels: true // Redondea las posiciones de los píxeles
        }
	});

	game.scene.start("Boot");
});