export class Vector2 {
    private _x: number;
    private _y: number;
  
    constructor(x: number = 0, y: number = 0) {
		this._x = x;
		this._y = y;
    }
  
	//#region Static methods

    static get zero() : Vector2 {
		return new Vector2(0, 0);
    }

	static normalize(vector: Vector2): Vector2 {
		const magnitude = vector.magnitude;
		return magnitude !== 0 ? new Vector2(vector.x / magnitude, vector.y / magnitude) : Vector2.zero;
    }

	static scale(vector: Vector2, value: number): Vector2 {
		vector.x *= value;
		vector.y *= value;
		return vector;
	}

	static multiply(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x * b.x, a.y * b.y);
	}

	static subtract(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x - b.x, a.y - b.y);
	}

	//#endregion Static methods
  
    //#region Getters

    get x(): number {
		return this._x;
    }
  
    get y(): number {
		return this._y;
    }

	get magnitude(): number {
		return Math.sqrt(this._x ** 2 + this._y ** 2);
    }

	//#endregion Getters
  
    //#region Setters

    set x(x: number) {
		this._x = x;
    }
  
    set y(y: number) {
		this._y = y;
    }

	scale(scalar: number): void {
		this._x *= scalar;
		this._y *= scalar;
	}

	//#endregion Setters
  }
  