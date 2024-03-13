import { Component } from "../UiComponent";
import { AnimComponent } from "../UiNativeComponents";
import { IS_LOW_RAM_DEVICE } from "../UiProperties";
import { ImageComponent } from "../UiNativeComponents/UiImageComponent";

/**
 * Create spinner view component.
 * On low-ram devices, will display hourglass image.
 * On other devices, will show spinner animation.
 */
export function createSpinner(): Component<any> {
    if(IS_LOW_RAM_DEVICE)
        return new ImageComponent({
            imageWidth: 48,
            imageHeight: 48,
            src: "mzfw/spin_low_ram.png",
        });

    return new AnimComponent({
        animationWidth: 48,
        animationHeight: 16,
        imagesPath: "mzfw/spin_sm",
        imagesPrefix: "anim",
        imagesCount: 7,
        fps: 21,
    });
}
