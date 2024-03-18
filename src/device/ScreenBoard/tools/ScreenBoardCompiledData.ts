import { dynamicLoadScreenBoardLayouts } from "./ScreenBoardCompiledLoader";

export const SB_COMPILED_LAYOUTS = dynamicLoadScreenBoardLayouts("raw/mzfw/sb_layouts.bin");

export const SB_KNOWN_LAYOUTS = {
    "en-US": "English",
    "de-DE": "Deutsch",
    "cs-CZ": "Čeština",
    "hu-HU": "Hungarian",
    "fr-FR": "Français",
    "es-ES": "Español",
    "pt-BR": "Português (Brasileiro)",
    "ru-RU": "Русский",
};
