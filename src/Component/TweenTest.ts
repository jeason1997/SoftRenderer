import { Tween, Easing } from "@tweenjs/tween.js";
import { Component } from "./Component";
import { TweenManager } from "../Core/TweenManager";

export class TweenTest extends Component {
    private tween: Tween;

    public start(): void {
        let startPos = this.transform.position;

        this.tween = new Tween(startPos)
            .to({ x: 0.8 }, 1000)
            .easing(Easing.Back.InOut)
            .onUpdate(() => {
                this.transform.position = startPos;
            })
            .onComplete(() => {
                console.log("tween complete");
            })
            .delay(100)
            .yoyo(true)
            .repeat(Infinity)
            .start(1000);

        TweenManager.add(this.tween);
    }

    public onDestroy(): void {
        TweenManager.remove(this.tween);
    }
}