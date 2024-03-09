import { SideFetchResult } from "./Types";

export class ResponseWrapper {
    private readonly rawData: Buffer | string;
    readonly headers: Map<string, string>;
    readonly ok: boolean;
    readonly status: number;
    readonly url: string;
    readonly body: null = null;

    constructor(url: string, data: SideFetchResult) {
        this.rawData = data[1];
        this.headers = new Map<string, string>(Object.entries(data[0].headers));
        this.status = data[0].status;
        this.ok = this.status == 200;
        this.url = url;
    }

    arrayBuffer(): Promise<ArrayBuffer> {
        if(typeof this.rawData == "string")
            throw new Error("not supported");
        return Promise.resolve(this.rawData.buffer);
    }

    json(): Promise<any> {
        return this.text().then((text) => {
            return JSON.parse(text);
        })
    }

    text(): Promise<string> {
        if(typeof this.rawData == "string")
            return Promise.resolve(this.rawData);
        return Promise.resolve(this.rawData.toString("utf-8"));
    }
}
