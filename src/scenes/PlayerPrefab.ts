// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PlayerPrefab extends SpineGameObject {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, boundsProvider?: SpineGameObjectBoundsProvider) {
		super(scene, plugin, x ?? 0, y ?? 0, "Player", "Player-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider("Idle", ["default"]));

		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 0, 0), Phaser.Geom.Rectangle.Contains);
		this.skeleton.setSkinByName("default");
		this.scaleX = 0.15;
		this.scaleY = 0.15;

		/* START-USER-CTR-CODE */
		this.setOrigin(0.5, 0.5);
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this.scene.events.on("update", (time: number, delta: number) => this.updatePlayer(delta));
		this.scene.input.on('pointermove', () => this.resetMouseInactiveTimer());
		/* END-USER-CTR-CODE */
	}

	public PlayerSpeed: number = 400;
	public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	public currentAnimation: string = "Idle";
	public facingLeft: boolean = false;
	public isJumping: boolean = false;
	public fallMultiplier: number = 3.5;
	public playerGravity: number = 1500;
	public JumpVelocity: number = 1000;
	public IsFalling: boolean = false;
	public mouseInactiveTimer: number = 0;
	public mouseInactiveThreshold: number = 500;

	/* START-USER-CODE */
	create(){
		this.flipX = true; // Flip horizontal

		this.scene.physics.add.existing(this);
        const playerBody = this.body as Phaser.Physics.Arcade.Body;

        playerBody.setCollideWorldBounds(false);
        playerBody.setGravityY(this.playerGravity); // Configura la gravedad para el jugador

		if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            this.scene.input.keyboard.addKeys({
                A: Phaser.Input.Keyboard.KeyCodes.A,
                D: Phaser.Input.Keyboard.KeyCodes.D,
				W: Phaser.Input.Keyboard.KeyCodes.W,
                SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
            });
        }

		       // Reproduce la animación 'Idle' por defecto
			   this.setAnimation("Idle", true);
	}

	setAnimation(animationName: string, loop: boolean) {
        this.animationState.setAnimation(0, animationName, loop);
    }

    resetMouseInactiveTimer() {
        this.mouseInactiveTimer = 0;
    }

    updatePlayer(delta: number) {

		const cursors = this.cursors;
		let newAnimation = this.currentAnimation;

		if (this.scene.input.keyboard) {
            const playerBody = this.body as Phaser.Physics.Arcade.Body;

            if (cursors.left.isDown || this.scene.input.keyboard.keys[65].isDown) {
                // Mover a la izquierda
                playerBody.setVelocityX(-this.PlayerSpeed);
				if (!this.facingLeft) {
					this.skeleton.scaleX=-1;
                    this.facingLeft = true;
                }
				if (!this.isJumping) {
					if (this.mouseInactiveTimer <= this.mouseInactiveThreshold) {
                    newAnimation = "RundAndGun";
					}else{
						newAnimation = "Run";
                	}
				}
            } else if (cursors.right.isDown || this.scene.input.keyboard.keys[68].isDown) {
                // Mover a la derecha
                playerBody.setVelocityX(this.PlayerSpeed);
				if (this.facingLeft) {
					this.skeleton.scaleX=1;
                    this.facingLeft = false;
                }
				if (!this.isJumping) {

					if (this.mouseInactiveTimer <= this.mouseInactiveThreshold) {
					newAnimation = "RundAndGun";
					}else{
						newAnimation = "Run";
					}
                }
            } else {
                // Detener animación
				if(!this.isJumping){
					playerBody.setVelocityX(0);
					newAnimation = "IdleGun";

				}
            }

			 // Verificar si se presiona la tecla W o la barra espaciadora para saltar
			 if ((cursors.up.isDown || this.scene.input.keyboard.keys[87].isDown || this.scene.input.keyboard.keys[32].isDown) && !this.isJumping) {
                playerBody.setVelocityY(-this.JumpVelocity); // Aplicar fuerza de impulso para saltar
                this.isJumping = true;

                newAnimation = "Jump"; // Cambiar a la animación de salto
            }

			 // Aplicar velocidad de caída aumentada
				 if (playerBody.velocity.y > 0) {
					this.IsFalling = true;
					newAnimation = "Falling";
					playerBody.setGravityY(this.playerGravity * this.fallMultiplier);
				} else {
					playerBody.setGravityY(this.playerGravity);
				}

            // Verificar si el jugador ha aterrizado
            if (playerBody.blocked.down) {
                this.isJumping = false;
				this.IsFalling = false;
            }

			   // Incrementar el temporizador de inactividad del mouse
			   this.mouseInactiveTimer += delta;

        }

		if (this.mouseInactiveTimer > this.mouseInactiveThreshold && newAnimation === "IdleGun") {
            newAnimation = "Idle";
        }

		// Cambiar la animación solo si es diferente a la actual
        if (newAnimation !== this.currentAnimation) {
            this.animationState.setAnimation(0, newAnimation, newAnimation !== "Jump" && newAnimation !== "Falling");
            this.currentAnimation = newAnimation;
        }

		this.ArmsFollowMouse(this, this.scene.input.mousePointer);

		this.update(delta);
	}

	ArmsFollowMouse(p0: this, mouse: Phaser.Input.Pointer) {
        // Solo seguir el mouse si está activo
        if (this.mouseInactiveTimer <= this.mouseInactiveThreshold) {
            const camera = this.scene.cameras.main;
            const mouseWorldX = mouse.worldX;
            const mouseWorldY = mouse.worldY;
            const playerWorldX = this.x;
            const playerWorldY = this.y;

            const angle = Phaser.Math.Angle.Between(playerWorldX, playerWorldY, mouseWorldX, mouseWorldY);

            const RigthArm = this.skeleton.findBone("RigthArm");
            const LeftArm = this.skeleton.findBone("LeftArm");

            if (RigthArm && !this.isJumping) {
                RigthArm.rotateWorld(Phaser.Math.RadToDeg(angle) + 90);
            }
            if (LeftArm && !this.isJumping) {
                LeftArm.rotateWorld(Phaser.Math.RadToDeg(angle) + 90);
            }
        }
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
