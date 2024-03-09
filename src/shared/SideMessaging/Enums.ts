export enum MessageType {
  HANDSHAKE = 1,
  CLOSE = 2,
  DATA = 4,
}

export enum MessageParseType {
  RAW,
  JSON,
}

export enum SideMessageEvents {
  ON_MESSAGE = "message",
}
