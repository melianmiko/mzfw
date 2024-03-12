export type UiDrawRectangleComponentProps = {
    height?: number,
    color?: number,
    radius?: number,
    marginV?: number,
    marginH?: number,
}

export type ImageComponentProps = {
    imageWidth?: number,
    imageHeight?: number,
    src: string,
}

export type AnimComponentProps = {
    animationWidth?: number,
    animationHeight?: number,
    imagesPath: string,
    imagesPrefix: string,
    imagesCount: number,
    fps: number,
    repeatCount?: number,
}
