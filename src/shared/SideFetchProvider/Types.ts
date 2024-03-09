export type SideFetchRequest = [
    "mzfw.fetch",                       // id
    string,                             // request url
    {                                   // request options
        method: string,
        headers?: {[id: string]: string},
    },
    Buffer | null, // request body
];

export type SideFetchResult = [
    {                       // response options
        status: number,
        headers: {},
    },
    Buffer | string,        // response body
];
