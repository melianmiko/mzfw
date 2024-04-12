import { glob } from "../../zosx/internal";
import { ConfigStorage } from "../Path";
import { SessionStoragePolyfill } from "./SessionStoragePolyfill";

glob.localStorage = new ConfigStorage("local_storage.json");
glob.sessionStorage = new SessionStoragePolyfill();
