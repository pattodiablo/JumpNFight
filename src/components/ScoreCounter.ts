// You can write more code here

/* START OF COMPILED CODE */


/* START-USER-IMPORTS */

/* END-USER-IMPORTS */
export default class ScoreCounter {
    private text: Phaser.GameObjects.Text;
    private initialX: number = 0; // Posición inicial del jugador en X
    private scaleFactor: number = 0.1; // Factor de conversión de píxeles a metros
    private maxMeters: number = 1; // Máxima distancia alcanzada en metros

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.text = scene.add.text(x, y, "Metros: 1", {
            fontSize: "30px", 
            fontFamily: "Bahiana", 
            color: "#000000", 
            fontStyle: "bold", 
        });
    }

    // Establece la posición inicial del jugador
    public setInitialX(startX: number) {
        this.initialX = startX;
    }

    // Permite cambiar el factor de conversión de píxeles a metros
    public setScaleFactor(factor: number) {
        this.scaleFactor = factor;
    }

    public update(playerX: number) {
        // Calcula la distancia recorrida en metros
        const distance = Math.floor((playerX - this.initialX) * this.scaleFactor) + 1;

        // Si el jugador se mueve hacia atrás, mantenemos el valor máximo alcanzado
        this.maxMeters = Math.max(this.maxMeters, distance);

        this.text.setText(`Metros: ${this.maxMeters}`);
    }
}
/* END OF COMPILED CODE */
/*
// Actualizar la puntuación con la posición X del jugador
     this.scoreCounter.update(this.player.x);
     console.log(this.player.x);
*/