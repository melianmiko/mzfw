import { isLegacyAPI, osImport } from "../internal";
import { ZeppFsLibrary } from "./Types";
import { LegacyFileSystemWrapper } from "./LegacyWrapper";

const modernFs = osImport<ZeppFsLibrary>("@zos/fs", "hmFS");

export const {
    O_EXCL,
    O_CREAT,
    O_TRUNC,
    O_RDWR,
    O_WRONLY,
    O_RDONLY,
    O_APPEND,
    closeSync,
    openAssetsSync,
    openSync,
    readdirSync,
    readSync,
    renameSync,
    rmSync,
    statAssetsSync,
    statSync,
    writeFileSync,
    writeSync,
    readFileSync,
    mkdirSync,
}: ZeppFsLibrary = isLegacyAPI ? new LegacyFileSystemWrapper() : modernFs;
