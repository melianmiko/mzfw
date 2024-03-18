import {
    LegacyZeppFsLibrary,
    OpenFileEntry,
    ZeppFileIoOptions,
    ZeppFsLibrary,
    ZeppFsStat,
    ZeppOverrideOptions
} from "./Types";
import { osImport } from "../internal";

const fs = osImport<LegacyZeppFsLibrary>("@zos/fs", "hmFS");

export class LegacyFileSystemWrapper implements ZeppFsLibrary {
    O_RDONLY: number = fs.O_RDONLY;
    O_WRONLY: number = fs.O_WRONLY;
    O_RDWR: number = fs.O_RDWR;
    O_APPEND: number = fs.O_APPEND;
    O_CREAT: number = fs.O_CREAT;
    O_EXCL: number = fs.O_EXCL;
    O_TRUNC: number = fs.O_TRUNC;

    closeSync: (fd: OpenFileEntry) => number = fs.close;
    mkdirSync: (path: string) => number = fs.mkdir;
    rmSync: (path: string) => number = fs.remove;

    openAssetsSync(options: { path: string; flag: number; }): OpenFileEntry {
        return fs.open_asset(options.path, options.flag);
    }

    openSync(options: { path: string; flag: number; }): OpenFileEntry {
        return fs.open(options.path, options.flag);
    }

    readSync(options: { fd: OpenFileEntry; buffer: ArrayBuffer; options?: ZeppFileIoOptions | undefined; }): number {
        fs.seek(options.fd, options.options?.position ?? 0, fs.SEEK_SET);
        return fs.read(options.fd, options.buffer,
            options.options?.offset ?? 0,
            options.options?.length ?? options.buffer.byteLength);
    }

    readFileSync(options: { path: string; options: ZeppOverrideOptions }): string | ArrayBuffer | undefined {
        const [st, e] = fs.stat(options.path);
        if(e != 0) return undefined;

        const buffer = Buffer.alloc(st.size);
        const file = fs.open(options.path, fs.O_RDONLY);
        fs.read(file, buffer.buffer, 0, buffer.byteLength);
        fs.close(file);

        if(options.options && options.options.encoding)
            return buffer.toString(options.options.encoding);
        return buffer;
    }

    writeSync(options: { fd: unknown; buffer: ArrayBuffer; options?: ZeppFileIoOptions | undefined; }): number {
        fs.seek(options.fd, options.options?.position ?? 0, fs.SEEK_SET);
        return fs.write(options.fd, options.buffer,
            options.options?.offset ?? 0,
            options.options?.length ?? options.buffer.byteLength);
    }

    writeFileSync(options: { path: string; data: string | ArrayBuffer; options?: ZeppOverrideOptions | undefined; }): void {
        try { fs.remove(options.path); } catch(_) {}

        const data: ArrayBuffer = typeof options.data == "string"
            ? Buffer.from(options.data, options.options?.encoding ?? "utf-8") : options.data;

        const file = fs.open(options.path, fs.O_WRONLY | fs.O_CREAT);
        fs.write(file, data, 0, data.byteLength);
        fs.close(file);
    }

    readdirSync(options: { path: string; }): string[] | undefined {
        const [data, e] = fs.readdir(options.path);
        return e == 0 ? data : undefined;
    }

    renameSync(options: { oldPath: string; newPath: string; }): number {
        return fs.rename(options.oldPath, options.newPath);
    }

    statAssetsSync(options: { path: string; }): ZeppFsStat | undefined {
        const [st, e] = fs.stat_asset(options.path);
        return e == 0 ? st : undefined;
    }

    statSync(options: { path: string; }): ZeppFsStat | undefined {
        const [st, e] = fs.stat(options.path);
        return e == 0 ? st : undefined;
    }
}
