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
  
    // ✅ Crear el div #animation_container dinámicamente
    let animationDiv = document.getElementById("animation_container");
    if (!animationDiv) {
      animationDiv = document.createElement("div");
      animationDiv.id = "animation_container";
      document.body.appendChild(animationDiv); // o colócalo donde lo necesites exactamente
    }
  
    // 👉 Cargar la intro animada
    /*
    fetch('MovieLoader.html')
      .then(res => res.text())
      .then(html => {
        const container = document.getElementById("animation_container");
        if (!container) return;
  
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
  
        const visualContent = Array.from(tempDiv.children).filter(el => el.tagName !== "SCRIPT");
        container.innerHTML = "";
        visualContent.forEach(el => container.appendChild(el));
  
        const scripts = tempDiv.querySelectorAll("script");
        scripts.forEach(oldScript => {
          const newScript = document.createElement("script");
          if (oldScript.src) {
            newScript.src = oldScript.src;
          } else {
            newScript.textContent = oldScript.textContent;
          }
          document.body.appendChild(newScript);
        });
  
        setTimeout(() => {
          if (typeof window.init === "function") {
            window.init(); // 👈 Llama a la función del MovieLoader
          
            const gameContainer = document.getElementById("game_canvas");
            console.log("Game container:", gameContainer);
            if (gameContainer) {
            gameContainer.style.display = "none";
            }
          } else {
            console.warn("init() no está definido todavía.");
          }
        }, 500);
      });*/
      initializeGame(); // 👈 Esto puede lanzarse luego si quieres mostrar el juego tras la intro
 
  };
  

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
        const canvas = this.sys.game.canvas;
        canvas.setAttribute("id", "game_canvas");
        
        console.log("Canvas renombrado dentro de Boot scene.");
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

function initializeGame() {

    
    const game = new CustomGameImpl({
      /*
        width: window.innerWidth,
		height:  window.innerHeight,
    */
       
        width: 1920,
		height: 1080,
        title: "Eggy Carton",
        type: Phaser.AUTO, 
		backgroundColor: "#e2e2e2",
		scale: {
			mode: Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
			autoCenter: Phaser.Scale.Center.CENTER_BOTH
		}, 
    fps: {
      target: 60,       // Objetivo de 60fps
      forceSetTimeOut: false // Asegura que use requestAnimationFrame, no setTimeout
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
		
		scene: [Boot, Preload, Level, GameUI, LevelPreloader],
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
            roundPixels: true, // Redondea las posiciones de los píxeles
          
        }
	});

    game.playerData = {
        
        isMobile: isMobile,
    
    }

    
   
}

// Initialize the game for the first time


// Export the function to be used in other files if needed
export { initializeGame };

