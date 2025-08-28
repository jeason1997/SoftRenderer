export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    normalize(): Vector3 {
        let len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}