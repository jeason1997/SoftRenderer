import * as RAPIER from '@dimforge/rapier3d';

export class PhysicsEngine {
    private _world: RAPIER.World;
    public get world(): RAPIER.World {
        return this._world;
    }

    public init(): void {
        // 等待物理引擎初始化
        // 创建物理世界
        this._world = new RAPIER.World(new RAPIER.Vector3(0, -9.81, 0));
    }

    public update(): void {
        if (!this._world) return;
        this._world.step();
    }

    public onDestroy(): void {
        if (this._world) {
            this._world.free(); // 清理物理世界资源
        }
    }
}