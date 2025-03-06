import { Query, IWorld, Component, defineQuery, enterQuery, exitQuery } from "bitecs";
import { IScene, IGameObject } from "@domain/models";
import { ISystem } from "./ISystem";

export abstract class System implements ISystem {
    protected _scene: IScene;
    protected _world: IWorld;
    private _query: Query<IWorld>;
    private _enterQuery: Query<IWorld>;
    private _exitQuery: Query<IWorld>;

    constructor(scene: IScene, world: IWorld, components: Component[]) {
        this._scene = scene;
        this._world = world;
        this._query = defineQuery(components);
        this._enterQuery = enterQuery(this._query);
        this._exitQuery = exitQuery(this._query);
    }

    public execute(): void {
        this.processEntities(this._enterQuery, this.enter.bind(this));
        this.processEntities(this._query, this.update.bind(this));
        this.processEntities(this._exitQuery, this.exit.bind(this));
    }
    
    private processEntities = (query: Query<IWorld>, callback: (object: IGameObject) => void): void => {
        const entities = query(this._world);
        for (let i = 0; i < entities.length; i++) {
            const id: number = entities[i];
            const gameObject = this._scene.getGameObject(id);
            if (!gameObject) continue;
            callback(gameObject);
        }
    };

    public abstract enter(object: IGameObject): void;
    public abstract update(object: IGameObject): void;
    public abstract exit(object: IGameObject): void;
}