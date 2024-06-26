import { TextLayoutError } from "./Errors";
import { getTextLayout } from "@zosx/ui";

/**
 * Cached wrapper for getTextLayout()
 */
export class TextLayoutProvider {
    private lastText: string | null = "";
    private lastWidth: number = -1;
    private lastSize: number = -1;

    public height = 0;
    public width = 0;

    static getHeightOf(text: string, width: number, size: number): number {
        const layout = getTextLayout(text, {
            text_size: size,
            text_width: width,
        });
        if(!layout)
            throw new TextLayoutError(`text=${text}, size=${size}, width=${width}`);
        return layout.height;
    }

    /**
     * Do update if required.
     *
     * @param text Text content
     * @param width Text box width
     * @param size Text font size
     */
    public performUpdate(text: string, width: number, size: number) : boolean {
        if(text == this.lastText && width == this.lastWidth && size == this.lastSize)
            return false;

        if(text != null && text != "") {
            const layout = getTextLayout(text, {
                text_size: size,
                text_width: width,
            });
            if(!layout)
                throw new TextLayoutError(`text=${text}, size=${size}, width=${width}`);

            // console.log(`textLayout text=${text}, size=${size}, width=${width}, layout=${JSON.stringify(layout)}`);
            this.width = layout.width;
            this.height = layout.height;
        } else {
            this.width = 0;
            this.height = 0;
        }

        if(this.width < 0) {
            this.width = Math.min(text.length * size * 0.6);
            // console.log(`USE_LEGACY_TEXT_WIDTH=${this.width}px`);
        }

        this.lastText = text;
        this.lastWidth = width;
        this.lastSize = size;

        return true;
    }
}
