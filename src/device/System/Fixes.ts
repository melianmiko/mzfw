import { glob } from "@zosx/utils";

export function memoryCleanup() {
    // Yes, freaking ZeppOS shares global variables between all apps
    // so it's strongly recommended to call this method in app.onDestroy
    delete glob.localStorage;
    delete glob.sessionStorage;
    delete glob["__session_storage"];
    delete glob["__cache_appPath"];
    delete glob["_fetch_timeout"];
    delete glob["messageBuilder"];
    delete glob["_i18n_cache"];
}
