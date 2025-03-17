
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */

import LevelPack from "/static/assets/LevelPack.json";
//import LevelPack from "@/assets/LevelPack.json";
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

	this.load.pack("LevelPack", LevelPack);

	console.log(`Loading scene file from: ` + LevelPack);

	// Cargar la escena Level
	this.load.sceneFile("Level", LevelPack.Level.url);
	this.scene.manager.add("Level",{});
	// Agregar manejo de errores

	}
	create() {

		this.editorCreate();

		//var sceneToGo = this.scene.get("Level");
		//console.log(sceneToGo);
		const scenes = this.scene.manager.scenes;
        console.log("available scenes:");
        scenes.forEach(scene => {
            console.log(scene.scene.key);
        });
		this.scene.start("Level");	
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
