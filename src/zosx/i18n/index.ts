import { glob, isLegacyAPI, osImport } from "../internal";
import { getLanguageString } from "../settings";
import type { LegacyZeppFsLibrary } from "../fs/Types";

export type ZeppI18nLibrary = {
    getText(key: string): string;
}

const modernLocale = osImport<ZeppI18nLibrary>("@zos/i18n", null);

function loadZeusxLocale() {
    const filePath = `raw/${getLanguageString()}.i18n`
    const fs = osImport<LegacyZeppFsLibrary>("@zos/fs", "hmFS");
    // console.log("[fs] i18n laod from", filePath);

    const [st, e] = fs.stat_asset(filePath);
    if(e != 0) {
        // console.log("[i18n] n/a", filePath);
        return {};
    }

    const buffer = Buffer.alloc(st.size);
    const file = fs.open_asset(filePath, fs.O_RDONLY);
    fs.read(file, buffer.buffer, 0, buffer.byteLength);
    fs.close(file);

    try {
        const str = buffer.toString("utf8");
        return JSON.parse(str);
    } catch(e) {
        // console.log("[i18n]", e);
        return {};
    }
}

function legacyGetText(key: string): string {
    if(!glob["_i18n_cache"]) {
        glob["_i18n_cache"] = loadZeusxLocale();
        // console.log(`[i18n] load ${Object.keys(glob["_i18n_cache"]).length} translations`);
    }
    return glob["_i18n_cache"][key] ?? key;
}

export const getText: (key: string) => string = isLegacyAPI ? legacyGetText : modernLocale.getText;
