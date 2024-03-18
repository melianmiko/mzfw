import { isLegacyAPI, osImport } from "../internal";
import { ZeppSettingsLibrary, ZeppSystemInfo } from "./Types";

const systemSetting = osImport<ZeppSettingsLibrary>("@zos/settings", "hmSetting");

export const getLanguage = systemSetting.getLanguage();

export function getLanguageString(): string {
    return ["zh-CN", "zh-TW", "en-US", "es-ES", "ru-RU", "ko-KR", "fr-FR", "de-DE", "id-ID",
        "pl-PL", "it-IT", "ja-JP", "th-TH", "ar-EG", "vi-VN", "pt-PT", "nl-NL", "tr-TR",
        "uk-UA", "iw-IL", "pt-BR", "ro-RO", "cs-CZ", "el-GR", "sr-RS", "ca-ES", "fi-FI",
        "nb-NO", "da-DK", "sv-SE", "hu-HU", "ms-MY", "sk-SK", "hi-IN"][systemSetting.getLanguage()];
}

export function getSystemInfo(): ZeppSystemInfo {
    if(isLegacyAPI) return {
        firmwareVersion: "0.0",
        minAPI: "1.0.0",
        osVersion: "1.0.0",
    };

    if(!systemSetting.getSystemInfo) return {
        firmwareVersion: "0.0",
        minAPI: "2.0.0",
        osVersion: "2.0.0",
    };

    return systemSetting.getSystemInfo();
}
