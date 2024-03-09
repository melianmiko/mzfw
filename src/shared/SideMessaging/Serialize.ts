import { MessageParseType } from "./Enums";

export function serializeItem(data: any): [Buffer, MessageParseType] {
  if(data instanceof Buffer)
    return [data, MessageParseType.RAW];

  return [Buffer.from(JSON.stringify(data), "utf-8"), MessageParseType.JSON];
}

export function recoverSerializedData(data: Buffer, type: MessageParseType): any {
  switch(type) {
    case MessageParseType.JSON:
      return JSON.parse(data.toString("utf-8"));
    case MessageParseType.RAW:
      return data;
  }
}

