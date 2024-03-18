import { UiTheme } from "../UiCompositor";

export interface ScreenBoardInitOptions {
    forceRenderer?: string;
    forceLayouts?: string[];
    theme?: UiTheme,
}

export interface ScreenBoardRenderer {
    extraLayouts: string[];
    hasBackspace: boolean;
    build(): any;
    useLayout(layout: string): any;
    listLayouts(): string[];
}

export interface ScreenBoardButtonData {
    title?: string;
    values: string[];
}

export type ScreenBoardLayout = ScreenBoardButtonData[];
export type ScreenBoardLayoutsCollection = {[id: string]: ScreenBoardLayout};

export interface ScreenBoardCreateButtonRequest {
    x: number;
    y: number;
    w: number;
    handler: (ident?: any) => any;
}

export interface ScreenBoardCreateIconButtonRequest extends ScreenBoardCreateButtonRequest {
    ident: any;
    icon: string;
}

export interface ScreenBoardCreateTextButtonRequest extends ScreenBoardCreateButtonRequest {
    ident: any;
    special?: boolean,
}

