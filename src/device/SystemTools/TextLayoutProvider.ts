import { TextLayoutError } from "./Errors";
import { getTextLayout } from "../../zosx/ui";

/**
 * Cached wrapper for getTextLayout()
 */
export class TextLayoutProvider {
    private lastText: string | null = "";
    private lastWidth: number = -1;
    private lastSize: number = -1;

    public height = 0;
    public width = 0;

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

            this.width = layout.width;
            this.height = layout.height;
        } else {
            this.width = 0;
            this.height = 0;
        }

        this.lastText = text;
        this.lastWidth = width;
        this.lastSize = size;

        return true;
    }
}
