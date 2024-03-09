import { MessageParseType } from "./Enums";

export type PendingMessageData = {
  type: MessageParseType,
  parts: number,
  partStatus: {[id: number]: boolean},
  buffer: Buffer,
}

export type MessageContext = {
  response: (options: {data: any}) => void,
  request: {
    payload: any,
  }
}

export type MessageRequestOptions = {
  timeout?: number,
}
