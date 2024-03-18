import { readFileSync, rmSync, writeFileSync } from "../../zosx/fs";

export class ConfigStorage implements Storage {
    private data: {[id: string]: string} = {};
    private dataRestored: boolean = false;
    private writeTimer: NodeJS.Timeout | null = null;
    private readonly filename: string;

    constructor(filename: string) {
        this.filename = filename;
    }

    private handleChanges() {
        if(this.writeTimer)
            clearTimeout(this.writeTimer);

        setTimeout(() => {
            this.writeTimer = null;

            // console.log("[cs] dump", JSON.stringify(this.data), "to", this.filename);
            writeFileSync({
                path: this.filename,
                data: JSON.stringify(this.data),
                options: {
                    encoding: "utf8",
                }
            })
            // console.log("Complete");
        }, 200);
    }

    private loadData() {
        const data = readFileSync({
            path: this.filename,
            options: {
                encoding: "utf8",
            }
        });

        console.log("[cs] loadData", data);
        if(typeof data == "string") {
            try {
                this.data = JSON.parse(data);
                if(!this.data || this.data.constructor != Object) {
                    console.log("[cs] failed to parse data", this.data);
                    this.data = {};
                }
            } catch(e) {
                console.log("[cs] load error", e);
            }
        }

        this.dataRestored = true;
    }
    get length(): number {
        if(!this.dataRestored) this.loadData();
        return 0; // TODO
    }

    clear(): void {
        this.data = {};
        this.dataRestored = true;
        rmSync(this.filename);
    }

    getItem(key: string): any | null {
        if(!this.dataRestored) this.loadData();
        return this.data[key] ?? null;
    }

    key(index: number): string | null {
        if(!this.dataRestored) this.loadData();
        return Object.keys(this.data)[index] ?? null;
    }

    removeItem(key: string): void {
        if(!this.dataRestored) this.loadData();
        delete this.data[key];
        this.handleChanges();
    }

    setItem(key: string, value: any): void {
        if(!this.dataRestored) this.loadData();
        this.data[key] = value;
        this.handleChanges();
    }
}
