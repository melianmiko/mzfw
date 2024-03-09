import { osImport, isLegacyAPI, glob } from "../internal";
import { LegacyPageRelatedHmApp, LegacyPageRelatedUi, ZeppPageLibrary } from "./Types";


const sysPage = osImport<ZeppPageLibrary>("@zos/page", null);

const legacyWrappers: ZeppPageLibrary = {
    getScrollTop(): number {
        const hmApp: LegacyPageRelatedHmApp = glob["hmApp"];
        return hmApp.getLayerY();
    },
    scrollTo(options: { y: number }) {
        const hmApp: LegacyPageRelatedHmApp = glob["hmApp"];
        return hmApp.setLayerY(options.y);
    },
    setScrollLock(options: { lock: boolean }) {
        const hmUI: LegacyPageRelatedUi = glob["hmUI"];
        return hmUI.setLayerScrolling(options.lock);
    }
}

export const {
    setScrollLock,
    scrollTo,
    getScrollTop
}: ZeppPageLibrary = isLegacyAPI ? legacyWrappers : sysPage;
