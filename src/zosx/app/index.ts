import { isLegacyAPI, osImport } from "../internal";
import { LegacyZeppAppLibrary, ZeppAppLibrary, ZeppPackageInfo } from "./Types";

const zeppApp = osImport("@zos/app", "hmApp");
const hmAppModern = zeppApp as ZeppAppLibrary;
const hmAppLegacy = zeppApp as LegacyZeppAppLibrary;

export const getPackageInfo: () => ZeppPackageInfo = isLegacyAPI ? hmAppLegacy.packageInfo : hmAppModern.getPackageInfo;
