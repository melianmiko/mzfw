import { ZeppBleLibrary } from "./Types";
import { osImport } from "../internal";

export * from "./Types";

export const {
    connectStatus,
    disConnect,
    createConnect,
    addListener,
}: ZeppBleLibrary = osImport<ZeppBleLibrary>("@zos/ble", "hmBle");
