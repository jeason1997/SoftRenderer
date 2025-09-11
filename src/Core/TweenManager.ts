import { Group, Tween } from "@tweenjs/tween.js";

export class TweenManager {
    private static tweenGroup: Group = new Group();

    public static add(tween: Tween) {
        // 保存用户原有的 onComplete 回调
        const originalOnComplete = (tween as any)._onCompleteCallback;

        // 设置新的 onComplete 回调
        tween.onComplete(() => {
            // 先调用用户原有的回调（如果存在）
            if (originalOnComplete) {
                originalOnComplete();
            }
            // 然后从管理器中移除
            this.remove(tween);
            console.log("移除");
        });

        this.tweenGroup.add(tween);
    }

    public static update(time?: number) {
        this.tweenGroup.update(time);
    }

    public static remove(tween: Tween) {
        this.tweenGroup.remove(tween);
    }
}
