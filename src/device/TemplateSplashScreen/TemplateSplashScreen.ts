import { ZeppFillRectWidgetOptions, ZeppImgWidgetOptions, ZeppTextWidgetOptions, ZeppWidget } from "@zosx/types";
import { align, createWidget, prop, widget } from "@zosx/ui";
import { BASE_FONT_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH } from "../UiProperties";
import { isLegacyDevice } from "../System";
import { replace } from "@zosx/router";
import { resetPageBrightTime, setPageBrightTime } from "@zosx/display";

export class TemplateSplashScreen {
    /**
     * Visible icon path
     * @protected
     */
    protected iconPath: string = "icon/80/icon.png";
    protected continueToUrl: string = "page/index";
    protected continueParam: string = "";
    protected iconSize: number = 80;
    private viewAnimation: ZeppWidget<ZeppFillRectWidgetOptions, {}> | null = null;
    private viewStatus: ZeppWidget<ZeppTextWidgetOptions, {}> | null = null;

    protected onInit(): Promise<unknown> {
        return Promise.resolve();
    }

    protected setStatus(text: string) {
        this.viewStatus?.setProperty(prop.TEXT, text);
    }

    static makePage(page: TemplateSplashScreen): any {
        return {
            onInit() {
                page.performRender();
            },
            onDestroy() {
                page.performDestroy();
            }
        }
    }

    private performRender() {
        setPageBrightTime({brightTime: 30000});

        this.viewAnimation = createWidget<ZeppFillRectWidgetOptions>(widget.FILL_RECT, {
            x: Math.floor((SCREEN_WIDTH - this.iconSize) / 2),
            y: Math.floor((SCREEN_HEIGHT - this.iconSize) / 2),
            w: this.iconSize,
            h: this.iconSize,
            radius: Math.floor(this.iconSize / 2) - 1,
            color: 0,
        });
        createWidget<ZeppImgWidgetOptions>(widget.IMG, {
            x: Math.floor((SCREEN_WIDTH - this.iconSize) / 2),
            y: Math.floor((SCREEN_HEIGHT - this.iconSize) / 2),
            w: this.iconSize,
            h: this.iconSize,
            src: this.iconPath,
        });
        this.viewStatus = createWidget<ZeppTextWidgetOptions>(widget.TEXT, {
            x: 0,
            y: SCREEN_HEIGHT - 96,
            w: SCREEN_WIDTH,
            h: 80,
            color: 0xAAAAAA,
            text_size: BASE_FONT_SIZE - 4,
            text: "",
            align_h: align.CENTER_H,
        });

        Promise.all([
            this.onInit(),
            this.playAnimation()
        ]).then(() => {
            if(this.continueToUrl) {
                replace({url: this.continueToUrl, params: this.continueParam});
            }
        });
    }

    private performDestroy() {
        resetPageBrightTime();
    }

    private playAnimation() {
        if(isLegacyDevice) return Promise.resolve();

        return new Promise<void>((resolve) => {
            let frame = 0;

            const mpx = 16;
            const timer = setInterval(() => {
                const iconSize = this.iconSize + frame * mpx;
                const brightness = Math.floor(100 * (1 - (frame / 20)));
                this.viewAnimation?.setProperty(prop.MORE, {
                    x: Math.floor((SCREEN_WIDTH - iconSize) / 2),
                    y: Math.floor((SCREEN_HEIGHT - iconSize) / 2),
                    w: iconSize,
                    h: iconSize,
                    radius: Math.floor(iconSize / 2) - 1,
                    color: (brightness << 16) + (brightness << 8) + brightness,
                });

                if(frame < 20) {
                    frame++;
                } else {
                    clearInterval(timer);
                    resolve();
                }
            }, 50);
        })
    }
}
