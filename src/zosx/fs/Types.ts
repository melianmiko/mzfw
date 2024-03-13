export type OpenFileEntry = unknown;

export type ZeppFileIoOptions = {
    offset?: number,
    length?: number,
    position?: number,
}

export type ZeppOverrideOptions = {
    encoding?: "utf8",
}

export type ZeppFsStat = {
    size: number,
    mtime?: number,
    mode?: number,
}

type ZeppFsFlags = {
    O_RDONLY: number,
    O_WRONLY: number,
    O_RDWR: number,
    O_APPEND: number,
    O_CREAT: number,
    O_EXCL: number,
    O_TRUNC: number,
}

export type ZeppFsLibrary = ZeppFsFlags & {
    closeSync(fd: OpenFileEntry): number;
    mkdirSync(path: string): number;
    openAssetsSync(options: {path: string, flag: number}): OpenFileEntry;
    openSync(options: {path: string, flag: number}): OpenFileEntry;
    readFileSync(options: {path: string, options?: ZeppOverrideOptions}): string | ArrayBuffer | undefined;
    readSync(options: {fd: OpenFileEntry, buffer: ArrayBuffer, options?: ZeppFileIoOptions}): number;
    readdirSync(options: {path: string}): string[] | undefined;
    renameSync(options: {oldPath: string, newPath: string}): number;
    rmSync(path: string): number;
    statAssetsSync(options: {path: string}): ZeppFsStat | undefined;
    statSync(options: {path: string}): ZeppFsStat | undefined;
    writeFileSync(options: {path: string, data: string | ArrayBuffer, options?: ZeppOverrideOptions}): void;
    writeSync(options: {fd: OpenFileEntry, buffer: ArrayBuffer, options?: ZeppFileIoOptions}): number;
}

export type LegacyZeppFsLibrary = ZeppFsFlags & {
    SEEK_SET: number,

    stat(path: string): [ZeppFsStat, number];
    stat_asset(path: string): [ZeppFsStat, number];
    open(path: string, flag: number): OpenFileEntry;
    open_asset(path: string, flag: number): OpenFileEntry;
    close(file: OpenFileEntry): number;
    seek(file: OpenFileEntry, position: number, whence: number): void;
    read(file: OpenFileEntry, buffer: ArrayBuffer, position: number, length: number): number;
    write(file: OpenFileEntry, buffer: ArrayBuffer, position: number, length: number): number;
    remove(path: string): number;
    rename(oldPath: string, newPath: string): number;
    mkdir(path: string): number;
    readdir(path: string): [string[], number];
}
