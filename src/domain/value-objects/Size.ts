export class Size {
    private _width: number;
    private _height: number;

    constructor();
    constructor(width: number, height: number);
    constructor(width: number = 0, height: number = 0) {
        this._width = Math.max(width, 0);
        this._height = Math.max(height, 0);
    }

    //#region Getters

    get width() : number {
        return this._width;
    }

    get height() : number {
        return this._height;
    }

    //#endregion Getters

    //#region Setters

    set width(width: number) {
        this._width = width;
    }

    set height(height: number) {
        this._height = height;
    }

    //#endregion Setters
}