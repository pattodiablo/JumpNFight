declare var lib: any; // Adobe Animate genera una var global `lib`

export class IntroManager {
  private canvas: HTMLCanvasElement;
  private stage!: createjs.Stage;
  private exportRoot: any;
  private onFinish: () => void;

  constructor(onFinish: () => void) {
    this.canvas = document.getElementById("animation_canvas") as HTMLCanvasElement;
    this.onFinish = onFinish;
  }

  public start(): void {
    this.exportRoot = new lib.IntroAnimation(); // Asegúrate que este nombre coincida
    this.stage = new createjs.Stage(this.canvas);
    this.stage.addChild(this.exportRoot);
    createjs.Ticker.framerate = 24;
    createjs.Ticker.addEventListener("tick", this.stage);
    // Termina la intro después de cierto tiempo
    setTimeout(() => this.end(), 6000); // o lo que dure tu animación
  }

  private end(): void {
    createjs.Ticker.removeAllEventListeners();
    this.stage.removeAllChildren();
    const introContainer = document.getElementById("intro-container");
    if (introContainer) introContainer.style.display = "none";
    this.onFinish();
  }
}
