export enum MessageType {
  HANDSHAKE = 1,
  CLOSE = 2,
  DATA = 4,
}

export enum MessageParseType {
  RAW,
  JSON,
  MULTIPART = 255,
}

export enum SideMessageEvents {
  ON_MESSAGE = "message",
}
