export type SliderComponentProps = {
    // Value management
    value: number,
    minValue: number,
    maxValue: number,
    onChange(value: number): any,

    // Design management, can't be changed after first render
    height?: number,
    backgroundColor?: number,
    normalFillColor?: number,
    selectedFillColor?: number,
    activeFillColor?: number,
}
