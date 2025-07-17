import Phaser from "phaser";
import GameUI from './scenes/GameUI';
import Level from "./scenes/Level";
import LevelPreloader from "./scenes/LevelPreloader";
import preloadAssetPackUrl from "../static/assets/preload-asset-pack.json";
import Preload from "./scenes/Preload";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
// @ts-ignore
import { PokiPlugin } from '@poki/phaser-3';
import WebFont from 'webfontloader';



// Extend the Window interface to include the 'init' property
declare global {
    interface Window {
        init?: () => void;
    }
}

window.onload = () => {
    console.log("Loading game...");
  
      initializeGame(); // 👈 Esto puede lanzarse luego si quieres mostrar el juego tras la intro
 
  };
  function loadLocalFont(fontName: string, fontUrl: string): Promise<void> {
    // @ts-ignore
    if (document.fonts && window.FontFace) {
        const font = new FontFace(fontName, `url(${fontUrl})`);
        return font.load().then((loadedFont: FontFace) => {
            // @ts-ignore
            document.fonts.add(loadedFont);
        });
    } else {
        // fallback: inject CSS
        const style = document.createElement('style');
        style.innerHTML = `
        @font-face {
            font-family: '${fontName}';
            src: url('${fontUrl}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }`;
        document.head.appendChild(style);
        return Promise.resolve();
    }
}

window.onload = () => {
    console.log("Loading game...");
    loadLocalFont("Bahiana", "fonts/Bahiana-Regular.ttf").then(() => {
        console.log("Local font loaded");
        initializeGame();
    });
};


var renderer: string;

class Boot extends Phaser.Scene {

    constructor() {
        super("Boot");
    }

    preload() {

        this.load.pack("pack", preloadAssetPackUrl);
    }

    create() {
           if (document.fullscreenElement) {
        document.exitFullscreen();
    }

        let canvas = document.getElementById("game_canvas") as HTMLCanvasElement | null;
            if (!canvas) {
                canvas = this.sys.game.canvas;
                canvas.setAttribute("id", "game_canvas");
                 console.log("Canvas renombrado dentro de Boot scene.");
            }

        // canvas.style.display = "none";

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
    div.style.width = '0in'; // Establecer el ancho del div a 1 pulgada
    div.style.height = '0in'; // Establecer la altura del div a 1 pulgada
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

function initializeGame() {
    // Detecta si es móvil
    const isMobile = isMobileDevice();

    // Define el tamaño según el dispositivo
    const width = isMobile ? 640 : 1031;
    const height = isMobile ? 360 : 580;

    const game = new CustomGameImpl({
        width,
        height,
        title: "Eggy Carton",
        type: Phaser.WEBGL, 
        backgroundColor: "#e2e2e2",
        scale: {
            mode: Phaser.Scale.ScaleModes.FIT,
            autoCenter: Phaser.Scale.Center.CENTER_BOTH
        }, 
        fps: {
            target: 30,
            forceSetTimeOut: false
        },
        plugins: { 
            global: [
                {
                    plugin: PokiPlugin,
                    key: 'poki',
                    start: true,
                    data: {
                        loadingSceneKey: 'Preload',
                        gameplaySceneKey: 'Level',
                        autoCommercialBreak: true
                    }
                }
            ],
            scene: [{
                key: "spine.SpinePlugin",
                plugin: SpinePlugin,
                mapping: "spine"
            }]
        },
        scene: [Boot, Preload, Level, GameUI, LevelPreloader],
        input: {
            keyboard: true,
            mouse: true,
            touch: { capture: true },
            gamepad: true
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { x:0, y: 300 },
                debug: false,
                fps: 60,
                timeScale: 1
            }
        },
        render: {
            pixelArt: false,
            antialias: true,
            powerPreference: "high-performance",
            clearBeforeRender: true
        }
    });

    game.playerData = {
        isMobile: isMobile,
    }
}

// Initialize the game for the first time


// Export the function to be used in other files if needed
export { initializeGame };

