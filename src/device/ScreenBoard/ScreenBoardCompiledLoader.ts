import { O_RDONLY, openAssetsSync, readSync } from "../../zosx/fs";
import { ScreenBoardButtonData, ScreenBoardLayout, ScreenBoardLayoutsCollection } from "./Interfaces";

type DictIndex = {[key: string]: [number, number]};

const TYPE_BTN_TITLE = 0;
const TYPE_BTN_VALUE = 1;
const TYPE_DICT_INDEX = 128;

function proxyDictionary<P = any>(keys: string[], handler: (key: string) => P): {[id: string]: P} {
    const out: {[id: string]: P} = {};
    keys.forEach((key: string) => {
        Object.defineProperty(out, key, {
            get: () => handler(key),
        });
    });
    return out;
}

function parseTLV(data: Buffer, length: number = data.byteLength): [number, Buffer][] {
    const output: [number, Buffer][] = [];
    let offset = 0;
    while(offset < length) {
        const type = data.readUInt8(offset);
        const length = data.readUint16LE(offset + 1);
        const part = data.subarray(offset + 3, offset + 3 + length);
        output.push([type, part]);
        offset += 3 + length;
    }
    return output;
}


export function dynamicLoadScreenBoardLayouts(filename: string) {
    const buffer = Buffer.alloc(4096);
    const fd = openAssetsSync({path: filename, flag: O_RDONLY});
    const rdCache: {[id: string]: ScreenBoardLayoutsCollection} = {};
    const lyCache: {[id: string]: ScreenBoardLayout} = {};

    // Tools
    function readDictIndex(fileOffset: number): [DictIndex, number] {
        const output: {[key: string]: [number, number]} = {};
        readSync({fd, buffer: buffer.buffer, options: {position: fileOffset, length: buffer.byteLength}});

        if(buffer.readUint8(0) != TYPE_DICT_INDEX)
            throw new Error("!TYPE_DICT_INDEX");
        const indexLength = buffer.readInt16LE(1);
        if(indexLength > buffer.byteLength)
            throw new Error("too_big_index");

        let offset: number = 3;
        while(offset < indexLength) {
            const keyLength = buffer.readUint16LE(offset);
            const dataOffset = buffer.readUint16LE(offset + 2);
            const dataLength = buffer.readUint16LE(offset + 4);

            const key = buffer.subarray(offset + 6, offset + 6 + keyLength).toString("utf-8");
            output[key] = [dataOffset, dataLength];
            offset += 6 + keyLength;
        }

        return [output, indexLength];
    }

    // Read renderers index
    const fileOffset = 7;
    const [rdIndex, rdIndexLength] = readDictIndex(fileOffset);

    return proxyDictionary<ScreenBoardLayoutsCollection>(Object.keys(rdIndex), (rendererName: string) => {
        if(rdCache[rendererName])
            return rdCache[rendererName];
        const [rdOffset, _] = rdIndex[rendererName];
        console.log(`[sbcr] read ${rendererName} index`);

        // Read layouts index
        const fileOffset = 7 + 3 + rdIndexLength + 3 + rdOffset;
        const [lyIndex, lyIndexLen] = readDictIndex(fileOffset);

        return rdCache[rendererName] = proxyDictionary<ScreenBoardLayout>(Object.keys(lyIndex), (layoutName: string) => {
            const cacheKey = `${rendererName}_${layoutName}`
            if(lyCache[cacheKey]) return lyCache[cacheKey];

            const [lyOffset, lyLength] = lyIndex[layoutName];
            const fileOffset = 7 + 3 + rdIndexLength + 3 + rdOffset + 3 + lyIndexLen + 3 + lyOffset;
            console.log(`[sbcr] read ${rendererName}/${layoutName} index`);
            if(lyLength > buffer.byteLength)
                throw new Error("buf_overflow");

            readSync({fd, buffer: buffer.buffer, options: {position: fileOffset, length: lyLength}});

            const rawButtons: [number, Buffer][] = parseTLV(buffer, lyLength);
            const buttons: ScreenBoardLayout = [];
            for(const i in rawButtons) {
                const btnObj: ScreenBoardButtonData = {values: []};
                for (const [type, value] of parseTLV(rawButtons[i][1])) {
                    switch (type) {
                    case TYPE_BTN_TITLE:
                        btnObj.title = value.toString("utf-8");
                        break
                    case TYPE_BTN_VALUE:
                        btnObj.values.push(value.toString("utf-8"));
                    }
                }
                buttons.push(btnObj);
            }
            lyCache[cacheKey] = buttons;
            return buttons;
        })
    })
}
