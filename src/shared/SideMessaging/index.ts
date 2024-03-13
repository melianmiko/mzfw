import { SideMessaging } from "./SideMessaging";
import { MessageContext } from "./Types";
import { SideMessageEvents } from "./Enums";
import { glob } from "../../zosx/internal";
import { getAppTags } from "../AppTagsProvider";

/**
 * Init messaging connection
 */
export function initMessaging() {
  const appId = getAppTags(true)[0];

  glob["messageBuilder"] = new SideMessaging(appId);
  glob["messageBuilder"].connect();
}

/**
 * Close messaging connection.
 * Call this in app.onDestroy()
 */
export function closeMessaging() {
  const messageBuilder: SideMessaging | null = glob["messageBuilder"];
  if(messageBuilder) messageBuilder.close();
}

/**
 * Add new message handler
 * @param callback Message handler
 */
export function registerMessageHandler(callback: (ctx: MessageContext) => any) {
  const messageBuilder: SideMessaging | null = glob["messageBuilder"];
  if(!messageBuilder) throw new MessagingNotInitializedError();
  messageBuilder.on(SideMessageEvents.ON_MESSAGE, callback);
}

/**
 * Remove new message handler
 * @param callback Message handler
 */
export function unregisterMessageHandler(callback?: (ctx: MessageContext) => any) {
  const messageBuilder: SideMessaging | null = glob["messageBuilder"];
  if(!messageBuilder) throw new MessagingNotInitializedError();
  messageBuilder.off(SideMessageEvents.ON_MESSAGE, callback);
}

/**
 * Send request via messaging connection to other side.
 *
 * @param data Any data
 * @param timeout Request timeout.
 */
export function sendRequestMessage<D = any, P = any>(data: D, timeout: number = 60000): Promise<P> {
  const messageBuilder: SideMessaging | null = glob["messageBuilder"];
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
