import "./setTimeout";
import "./promise";
import "./buffer";

import { glob } from "@zosx/utils";
import { ConfigStorage } from "../device/Path";
import { SessionStoragePolyfill } from "./SessionStoragePolyfill";

glob.localStorage = new ConfigStorage("local_storage.json");
glob.sessionStorage = new SessionStoragePolyfill();
