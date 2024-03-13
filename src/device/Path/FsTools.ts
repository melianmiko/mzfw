import { getAppTags } from "../../shared/AppTagsProvider";

export function getAppLocationTags(): [string, string] {
    const [id, type] = getAppTags();
    const idn = id.toString(16).padStart(8, "0").toUpperCase();
    return [`js_${type}s`, idn];
}

export function fullAssetPath(path: string) {
    const [base, idn] = getAppLocationTags();
    return `/storage/${base}/${idn}/assets${path}`;
}

export function fullDataPath(path: string) {
    const [base, idn] = getAppLocationTags();
    return `/storage/${base}/data/${idn}${path}`;
}

export function prettyPrintBytes(val: number, useBase2:boolean = false) {
    const options = useBase2 ? ["B", "KiB", "MiB", "GiB"] : ["B", "KB", "MB", "GB"];
    const base = useBase2 ? 1024 : 1000;

    let curr = 0;
    while (val > 800 && curr < options.length) {
        val = val / base;
        curr++;
    }
    return Math.round(val * 100) / 100 + " " + options[curr];
}
