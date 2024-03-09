import { SideMessaging } from "./SideMessaging";
import { MessageContext } from "./Types";
import { SideMessageEvents } from "./Enums";

/**
 * Use this for compatability with messageBuilder depend on code.
 */
export let messageBuilder: SideMessaging | null;

/**
 * Init messaging connection
 * @param appID Current app ID, if not set, we'll try to detect it from zeusx config
 */
export function initMessaging(appID: number) {
  messageBuilder = new SideMessaging(appID);
  messageBuilder.connect();
}

/**
 * Close messaging connection.
 * Call this in app.onDestroy()
 */
export function closeMessaging() {
  if(messageBuilder) messageBuilder.close();
}

/**
 * Add new message handler
 * @param callback Message handler
 */
export function registerMessageHandler(callback: (ctx: MessageContext) => any) {
  if(!messageBuilder) throw new MessagingNotInitializedError();
  messageBuilder.on(SideMessageEvents.ON_MESSAGE, callback);
}

/**
 * Remove new message handler
 * @param callback Message handler
 */
export function unregisterMessageHandler(callback?: (ctx: MessageContext) => any) {
  if(!messageBuilder) throw new MessagingNotInitializedError();
  messageBuilder.off(SideMessageEvents.ON_MESSAGE, callback);
}

/**
 * Send request via messaging connection to other side.
 *
 * @param data Any data
 * @param timeout Request timeout.
 */
export function sendRequestMessage<P>(data: any, timeout: number = 60000): Promise<P> {
  if(!messageBuilder) throw new MessagingNotInitializedError();
  return messageBuilder.request<P>(data, {timeout});
}

/**
 * This will be thrown if you forgot to initMessaging()
 */
export class MessagingNotInitializedError extends Error {
  name = "MessagingNotInitializedError";
  message = "initMessaging(appID) must be called first";
}
