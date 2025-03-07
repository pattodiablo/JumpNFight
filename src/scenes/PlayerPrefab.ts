// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
import { PhaserScene } from "~/presentation/phaser/models/PhaserScene";
import { ColoredBulletBuilder, TexturedBulletBuilder } from "~/presentation/phaser/builders";
import { Graphic, Sprite } from "~/presentation";

/* END-USER-IMPORTS */

export default class PlayerPrefab extends SpineGameObject {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, boundsProvider?: SpineGameObjectBoundsProvider) {
		super(scene, plugin, x ?? 210, y ?? 7, "Player", "Player-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider("Idle", ["default"]));

		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 100, 600), Phaser.Geom.Rectangle.Contains);
		this.skeleton.setSkinByName("default");
		this.scaleX = 0.5;
		this.scaleY = 0.5;

		/* START-USER-CTR-CODE */
		this.setOrigin(0.5, 0.5);
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this.scene.events.on("update", (time: number, delta: number) => this.updatePlayer(delta));
	//	this.scene.input.on('pointermove', () => this.resetMouseInactiveTimer());
		/* END-USER-CTR-CODE */
	}

	public PlayerSpeed: number = 1400;
	public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	public currentAnimation: string = "Idle";
	public facingLeft: boolean = false;
	public isJumping: boolean = false;
	public fallMultiplier: number = 3.5;
	public playerGravity: number = 2500;
	public JumpVelocity: number = 1800;
	public IsFalling: boolean = false;
	public mouseInactiveTimer: number = 0;
	public mouseInactiveThreshold: number = 500;
	public hasDoubleJumped: boolean = false;
	public lastShotTime: number = 2000;
	public lastShotTimeMissile: number = 2000;
	public shotInterval: number = 250;
	public laserColor: string = "FF0000";
	public laserSpeed: number = 3000;
	public laserDuration: number = 500;
	public isInAir: boolean = false;
	public TouchX: number = 0;
	public TouchY: number = 0;
	public TouchJump: boolean = false;
	public factor: number = 0.5;
	public collectedParticles: number = 0;
	public IsRolling: boolean = false;
	public IsFallingAfterCannon: boolean = false;
	public CannonVelo: number = 8000;

	/* START-USER-CODE */
	public MissileSize: number = 100;
	private _graphics: Phaser.GameObjects.Graphics = this.scene.add.graphics();

	create(){

		this.factor = this.scene.scale.height / this.scene.scale.width;
		this.flipX = true; // Flip horizontal

		this.scene.physics.add.existing(this);
        const playerBody = this.body as Phaser.Physics.Arcade.Body;

        playerBody.setCollideWorldBounds(false);
        playerBody.setGravityY(this.playerGravity); // Configura la gravedad para el jugador

		    // Ajustar el tamaño y la forma del cuerpo de colisión del jugador
			playerBody.setSize(400, 400); // Ajustar el tamaño del cuerpo de colisión
			playerBody.setOffset(140, 210); // Ajustar la posición del cuerpo de colisión


		if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            this.scene.input.keyboard.addKeys({
                A: Phaser.Input.Keyboard.KeyCodes.A,
                D: Phaser.Input.Keyboard.KeyCodes.D,
				W: Phaser.Input.Keyboard.KeyCodes.W,
				S: Phaser.Input.Keyboard.KeyCodes.S,
                SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
            });
        }

		       // Reproduce la animación 'Idle' por defecto
			   this.setAnimation("Idle", true);


			       // Escuchar eventos del joystick
				   const gameUIScene = this.scene.scene.get('GameUI') as Phaser.Scene;
				   gameUIScene.events.on('joystickMove', this.handleJoystickMove, this);

				   gameUIScene.events.on('jump', this.handleJump, this);
	}

	hideAndRoll(x:number,Y:number){
		if(!this.IsRolling){

			this.IsRolling = true;
			this.setAnimation("Roll", true);
			const playerBody = this.body as Phaser.Physics.Arcade.Body;
			playerBody.setEnable(false);
			this.x = x;	// Mover el cañón a la posición del jugador
			this.y = Y;	// Mover el cañón a la posición del jugador
			this.scene.time.delayedCall(500, () => {
				this.scene.cameras.main.shake(900, 0.1); // Duración de 500ms y intensidad de 0.1
				const LaunchPartciles =  this.scene.add.particles(0, 0, 'particleImage', {
					x: this.x,
					y: this.y,
					speed: { min: 3000, max: 12000 },
					angle: { min: -20, max: -50 },
					lifespan: { min: 30, max: 4000 },
					scale: { start:0, end:  Phaser.Math.Between(1, 8) }, // Tamaño inicial aleatorio
					quantity: 30,
					maxParticles: 30,
					frequency: 100,
					gravityY: 3000

				});

			});
			this.scene.time.delayedCall(1000, () => {

				this.IsRolling = false;
				playerBody.setEnable(true);
				this.IsFallingAfterCannon = true;
				const velocity = this.CannonVelo; // Velocidad del proyectil
                const angle = Phaser.Math.DegToRad(30); // Convertir 45 grados a radianes
              	const xAngle = Math.cos(angle);
				const yAngle = Math.sin(angle);
				playerBody.setVelocity(xAngle * velocity, -yAngle * velocity);




			});
		}

	}

	handleJump(isJumping: boolean) {

		this.TouchJump = isJumping;
	}

	handleJoystickMove(direction: { x: number, y: number }) {
        const playerBody = this.body as Phaser.Physics.Arcade.Body;

		if (direction.x > 0) {
			this.TouchX=1;
		} else if (direction.x < 0) {
			this.TouchX=-1;
		} else {
			this.TouchX=0;
		}

		if(direction.y>0.9){
			this.TouchY=1;
			console.log("abajo");
		}else if (direction.y < 0) {
			this.TouchY=-1;
		} else {
			this.TouchY=0;
		}
    }



	setAnimation(animationName: string, loop: boolean) {
        this.animationState.setAnimation(0, animationName, loop);
    }

    resetMouseInactiveTimer() {
        this.mouseInactiveTimer = 0;
    }

	scanAndDestroy() {
		const enemies = (this.scene as any).enemies.getChildren(); // Obtener la lista de enemigos

		enemies.forEach((enemy: Phaser.GameObjects.Sprite) => {

			if((enemy as any).IsNearPlayer){

				// Cast ray
				this.castRay(enemy);

				if (this.scene.time.now > this.lastShotTimeMissile + 1000) {

					this.createLaserParticles();

					// Shoot misile
					this.scene.time.delayedCall(100, () => {
						this.shootMisile(enemy);
					});

					this.lastShotTimeMissile = this.scene.time.now;
				}

				if (this.scene.time.now > this.lastShotTime + this.shotInterval) {

					this.createLaserParticles();

					// Shoot bullet
					this.scene.time.delayedCall(100, () => {
						this.shootBullet(enemy);
					});

					this.lastShotTime = this.scene.time.now;
				}

			} else {
				this._graphics.clear();	// Borra el rayo
			}
			
		});
	}

	castRay(enemy: Phaser.GameObjects.Sprite) {

		this._graphics.clear();
		this._graphics.lineStyle(4, 0xff0000, 1);
        this._graphics.strokeLineShape(new Phaser.Geom.Line(this.x, this.y, enemy.x, enemy.y));
	}

	shootMisile(enemy: Phaser.GameObjects.Sprite) {

		const missile: Sprite = new TexturedBulletBuilder(this.scene as PhaserScene)
			.setOrigin({ x:this.x, y:this.y })
			.setTextureKey("missile")
			.setSize({ width: this.MissileSize, height: this.MissileSize })
			.setAcceleration({ magnitude: 3000, initialSpeed: -100 })
			.setTarget({ x:enemy.x, y:enemy.y })
			.hasGravity(true)
			.build();

		// Duración
		this.scene.time.addEvent({
			delay: 10000,
			callback: () => {
				missile.destroy();
			}
		});

		// Colisión
		const enemies = (this.scene as any).enemies.getChildren(); // Obtener la lista de enemigos

		enemies.forEach((enemy: Phaser.GameObjects.GameObject) => {

			if((enemy as any).IsNearPlayer){
				this.scene.physics.add.overlap(missile, enemy, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
			}
		});

		(this.scene as PhaserScene).addGameObject(missile);
	}

	shootBullet(enemy: Phaser.GameObjects.Sprite) {

		const bullet: Graphic = new ColoredBulletBuilder(this.scene as PhaserScene)
			.setOrigin({ x:this.x, y:this.y })
			.setColor(Phaser.Display.Color.HexStringToColor("F100FF").color)
			.setSize({ width: 200, height: 50 })
			.setAcceleration({ magnitude: 9000, initialSpeed: 1000 })
			.setTarget({ x:enemy.x, y:enemy.y })
			.hasGravity(true)
			.build();
		
		(this.scene as PhaserScene).addGameObject(bullet);
	}

	handleLaserCollision(laser: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {


		(enemy as any).EnemyLife -= 1;


		const bloodParticles =  this.scene.add.particles(0, 0, 'particleImage', {
			x: (laser as Phaser.GameObjects.Ellipse).x,
			y: (laser as Phaser.GameObjects.Ellipse).y,
			speed: { min: -1000, max: 1000 },
			angle: { min: 0, max: 360 },
			lifespan: { min: 30, max: 500 },
			scale: { start: 2, end: 0 },
			quantity: 5,
			maxParticles: 5,
			frequency: 100,
			gravityY: 3000

		});

		bloodParticles.setDepth(1);
			// Detener el sistema de partículas después de un tiempo y luego destruirlo
			this.scene.time.delayedCall(500, function() {
				bloodParticles.stop();
				bloodParticles.destroy();
			}, [], this);
			laser.destroy(); // Destruir el láser al colisionar con el jugador
		// Aquí puedes agregar lógica adicional, como reducir la salud del jugador
	}

	createLaserParticles() {

		const appearParicles =  this.scene.add.particles(0, 0, 'particleImage', {
			x: this.x,
			y: this.y,
			speed: { min: -30, max: 30 },
			angle: { min: 0, max: 360 },
			lifespan: { min: 30, max: 200 },
			scale: { start: 1, end: 0 },
			quantity: 1,
			maxParticles: 10,
			frequency: 10,

		});

		appearParicles.setDepth(1);
			// Detener el sistema de partículas después de un tiempo y luego destruirlo
			this.scene.time.delayedCall(500, function() {
				appearParicles.stop();
				appearParicles.destroy();
			}, [], this);
	}


    updatePlayer(delta: number) {

		this.scanAndDestroy();
		const cursors = this.cursors;
		let newAnimation = this.currentAnimation;

		if (this.scene.input.keyboard) {
            const playerBody = this.body as Phaser.Physics.Arcade.Body;

			 // Verificar si se presiona la tecla S o la tecla hacia abajo para activar HyperFall
			 if (this.isInAir && (cursors.down.isDown || this.scene.input.keyboard.keys[83].isDown || this.TouchY==1)&&playerBody.velocity.y > 0) {
				playerBody.setVelocityY(this.JumpVelocity * 3); // Aumentar la velocidad de caída
				newAnimation = "HyperFall"; // Cambiar a la animación de HyperFall
			}

            if (cursors.left.isDown || this.scene.input.keyboard.keys[65].isDown || this.TouchX==-1) {
                // Mover a la izquierda
                playerBody.setVelocityX(Phaser.Math.Linear(playerBody.velocity.x, -this.PlayerSpeed, 0.3));
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
            } else if (cursors.right.isDown || this.scene.input.keyboard.keys[68].isDown || this.TouchX==1) {
                // Mover a la derecha
				playerBody.setVelocityX(Phaser.Math.Linear(playerBody.velocity.x, this.PlayerSpeed, 0.3));
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
			  if ((cursors.up.isDown || this.scene.input.keyboard.keys[87].isDown || this.scene.input.keyboard.keys[32].isDown) || this.TouchJump) {
                if (!this.isJumping) {
                    playerBody.setVelocityY(-this.JumpVelocity); // Aplicar fuerza de impulso para saltar
                    this.isJumping = true;
					this.isInAir = true;
                    newAnimation = "Jump"; // Cambiar a la animación de salto
                } else if (this.isJumping && !this.hasDoubleJumped && playerBody.velocity.y > 0) {
                    playerBody.setVelocityY(-this.JumpVelocity); // Aplicar fuerza de impulso para el doble salto
                    this.hasDoubleJumped = true;
                    newAnimation = "Roll"; // Cambiar a la animación de Roll

					const camera = this.scene.cameras.main;
                camera.zoomTo(this.factor/2.5, 500); // Alejar la cámara en 500ms
                this.scene.time.delayedCall(1000, () => {
                    camera.zoomTo(this.factor/2, 500); // Volver el zoom a la normalidad en 500ms después de 1000ms
                });


                }
            }



			 // Aplicar velocidad de caída aumentada
				 if (playerBody.velocity.y > 0) {
					this.IsFalling = true;
					newAnimation = "Falling";
					playerBody.setGravityY(this.playerGravity * this.fallMultiplier);
					if(this.IsFallingAfterCannon){
						this.IsFallingAfterCannon = false;
						this.createalandingPlatform();
					}
				} else {
					playerBody.setGravityY(this.playerGravity);
				}

            // Verificar si el jugador ha aterrizado
            if (playerBody.blocked.down) {
                this.isJumping = false;
				this.hasDoubleJumped = false; // Resetear el doble salto al aterrizar
				this.isInAir = false; // Resetear el estado de estar en el aire al aterrizar
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

	//	this.ArmsFollowMouse(this, this.scene.input.mousePointer);

		this.update(delta);
	}

	createalandingPlatform(){
		if (this.scene.add) {
			console.log("Create Landing Platform");
			const floor = this.scene.add.rectangle(this.x, this.scene.scale.height-1200, this.scene.scale.width+15000, 500, 0x000000);
			floor.setOrigin(0,0.5);
			this.scene.physics.add.existing(floor, true);
			 // Agregar colisión entre el jugador y el suelo
			 this.scene.physics.add.collider(this, floor);


		}

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


	public setCollectParticles(particleValue:number) {
		this.collectedParticles=particleValue;
	}

	public collectParticle(particleValue:number) {
        this.collectedParticles+=particleValue;
		this.scene.events.emit('particleCollected', particleValue);
    }

	public getCollectedParticles(): number {
        return this.collectedParticles;
    }


    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
