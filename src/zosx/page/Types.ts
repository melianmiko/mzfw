export interface ZeppPageLibrary {
    getScrollTop(): number;
    scrollTo(options: {y: number}): void;
    setScrollLock(options: {lock: boolean}): void;
}

export interface LegacyPageRelatedHmApp {
    getLayerY(): number;
    setLayerY(value: number): void;
}

export interface LegacyPageRelatedUi {
    setLayerScrolling(lock: boolean): void;
}
