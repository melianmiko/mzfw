import { MessageContext, MessageRequestOptions, PendingMessageData } from "./Types";
import { MessageParseType, MessageType, SideMessageEvents } from "./Enums";
import { recoverSerializedData, serializeItem } from "./Serialize";
import { Deferred } from "./Deferred";
import { EventBus } from "./EventBus";
import { osImport } from "../../zosx/internal";
import { ZeppBleLibrary } from "../../zosx/ble";
import { ZeppSideServiceMessaging } from "../../zosx/side";

declare const messaging: ZeppSideServiceMessaging;

const DEBUG = false;
const PART_SIZE = 2048;
const RQ_HEADER_SIZE = 16;

export const IS_SIDE_SERVICE = typeof messaging != "undefined";

const ble: ZeppBleLibrary | null = IS_SIDE_SERVICE ? null : osImport<ZeppBleLibrary>("@zos/ble", "hmBle");

export class SideMessaging extends EventBus<SideMessageEvents, MessageContext> {
  private readonly appId: number;
  private appSidePort: number = 0;
  private waitHandshake: Deferred<void> = new Deferred<void>();
  private messageId: number = 959;
  private pendingReceive: Map<number, PendingMessageData> = new Map<number, PendingMessageData>();
  private pendingResponses: Map<number, Deferred<any>> = new Map<number, Deferred<any>>();

  constructor(appId: number) {
    super();
    this.appId = appId;
  }

  connect() {
    IS_SIDE_SERVICE ? this.sideConnect() : this.deviceConnect();
  }

  /**
   * Close message channel.
   */
  close() {
    if(this.appSidePort !== 0 && !IS_SIDE_SERVICE) {
      this.log("[MSG] Send close request...");
      const buffer = Buffer.alloc(20);
      const message = Buffer.from([this.appId]);
      this.writeHmHeader(MessageType.CLOSE, buffer);
      buffer.fill(message, 16, 16 + message.byteLength);
      this.sendBuffer(buffer);
    }
  }

  /**
   * Will connect to other side and perform handshake.
   * @private
   */
  private deviceConnect() {
    ble && ble.createConnect((index: number, data: ArrayBuffer, size: number) => {
      this.log(`[MSG][R] Message, index=${index}, size=${size}, data=${data}`)
      this.deviceProcessMessage(data);
    });

    // Initialize handshake
    if (this.appSidePort == 0) {
      this.log("[MSG] Send handshake request...");
      const buffer = Buffer.alloc(20);
      const message = Buffer.from([this.appId]);
      this.writeHmHeader(MessageType.HANDSHAKE, buffer);
      buffer.fill(message, 16, 16 + message.byteLength);
      this.sendBuffer(buffer);
    }
  }

  /**
   * Will initialize event waiting for side-service
   * @private
   */
  private sideConnect() {
    this.log("Waiting for messages...");
    messaging.peerSocket.addListener('message', (message: Buffer) => {
      this.processRawMessage(message);
    });

    // Auto-resolve handshake wait
    this.waitHandshake.resolve();
  }

  /**
   * Send request to other side.
   *
   * Request is a message or message sequence that requires a response from other side.
   *
   * @param data Data to send
   * @param options Extra options, including timeout
   */
  request<P = any>(data: any, options?: MessageRequestOptions): Promise<P> {
    const timeout: number = (options && options.timeout) ? options.timeout : 60000;

    return Promise.race<P>([
      new Promise<P>((_, reject) => setTimeout(() => {
          reject(new Error(`Request timed out in ${timeout}ms`));
      }, timeout)),
      this.waitHandshake.promise.then(() => {
        const messageID = this.messageId++;
        const deferred: Deferred<P> = new Deferred<P>();

        this.pendingResponses.set(messageID, deferred);
        this.sendMessage(data, messageID);

        return deferred.promise;
      })
    ]);
  }

  /**
   * Will process raw message data.
   *
   * @param buffer Buffer to handle.
   * @private
   */
  private processRawMessage(buffer: Buffer) {
    const messageID: number = buffer.readUInt16LE(8);

    // Setup pending object, if required
    let pending: PendingMessageData | undefined = this.pendingReceive.get(messageID);
    if(!pending) {
      pending = {
        type: buffer.readUInt16LE(0),
        parts: buffer.readUInt16LE(6),
        partStatus: {},
        buffer: Buffer.alloc(buffer.readUInt32LE(10)),
      };
      this.pendingReceive.set(messageID, pending);
      this.log(`[MSG] receiving msgId=${messageID}`);
    }

    const partLength: number = buffer.readUInt16LE(2);
    const partID: number = buffer.readUInt16LE(4);
    this.log(`[MSG] id=${messageID}, part=${partID}, len=${partLength}`);

    const offset: number = partID * PART_SIZE;
    buffer.copy(pending.buffer, offset,
      RQ_HEADER_SIZE, RQ_HEADER_SIZE + partLength);
    pending.partStatus[partID] = true;

    if(Object.keys(pending.partStatus).length == pending.parts) {
      this.log("[MSG] all parts ready, calling event...");
      this.log(pending.buffer);

      const pendingPromise = this.pendingResponses.get(messageID);

      if(pendingPromise) {

        this.log("[MSG] drop response to sender...");
        pendingPromise.resolve(recoverSerializedData(pending.buffer, pending.type));
        this.pendingResponses.delete(messageID);

      } else {

        this.log("[MSG] handle new message...");
        this.emit(SideMessageEvents.ON_MESSAGE, {
          response: (options) => this.sendMessage(options.data, messageID),
          request: {
            payload: recoverSerializedData(pending.buffer, pending.type),
          }
        })

      }
      this.pendingReceive.delete(messageID);
    }
  }

  /**
   * Will send provided data in message sequence to other side.
   * @param data Data to send
   * @param messageID Message ID
   * @private
   */
  private sendMessage(data: any, messageID: number) {
    // Prepare data
    const [body, parseType]: [Buffer, MessageParseType] = serializeItem(data);

    // Some constants
    const messageParts = Math.ceil(body.byteLength / PART_SIZE);
    this.log(`[MSG][S] Send id=${messageID}, parts=${messageParts}, total=${body.byteLength}`);

    // Prepare buffer
    const offset = IS_SIDE_SERVICE ? 0 : 16;
    const bufferSize = RQ_HEADER_SIZE + offset + Math.min(PART_SIZE, body.byteLength);
    const buffer = Buffer.alloc(bufferSize);

    if(!IS_SIDE_SERVICE)
      this.writeHmHeader(MessageType.DATA, buffer);

    buffer.writeUInt16LE(parseType, offset + 0); // messageType
    buffer.writeUInt16LE(0, offset + 2); // partLength
    buffer.writeUInt16LE(0, offset + 4); // partID
    buffer.writeUInt16LE(messageParts, offset + 6); // messageParts
    buffer.writeUInt16LE(messageID, offset + 8); // messageId
    buffer.writeUInt32LE(body.byteLength, offset + 10); // messageLength

    for(let partID = 0; partID < messageParts; partID++) {
      const dataOffset = partID * PART_SIZE;
      const dataLength = Math.min(PART_SIZE, body.byteLength - dataOffset);

      buffer.writeUInt16LE(dataLength, offset + 2); // partLength
      buffer.writeUInt16LE(partID, offset + 4); // partID
      body.copy(buffer, RQ_HEADER_SIZE + offset,
        dataOffset, dataOffset + dataLength);

      this.log(`[MSG][S][${messageID}] send part=${partID}, offset=${dataOffset}, length=${dataLength}`);
      this.sendBuffer(buffer);
    }
  }

  /**
   * Process received hm-style message
   * @param data Message binary data
   * @private of course
   */
  private deviceProcessMessage(data: ArrayBuffer): void {
    const buffer = Buffer.from(data);
    const flag = buffer.readUInt8(0);
    if(flag != 1) return;

    const type = buffer.readUInt16LE(2);
    this.log(buffer);
    this.log(`[MSG][R] type=${type}, length=${buffer.byteLength}`);

    switch (type) {
      case MessageType.HANDSHAKE:
        // Perform port exchange with side-service
        this.appSidePort = buffer.readUInt16LE(6);
        this.log(`[MSG][R] handshake complete appSidePort=${this.appSidePort}`);
        this.waitHandshake.resolve();
        break;
      case MessageType.DATA:
        // Process data message
        this.log("[MSG][R] data length=", buffer.byteLength - 16);
        this.processRawMessage(buffer.subarray(16) as Buffer);
        break
      default:
        this.log(`[MSG] unknownType type=${type}`);
        break;
    }
  }

  /**
   * Will send buffer content to other side.
   * If sending from device, buffer must contain hm-style header.
   *
   * @param buffer Buffer to send
   * @private literally nothing
   */
  private sendBuffer(buffer: Buffer) {
    if (IS_SIDE_SERVICE) {
      messaging.peerSocket.send(buffer);
    } else {
      ble && ble.send(buffer.buffer, buffer.byteLength);
    }
  }

  /**
   * This function will write hm-style message header to buffer.
   * Required to send data from swatch, so preserve 16 bytes in start of your buffer.
   *
   * @param type Message type (number)
   * @param buffer Buffer to write
   * @private noting
   */
  private writeHmHeader(type: MessageType, buffer: Buffer): void {
    buffer.writeUInt8(1, 0);
    buffer.writeUInt8(1, 1);
    buffer.writeUInt16LE(type, 2);
    buffer.writeUInt16LE(IS_SIDE_SERVICE ? this.appSidePort : 20, 4);
    buffer.writeUInt16LE(IS_SIDE_SERVICE ? 20 : this.appSidePort, 6);
    buffer.writeUInt32LE(this.appId, 8);
    buffer.writeUInt32LE(0, 12);
  }

  /**
   * Log write function (if DEBUG is false, will literally do nothing).
   * @param data Data to log
   * @private of course
   */
  private log(...data: any[]) {
    if(DEBUG)
      console.log(...data);
  }
}
