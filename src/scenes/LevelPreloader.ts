// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */

import LevelPack from "/static/assets/LevelPack.json";
//import LevelPack from "@/assets/LevelPack.json";
import { initializeGame } from "../index"; // Adjust the path as necessary
/* END-USER-IMPORTS */

export default class LevelPreloader extends Phaser.Scene {

	constructor() {
		super("LevelPreloader");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here
	preload() {
		console.log("Preloader cargando");

		//this.load.pack("LevelPack", LevelPack);

		// Cargar la escena Level
		//this.load.sceneFile("Level", "/src/scenes/Level.js");
		
		//this.scene.manager.add("Level",{});
		// Agregar manejo de errores
	}
	create() {

		this.editorCreate();


		// Restart the entire game
		this.restartGame();
	
	}

	restartGame() {
		console.log("Restarting game...");

		// Destroy the current game instance
		this.game.destroy(true);

		 // Reinitialize the game
		initializeGame();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
