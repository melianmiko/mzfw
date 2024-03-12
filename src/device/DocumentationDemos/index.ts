import { Component } from "../UiComponent";
import { UiDrawRectangleComponent } from "../UiNativeComponents";
import { SCREEN_HEIGHT } from "../UiProperties";

export function spawnPlaceholders(count: number = 5): Component<any>[] {
    const out: Component<any>[] = [];

    for(let i = 0; i < count; i++) {
        out.push(new UiDrawRectangleComponent({
            height: SCREEN_HEIGHT * 0.2,
            marginV: 5,
            color: 0x222222,
            radius: 4,
        }))
    }

    return out;
}
