import {osImport, isLegacyAPI} from "./index";

const sysPage: any = osImport("@zos/page", "hmApp");

export const getScrollTop: () => number = isLegacyAPI ? sysPage.getLayerY : sysPage.getScrollTop;

export function scrollTo(opt: {y: number}) {
    return isLegacyAPI ? sysPage.setLayerY(opt.y) : sysPage.scrollTo(opt);
}
