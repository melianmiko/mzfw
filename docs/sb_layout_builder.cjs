const TYPE_BTN_TITLE = 0;
const TYPE_BTN_VALUE = 1;
const TYPE_BTN_ENTRY = 2;
const TYPE_DICT_INDEX = 128;
const TYPE_DICT_DATA = 129;

function json2bin(sourceObj) {
    function bundleTLV(data) {
        const rawData = [];
        for(const [type, value] of data) {
            const header = Buffer.alloc(3);
            header.writeUint8(type, 0);
            header.writeUint16LE(value.byteLength, 1);
            rawData.push(header);
            rawData.push(value);
        }
        return Buffer.concat(rawData);
    }
    function bundleDict(dict) {
        const indexParts = [];
        const dataParts = [];

        let offset = 0;
        for(const key in dict) {
            const rawKey = Buffer.from(key, "utf-8");
            const headline = Buffer.alloc(6);
            headline.writeUint16LE(rawKey.byteLength, 0);
            headline.writeUint16LE(offset, 2);
            headline.writeUint16LE(dict[key].byteLength, 4);
            indexParts.push(headline);
            indexParts.push(rawKey);
            dataParts.push(dict[key]);
            offset += dict[key].byteLength;
        }

        return bundleTLV([
            [TYPE_DICT_INDEX, Buffer.concat(indexParts)],
            [TYPE_DICT_DATA, Buffer.concat(dataParts)],
        ]);
    }

    // Transform renderers
    const rawRenderers = {};
    for(const renderer in sourceObj) {
        const rawLayouts = {};
        for(const layout in sourceObj[renderer]) {
            const rawButtons = [];
            for(const button of sourceObj[renderer][layout]) {
                const btnParts = [];
                if(button.title) btnParts.push([TYPE_BTN_TITLE, Buffer.from(button.title, "utf-8")]);
                for(const value of button.values)
                    btnParts.push([TYPE_BTN_VALUE, Buffer.from(value)]);
                rawButtons.push([TYPE_BTN_ENTRY, bundleTLV(btnParts)]);
            }
            rawLayouts[layout] = bundleTLV(rawButtons);
        }
        rawRenderers[renderer] = bundleDict(rawLayouts);
    }

    return Buffer.concat([
        Buffer.from("SB_DATA"),
        bundleDict(rawRenderers),
    ])
}

function bin2json(sourceData) {
    function parseTLV(data, length = data.byteLength) {
        const output = [];
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
    function parseDict(data, length = data.byteLength) {
        const parts = parseTLV(data, length);
        const indexBytes = parts[0][1];
        const dataBytes = parts[1][1];
        const output = {};

        let offset = 0;
        while(offset < indexBytes.byteLength) {
            const keyLength = indexBytes.readUint16LE(offset);
            const dataOffset = indexBytes.readUint16LE(offset + 2);
            const dataLength = indexBytes.readUint16LE(offset + 4);

            const key = indexBytes.subarray(offset + 6, offset + 6 + keyLength).toString("utf-8");
            output[key] = dataBytes.subarray(dataOffset, dataOffset + dataLength);
            offset += 6 + keyLength;
        }

        return output;
    }

    if(sourceData.subarray(0, 7).toString("utf-8") !== "SB_DATA")
        throw new Error("NotSbData");

    const output = parseDict(sourceData.subarray(7));
    for(const renderer in output) {
        output[renderer] = parseDict(output[renderer]);
        for(const layout in output[renderer]) {
            output[renderer][layout] = parseTLV(output[renderer][layout])
            for(const i in output[renderer][layout]) {
                const btnObj = {values: []};
                for(const [type, value] of parseTLV(output[renderer][layout][i][1])) {
                    switch (type) {
                    case TYPE_BTN_TITLE:
                        btnObj.title = value.toString("utf-8");
                        break
                    case TYPE_BTN_VALUE:
                        btnObj.values.push(value.toString("utf-8"));
                    }
                }
                output[renderer][layout][i] = btnObj;
            }
        }
    }
    return output;
}

function nodejsEntrypoint() {
    // noinspection NodeCoreCodingAssistance
    const fs = require("fs");
    const stdin = fs.readFileSync(0);
    if(stdin[0] === 123) {
        const data = JSON.parse(stdin.toString("utf-8"))
        process.stdout.write(json2bin(data));
    } else if(stdin[0] === 83) {
        process.stdout.write(JSON.stringify(bin2json(stdin), null, 4))
    } else {
        console.log("idk what to do", stdin[0])
    }
}

nodejsEntrypoint();
