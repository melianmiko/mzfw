import { PathScopeName } from "./Types";
import { fullAssetPath, fullDataPath } from "./FsTools";
import * as fs from "@zosx/fs";
import { OpenFileEntry, ZeppFsStat } from "@zosx/types";
import { IS_MI_BAND_7 } from "../UiProperties";

export class Path {
    public scope: PathScopeName;
    public path: string;

    private seekPosition: number = 0;
    private openFile: OpenFileEntry;

    get relativePath(): string {
        if(this.scope == "full") {
            let rp: string = `../../../${this.path.substring(9)}`;
            if(rp.endsWith("/"))
                rp = rp.substring(0, rp.length - 1);
            return rp;
        }
        return this.path;
    }

    get name() {
        return this.path.substring(this.path.lastIndexOf("/") + 1);
    }

    get absolutePath(): string {
        switch (this.scope) {
        case "assets":
            return fullAssetPath(this.path);
        case "data":
            return fullDataPath(this.path);
        case "full":
            return this.path;
        }
    }

    constructor(scope: PathScopeName, path: string) {
        if(path[0] != "/" && scope == "full") path = "/" + path;

        if(["full", "assets", "data"].indexOf(scope) < 0)
            throw new Error("Unknown scope provided")

        this.scope = scope;
        this.path = path;
    }

    get(child: string) {
        if(child == "") {
            return this;
        } else if (this.path === "/" || this.path === ".") {
            return new Path(this.scope, child);
        } else {
            return new Path(this.scope, `${this.path}/${child}`);
        }
    }

    resolve() {
        return new Path("full", this.absolutePath);
    }

    src() {
        if(this.scope !== "assets")
            throw new Error("Can't get src for non-asset");
        return this.relativePath.substring(1);
    }

    stat(): ZeppFsStat | undefined {
        if (this.scope == "data") {
            return fs.statSync({path: this.relativePath});
        } else {
            return fs.statAssetsSync({path: this.relativePath});
        }
    }

    size(): number | null {
        const stat = this.stat();
        if(!stat) return null;
        if(stat.size) {
            // Is file, nothing to do anymore
            return stat.size;
        }

        let output: number = 0;
        for(const file of (this.list() ?? [])) {
            output += this.get(file).size() ?? 0;
        }

        return output;
    }

    open(flags: number): OpenFileEntry {
        if (this.scope === "data") {
            this.openFile = fs.openSync({path: this.relativePath, flag: flags});
        } else {
            this.openFile = fs.openAssetsSync({path: this.relativePath, flag: flags});
        }

        return this.openFile;
    }

    remove(): boolean {
        if(this.scope === "assets")
            return this.resolve().remove();

        try {
            fs.rmSync(IS_MI_BAND_7 ? this.absolutePath : this.relativePath)
            return true;
        } catch (e) {
            return false;
        }
    }

    removeTree() {
        // Recursive !!!
        const files = this.list() ?? [];
        for(let i in files) {
            this.get(files[i]).removeTree();
        }

        this.remove();
    }

    fetch(limit = Infinity): Buffer | null {
        const stat = this.stat();
        if (!stat) return null;

        const length = Math.min(limit, stat.size);
        const buffer = Buffer.alloc(stat.size);
        this.open(fs.O_RDONLY);
        this.read(buffer.buffer, 0, length);
        this.close();

        return buffer;
    }

    fetchText(limit = Infinity): string | null {
        return this.fetch(limit)?.toString("utf-8") ?? null;
    }

    fetchJSON(): any {
        const text = this.fetchText();
        if(text === null) return null;
        return JSON.parse(text);
    }

    override(buffer: Buffer) {
        this.remove();

        this.open(fs.O_WRONLY | fs.O_CREAT);
        this.write(buffer.buffer, 0, buffer.byteLength);
        this.close();
    }

    overrideWithText(text: string) {
        return this.override(Buffer.from(text, "utf-8"));
    }

    overrideWithJSON(data: any) {
        return this.overrideWithText(JSON.stringify(data));
    }

    copy(destEntry: Path) {
        const buf = this.fetch();
        if(!buf) throw new Error("Can't read source file to copy()");
        destEntry.override(buf);
    }

    copyTree(destEntry: Path, move: boolean = false) {
        // Recursive !!!
        if(this.isFile()) {
            this.copy(destEntry);
        } else {
            destEntry.mkdir();
            for(const file of (this.list() ?? [])) {
                this.get(file).copyTree(destEntry.get(file));
            }
        }

        if(move) this.removeTree();
    }

    isFile(): boolean {
        const st = this.stat();
        if(!st) return false;
        if(st.mode === undefined)
            return st.size > 0;

        return (st.mode & 32768) != 0;
    }

    isFolder(): boolean {
        if(this.absolutePath == "/storage") return true;

        const st = this.stat();
        if(!st) return false;
        if(st.mode == undefined) {
            return st.size == 0;
        }

        return (st.mode & 32768) == 0;
    }

    exists(): boolean {
        return !!this.stat()
    }

    list(): string[] | undefined {
        return fs.readdirSync({
            path: IS_MI_BAND_7 ? this.absolutePath : this.relativePath
        });
    }

    mkdir(): number {
        return fs.mkdirSync(IS_MI_BAND_7 ? this.absolutePath : this.relativePath);
    }

    seek(pos: number) {
        this.seekPosition = pos;
    }

    read(buffer: ArrayBuffer, offset: number, length: number) {
        fs.readSync({
            fd: this.openFile,
            buffer,
            options: {
                position: this.seekPosition,
                length: length,
                offset: offset,
            }
        })
    }

    write(buffer: ArrayBuffer, offset: number, length: number) {
        fs.writeSync({
            fd: this.openFile,
            buffer,
            options: {
                position: this.seekPosition,
                length: length,
                offset: offset,
            }
        })
    }

    close() {
        fs.closeSync(this.openFile);
    }
}

