import * as CANNON from 'cannon';
import { Time } from '../Core/Time';

export class PhysicsEngine {
    private _world: CANNON.World;
    public get world(): CANNON.World {
        return this._world;
    }

    public init(): void {
        // 创建物理世界
        this._world = new CANNON.World();
        this._world.gravity.set(0, -9.82, 0);
        this._world.broadphase = new CANNON.NaiveBroadphase();      // 碰撞检测算法
        this._world.solver.iterations = 10;                         // 约束求解迭代次数，影响精度
        this._world.allowSleep = true;                              // 允许物体进入睡眠状态
    }

    public update(): void {
        if (!this._world) return;
        // 更新物理世界
        this._world.step(Time.fixedDeltaTime);
    }

    public onDestroy(): void {
    }
}