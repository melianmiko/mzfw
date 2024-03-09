import { MessageParseType } from "./Enums";

export function serializeItem(data: any): [Buffer, MessageParseType] {
  if(data instanceof Buffer)
    return [data, MessageParseType.RAW];

  if(data instanceof Array) {
    // Multipart TLV message (NOTE: require a lot of RAM for generation, avoid using in device)
    const partials: [Buffer, MessageParseType][] = [];

    // Prepare partial items, calculate full size
    let totalSize: number = 0;
    for(const item of data) {
      const result = serializeItem(item);
      partials.push(result);
      totalSize += result[0].byteLength + 3; // data + type (1) + length (2 bytes)
    }

    // Build final buffer
    const buffer = Buffer.alloc(totalSize);
    let offset: number = 0;
    for(const [data, type] of partials) {
      buffer.writeUint8(type, offset);
      buffer.writeUint16LE(data.byteLength, offset + 1);
      data.copy(buffer, offset + 3);
      offset += data.byteLength + 3;
    }

    return [buffer, MessageParseType.MULTIPART];
  }

  return [Buffer.from(JSON.stringify(data), "utf-8"), MessageParseType.JSON];
}

export function recoverSerializedData(buffer: Buffer, type: MessageParseType): any {
  switch(type) {
    case MessageParseType.MULTIPART:
      let offset = 0;
      const result: any[] = [];
      while(offset < buffer.byteLength) {
        const type: MessageParseType = buffer.readUint8(offset);
        const length: number = buffer.readUInt16LE(offset + 1);
        // const data: Buffer = buffer.subarray(offset + 3, offset + length + 3);
        const data: Buffer = Buffer.alloc(length);
        buffer.copy(data, 0, offset + 3, offset + length + 3);
        result.push(recoverSerializedData(data, type));
        offset += length + 3;
      }
      return result;
    case MessageParseType.JSON:
      return JSON.parse(buffer.toString("utf-8"));
    case MessageParseType.RAW:
      return buffer;
  }
}

