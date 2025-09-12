export abstract class UObject {
    public abstract onDestroy(): void;

    public Destroy(): void {
        this.onDestroy();
    }

    public static Destroy(obj: UObject): void {
        obj.Destroy();
    }
}