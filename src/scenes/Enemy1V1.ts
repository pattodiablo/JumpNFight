// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
/* START-USER-IMPORTS */
import CollectableParticle from "./CollectableParticle";
declare global {
	namespace Phaser {
		interface Scene {
			enemies: Phaser.GameObjects.Group;
		}
	}
}


/* END-USER-IMPORTS */

export default class Enemy1V1 extends SpineGameObject {
	timers: Phaser.Time.TimerEvent[] = [];
	private _updateListener: (time: number,
		/* START OF COMPILED CODE */
		delta: number) => void;
	/**
	 * @param scene The scene to which this GameObject belongs.
	 * @param plugin The SpinePlugin instance.
	 * @param x The x coordinate of the GameObject.
	 * @param y The y coordinate of the GameObject.
	 * @param EnemyName The name of the enemy.
	 * @param Enemyatlas The atlas name for the enemy.
	 * @param boundsProvider Optional bounds provider for the GameObject.
	 */

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, EnemyName:string, Enemyatlas:string, boundsProvider?: SpineGameObjectBoundsProvider) {
	
		super(scene, plugin, x ?? 0, y ?? 0, EnemyName, Enemyatlas, boundsProvider ?? new SkinsAndAnimationBoundsProvider(null, ["default"]));

		this.blendMode = Phaser.BlendModes.SKIP_CHECK;
		this.skeleton.setSkinByName("default");

		/* START-USER-CTR-CODE */
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.create, this);
		this._updateListener = (time: number, delta: number) => this.updateEnemy(delta);
		this.scene.events.on("update", this._updateListener);

		/* END-USER-CTR-CODE */
	}

	public enemyGravity: number = 0;
	public EnemyVelo: number = 300;
	public laserDuration: number = 6000;
	public laserSpeed: number = 3000;
	public laserColor: string = "#ff0000";
	public lastShotTime: number = 400;
	public shotInterval: number = 2500;
	public shootingRadius: number = 2000;
	public IsNearPlayer: boolean = false;
	public EnemyLife: number = 3;
	public IsDestroyed: boolean = false;
	public EnemyDamage: number = 10;
	public canShoot: boolean = false;
	public canFlip: boolean = true;
	public shootMissile: boolean = false;
	public shootingrate: number = 200;
	public canHitPlayer: boolean = false;
	public canPlayerStand: boolean = true;
	public canPlayerHit: boolean = true;
	private hasHitPlayer: boolean = false;
	public IsMegaLaser: boolean = false; // Variable para controlar si es un Mega Laser
	private canCollideWithPlayer: boolean = true; // Agrega esta propiedad a la clase
	/* START-USER-CODE */
	create(){
		const gameUI = this.scene.scene.get('GameUI') as any;
		const EnergyLevel = gameUI.level;
		
		this.EnemyLife = EnergyLevel*this.EnemyLife;

		this.scene.enemies.add(this);
		this.scene.physics.add.existing(this);
		const enemyBody = this.body as Phaser.Physics.Arcade.Body;
		enemyBody.setGravityY(this.enemyGravity); // Configura la gravedad para el jugador\
		enemyBody.setAllowGravity(false); // Desactiva la gravedad para el enemigo
		enemyBody.setImmovable(true); // Hacer que el enemigo sea inmovible
		this.animationState.setAnimation(0, "Idle", true);

		    // Generar un factor aleatorio entre 0.5 y 1.5
			const randomFactor = Phaser.Math.FloatBetween(0.5, 6);
			// Multiplicar la velocidad original del enemigo por el factor aleatorio
			this.EnemyVelo *= randomFactor;


		enemyBody.setVelocityX(-this.EnemyVelo);
		this.setDepth(1); 

		const player = (this.scene as Phaser.Scene & { player: Phaser.GameObjects.Sprite }).player;
		if(this.canHitPlayer){
			this.scene.physics.add.collider(
				this,
				player,
				this.handlePlayerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
				undefined,
				this
			);

		}else if(this.canPlayerStand){
			this.scene.physics.add.collider(this, player, this.handlePlayerCollisionStand as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
		}else if(this.canPlayerHit){
			this.scene.physics.add.overlap(this, player, this.handlePlayerHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
		}
	
	}
	handlePlayerHit(enemy: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {
		  if (!this.hasHitPlayer) {
        (player as any).tryToSword(enemy);
        this.hasHitPlayer = true;
    }
	}
	// Llama a este método desde updateEnemy o donde corresponda para resetear el flag cuando ya no hay overlap
	resetPlayerHit(enemy: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {
    // Verifica si ya no hay overlap (puedes usar Arcade Physics para esto)
    // Por ejemplo, si la distancia es mayor a cierto umbral o usando body.touching
    if (!this.scene.physics.overlap(enemy, player)) {
        this.hasHitPlayer = false;
    }
}

	handlePlayerCollisionStand(enemy: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {

		
	}
	handlePlayerCollision(enemy: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {
		if (!this.canCollideWithPlayer) return;
	
		this.scene.add.particles(0, 0, 'particleImage', {
							x: (player as any).x,
							y: (player as any).y,
							speed: { min: 0, max: 1000 },
							angle: { min: 0, max: 360 },
							lifespan: { min: 30, max: 500 },
							scale: { start: 4, end: 0 },
							quantity: 15,
							maxParticles: 15,
							frequency: 100,
							gravityY: 3000

						});
							const levelScene = this.scene.scene.get('Level') as Phaser.Scene;
				if(!(levelScene as any).isFxMuted){
					const jumpSounds = ['dead2_01', 'dead3_01', 'dead1_01', 'dead4_01'];
				// Select a random sound
				const randomSound = Phaser.Math.RND.pick(jumpSounds);
				// Play the selected sound
				this.scene.sound.play(randomSound);
				}
    this.canCollideWithPlayer = false;

    // --- Tu lógica de colisión normal ---
    const gameUI = this.scene.scene.get('GameUI') as any;
    const EnergyLevel = gameUI.level;
    //gameUI.updateLevelBar(-this.EnemyDamage*EnergyLevel);
		// Reducir la vida del jugador
		( player as any).body.setVelocityY(-2000);
		(player as any).body.setVelocityX(-1000);
		( player as any).handleDamage(this.EnemyDamage);

		const bloodParticles =  this.scene.add.particles(0, 0, 'particleImage', {
			x: ( player as any).x,
			y: ( player as any).y,
			speed: { min: -1000, max: 1000 },
			angle: { min: 0, max: 360 },
			lifespan: { min: 30, max: 500 },
			scale: { start: 2, end: 0 },
			quantity: 5,
			maxParticles: 5,
			frequency: 100,
			gravityY: 3000

		});
		   //  const fx = bloodParticles.postFX.addBokeh(0.5, 10, 0.2);

		bloodParticles.setDepth(1);
			// Detener el sistema de partículas después de un tiempo y luego destruirlo
			this.scene.time.delayedCall(500, function() {
				bloodParticles.stop();
				bloodParticles.destroy();
			}, [], this);
		

		// --- Cooldown para volver a permitir la colisión ---
    this.scene.time.delayedCall(1500, () => {
        this.canCollideWithPlayer = true;
    });
	}

	updateEnemy(delta: number) {

		if (this.IsDestroyed) {
			return;
		}else{
					const player = (this.scene as Phaser.Scene & { player: Phaser.GameObjects.Sprite }).player; // Asumiendo que el jugador está disponible en la escena como this.scene.player
		if(this.canFlip){
			if (player.x < this.x) {
							// El jugador está a la izquierda del enemigo
							this.skeleton.scaleX = 1; // Flip horizontal hacia la izquierda
						} else {
							// El jugador está a la derecha del enemigo
							this.skeleton.scaleX = -1; // Flip horizontal hacia la derecha
						}

		}
				
				const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
				if (distanceToPlayer <= this.shootingRadius) {
					this.IsNearPlayer=true
					// Disparar el láser a intervalos regulares
					if (this.scene.time.now > this.lastShotTime + this.shotInterval) {
						if(this.canShoot){
							this.createLaserParticles();
							this.scene.time.delayedCall(this.shootingrate, () => {
								if(this.shootMissile){
									this.shootAMissile(player)
								}else{
									if(this.IsMegaLaser){
										//console.log("shootMegaLaser");
										this.shootMegaLaser(player);
									}else{
										this.shootLaser(player);	
									}
								
								}
							
							});
							this.lastShotTime = this.scene.time.now;
						}
						
					}
				}else{
					this.IsNearPlayer=false;
				}

			// Verificar si el enemigo está a 3000 píxeles a la izquierda de la cámara
			if (this.x < this.scene.cameras.main.worldView.x - 13000) {
				// Reaparecer a 3000 píxeles a la derecha de la cámara
				this.x = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width + 13000;
			}

			if (this.EnemyLife <= 0 && !this.IsDestroyed) {
			this.handleDestroy();
			}

		}

	}

	handleDestroy() {
		const levelScene = this.scene.scene.get('Level') as Phaser.Scene;
		if(!(levelScene as any).isFxMuted){
			const jumpSounds = ['EnemyExplode1_01', 'EnemyExplode2_01', 'EnemyExplode3_01', 'EnemyExplode4_01', 'EnemyExplode5_01', 'EnemyExplode6_01'];
		// Select a random sound
		const randomSound = Phaser.Math.RND.pick(jumpSounds);
		// Play the selected sound
		this.scene.sound.play(randomSound);
		}

if (this.timers && Array.isArray(this.timers)) {
            this.timers.forEach((timer: Phaser.Time.TimerEvent) => {
                if (timer && !timer.hasDispatched) {
                    timer.remove(false);
                }
            });
            this.timers = [];
        }

		this.IsDestroyed = true;
		this.generateParticles();
		const destroyParticles =  this.scene.add.particles(0, 0, 'particleImage', {
			x: this.x,
			y: this.y,
			speed: { min: -3000, max: 3000 },
			angle: { min: 0, max: 360 },
			lifespan: { min: 30, max: 500 },
			scale: { start: 8, end: 0 },
			quantity: 60,

			maxParticles: 50,
			frequency: 1,

		});

		destroyParticles.setDepth(1); 
		this.scene.time.delayedCall(1500, () => {
			destroyParticles.stop();
			destroyParticles.destroy();
			 // Eliminar el enemigo del grupo de enemigos
			 // Destruir el enemigo
			 this.destroy();

		}, [], this);
		this.setVisible(false);
		const enemyBody = this.body as Phaser.Physics.Arcade.Body;
		(this.scene as any).enemies.remove(this);
		enemyBody.setEnable(false);
		//this.destroy();
	}

	generateParticles() {
		const gameUI = this.scene.scene.get('GameUI') as any;
		const EnergyLevel = gameUI.level;
		const Level =this.scene.scene.get('Level') as any;;

		const NumberOfParticles = Math.ceil(EnergyLevel*Level.FactorDeDificultad); 

		//console.log("numberOfParticles", NumberOfParticles);
        for (let i = 0; i < NumberOfParticles; i++) {
            const x = this.x + Phaser.Math.Between(-130, 130); // Posición aleatoria cerca del enemigo
            const y = this.y + Phaser.Math.Between(-130, 130); // Posición aleatoria cerca del enemigo
            const particle = new CollectableParticle(this.scene, x, y);
			
            this.scene.add.existing(particle);
        }
    }

	
	createLaserParticles() {

		const appearParicles =  this.scene.add.particles(0, 0, 'particleImage', {
			x: this.x,
			y: this.y,
			speed: { min: -30, max: 30 },
			angle: { min: 0, max: 360 },
			lifespan: { min: 30, max: 500 },
			scale: { start: 3, end: 0 },
			quantity: 2,
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

	shootAMissile(player: Phaser.GameObjects.Sprite) {
    if (this.canShoot) {
        let flashes = 0;
        const maxFlashes = 3;

        const flash = () => {
            if (flashes < maxFlashes * 2) {
                // Alterna entre rojo y blanco usando skeleton.color
                if (flashes % 2 === 0) {
                    this.skeleton.color.set(1, 0, 0, 1); // Rojo
                } else {
                    this.skeleton.color.set(1, 1, 1, 1); // Blanco
                }
                flashes++;
                this.scene.time.delayedCall(60, flash, [], this);
            } else {
                // Restaurar a blanco y disparar el misil
                this.skeleton.color.set(1, 1, 1, 1);

                const missile = this.scene.add.ellipse(this.x, this.y + 80, 60, 80, 0xff0000) as Phaser.GameObjects.Ellipse & { lifespan?: number };
                this.scene.physics.add.existing(missile);
                const missileBody = missile.body as Phaser.Physics.Arcade.Body;
                missileBody.setAllowGravity(true);
                missileBody.setGravityY(3000);

                // Puedes calcular la dirección hacia el jugador aquí si lo deseas

                missile.lifespan = this.laserDuration;
                this.scene.time.addEvent({
                    delay: this.laserDuration,
                    callback: () => {
                        missile.destroy();
                    }
                });

                // Agregar colisión entre el misil y el jugador
                this.scene.physics.add.overlap(missile, player, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
            }
        };

        flash();
    }
}
	shootLaser(player: Phaser.GameObjects.Sprite) {
		if (this.canShoot) {
        let flashes = 0;
        const maxFlashes = 3;

        const flash = () => {
            if (flashes < maxFlashes * 2) {
                // Alterna entre rojo y blanco
                if (flashes % 2 === 0) {
                    this.skeleton.color.set(1, 0, 0, 1); // Rojo
                } else {
                    this.skeleton.color.set(1, 1, 1, 1); // Blanco
                }
                flashes++;
                this.scene.time.delayedCall(60, flash, [], this);
            } else {
                // Restaurar a blanco y disparar
                this.skeleton.color.set(1, 1, 1, 1);

                const levelScene = this.scene.scene.get('Level') as Phaser.Scene;
                if (!(levelScene as any).isFxMuted) {
                    const deadSounds = ['EnemyLaser_01'];
                    const randomSound = Phaser.Math.RND.pick(deadSounds);
                    this.scene.sound.play(randomSound);
                }

                // Disparo real después del efecto de tint
                const laserColorNumber = Phaser.Display.Color.HexStringToColor(this.laserColor).color;
                const laser = this.scene.add.ellipse(this.x, this.y, 200, 40, laserColorNumber) as Phaser.GameObjects.Ellipse & { lifespan?: number };
                this.scene.physics.add.existing(laser);
                const laserBody = laser.body as Phaser.Physics.Arcade.Body;
                laserBody.setAllowGravity(false);

                // Calcular la dirección del láser hacia el jugador
                const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
                const velocityX = Math.cos(angle) * this.laserSpeed;
                const velocityY = Math.sin(angle) * this.laserSpeed;
                laserBody.setVelocity(velocityX, velocityY);
                laser.rotation = angle;
                laser.lifespan = this.laserDuration;
                this.scene.time.addEvent({
                    delay: this.laserDuration,
                    callback: () => {
                        laser.destroy();
                    }
                });

                this.scene.physics.add.overlap(laser, player, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
            }
        };

        flash();
    }

	}


	shootMegaLaser(player: Phaser.GameObjects.Sprite) {
		if (this.canShoot) {
        let flashes = 0;
        const maxFlashes = 3;

        const flash = () => {
            if (flashes < maxFlashes * 2) {
                // Alterna entre rojo y blanco
                if (flashes % 2 === 0) {
                    this.skeleton.color.set(1, 0, 0, 1); // Rojo
                } else {
                    this.skeleton.color.set(1, 1, 1, 1); // Blanco
                }
                flashes++;
                this.scene.time.delayedCall(60, flash, [], this);
            } else {
                // Restaurar a blanco y disparar
                this.skeleton.color.set(1, 1, 1, 1);

                const levelScene = this.scene.scene.get('Level') as Phaser.Scene;
                if (!(levelScene as any).isFxMuted) {
                    const deadSounds = ['EnemyLaser_01'];
                    const randomSound = Phaser.Math.RND.pick(deadSounds);
                    this.scene.sound.play(randomSound);
                }

                // Disparo real después del efecto de tint
                const laserColorNumber = Phaser.Display.Color.HexStringToColor(this.laserColor).color;
                const laser = this.scene.add.ellipse(this.x, this.y, 400, 120, laserColorNumber) as Phaser.GameObjects.Ellipse & { lifespan?: number };
                this.scene.physics.add.existing(laser);
                const laserBody = laser.body as Phaser.Physics.Arcade.Body;
                laserBody.setAllowGravity(false);

                // Calcular la dirección del láser hacia el jugador
                const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
                const velocityX = Math.cos(angle) * this.laserSpeed;
                const velocityY = Math.sin(angle) * this.laserSpeed;
                laserBody.setVelocity(velocityX, velocityY);
                laser.rotation = angle;
                laser.lifespan = this.laserDuration;
                this.scene.time.addEvent({
                    delay: this.laserDuration,
                    callback: () => {
                        laser.destroy();
                    }
                });

                this.scene.physics.add.overlap(laser, player, this.handleLaserCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
            }
        };

        flash();
    }

	}


	handleLaserCollision(laser: Phaser.GameObjects.GameObject, player: Phaser.GameObjects.GameObject) {
		// Manejar la colisión entre el láser y el jugador

    // Agregar un efecto de "camera shake"
	const gameUI = this.scene.scene.get('GameUI') as any;
	const EnergyLevel = gameUI.level;
	//gameUI.updateLevelBar(-this.EnemyDamage*EnergyLevel);
		// Reducir la vida del jugador

		( player as any).handleDamage(this.EnemyDamage);

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

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
