export class PhysicMaterial {
    public bounciness: number;
    public dynamicFriction: number;
    public staticFriction: number;
    public frictionCombine: PhysicMaterialCombine;
    public bounceCombine: PhysicMaterialCombine;
}

export enum PhysicMaterialCombine
{
    //
    // 摘要:
    //     Averages the friction/bounce of the two colliding materials.
    Average = 0,
    //
    // 摘要:
    //     Uses the smaller friction/bounce of the two colliding materials.
    Minimum = 2,
    //
    // 摘要:
    //     Multiplies the friction/bounce of the two colliding materials.
    Multiply = 1,
    //
    // 摘要:
    //     Uses the larger friction/bounce of the two colliding materials.
    Maximum = 3
}