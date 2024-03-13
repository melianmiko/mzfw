import { glob } from "../../zosx/internal";
import { ConfigStorage } from "../Path/ConfigStorage";
import { SessionStoragePolyfill } from "./SessionStoragePolyfill";

if(!glob.localStorage) {
    const FS_PATH = "local_storage.json";
    glob.localStorage = new ConfigStorage(FS_PATH);
}

if(!glob.sessionStorage) {
    glob.sessionStorage = new SessionStoragePolyfill();
}
