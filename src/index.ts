import Phaser from "phaser";
import GameUI from './scenes/GameUI';
import Level from "./scenes/Level";
import preloadAssetPackUrl from "../static/assets/preload-asset-pack.json";
import Preload from "./scenes/Preload";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
// @ts-ignore
import { PokiPlugin } from '@poki/phaser-3';
import WebFont from 'webfontloader';
WebFont.load({
    google: {
      families: ["Bahiana"],
    },
    active: () => {
      console.log('Fonts have been loaded');
    },
    inactive: () => {
      console.log('Fonts could not be loaded');
    },
    timeout: 2000 // Set the timeout to two seconds
  });
var renderer: string;

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

if(isMobile){
    const ancho = window.screen.width;
    const alto = window.screen.height;
    console.log("Mobile")

}

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



function getOS() {

	var userAgent = window.navigator.userAgent,
		platform = window.navigator.platform,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
		iosPlatforms = ['iPhone', 'iPad', 'iPod'],
		os = null;

	if (macosPlatforms.indexOf(platform) !== -1) {
		renderer = "Phaser.CANVAS";
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		renderer = "Phaser.CANVAS";
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		renderer = "Phaser.WEBGL";
	} else if (/Android/.test(userAgent)) {
		renderer = "Phaser.WEBGL";
	} else if (!os && /Linux/.test(platform)) {
		renderer = "Phaser.WEBGL";
	}

	return renderer;
}

getOS();



interface CustomGame extends Phaser.Game {
    playerData: {
        isMobile: boolean;
   
  
    };
}

class CustomGameImpl extends Phaser.Game implements CustomGame {
    playerData = {
        isMobile: false,
      
     
    };
}

window.addEventListener('load', function () {
    
    const game = new CustomGameImpl({
 
        width: window.innerWidth,
		height:  window.innerHeight,
        // width: 1920,
		// height: 1080,
           
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
                debug: true // Activa la depuración de colisiones
            }
        },
		render: {
            pixelArt: false, // Habilita el modo de pixel art
            antialias: true, // Desactiva el antialiasing
            roundPixels: true // Redondea las posiciones de los píxeles
        },
        //Mejorar rendimiento para otras computadoras limitando los FPS
        fps: {
            target: 60, // Configura el objetivo de FPS
            forceSetTimeOut: true // Fuerza el uso de setTimeout para controlar los FPS
        }
	});

    game.playerData = {
        
        isMobile: isMobile,
    
    }
   
});

