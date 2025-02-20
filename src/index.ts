import Phaser from "phaser";
import GameUI from './scenes/GameUI';
import Level from "./scenes/Level";
import preloadAssetPackUrl from "../static/assets/preload-asset-pack.json";
import Preload from "./scenes/Preload";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
// @ts-ignore
import { PokiPlugin } from '@poki/phaser-3';


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

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
const isMobile = isMobileDevice();


function getDPI() {
    // Crear un elemento div temporal
    const div = document.createElement('div');
    div.style.width = '1in'; // Establecer el ancho del div a 1 pulgada
    div.style.height = '1in'; // Establecer la altura del div a 1 pulgada
    div.style.position = 'absolute';
    div.style.top = '-100%'; // Mover el div fuera de la pantalla
    document.body.appendChild(div);

    // Obtener el tamaño del div en píxeles
    const dpi = {
        x: div.offsetWidth,
        y: div.offsetHeight
    };

    // Eliminar el div temporal
    document.body.removeChild(div);

    return dpi;
}

const dpi = getDPI();
console.log(`DPI: ${dpi.x} x ${dpi.y}`);


window.addEventListener('load', function () {
	
	const game = new Phaser.Game({
       
		width: this.innerWidth,
		height: this.innerHeight,
		backgroundColor: "#e2e2e2",
		scale: {
			mode: Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
			autoCenter: Phaser.Scale.Center.CENTER_BOTH
		}, 
		plugins: { 
            global: [
                {
                  plugin: PokiPlugin,
                  key: 'poki',
                  start: true, // must be true, in order to load
                  data: {
                    // This must be the key/name of your loading scene
                    loadingSceneKey: 'Boot',
          
                    // This must be the key/name of your game (gameplay) scene
                    gameplaySceneKey: 'Level',
          
                    // This will always request a commercialBreak when gameplay starts,
                    // set to false to disable this behaviour (recommended to have true,
                    // see Poki SDK docs for more details).
                    autoCommercialBreak: false
                  }
                }
              ],
			scene: [{
				key: "spine.SpinePlugin",
				plugin: SpinePlugin,
				mapping: "spine"
			  }]
		  },
		
		scene: [Boot, Preload, Level, GameUI],
        input: {
            keyboard: true, // Asegúrate de que el sistema de teclado esté habilitado
            mouse: true,    // Asegúrate de que el sistema de ratón esté habilitado
            touch: {
                capture: true,
                
                // activePointers: 3 // Permitir hasta 3 punteros activos
            },    // Asegúrate de que el sistema de toque esté habilitado
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

   
});