import { IS_SIDE_SERVICE } from "../SideMessaging/SideMessaging";
import { registerMessageHandler, sendRequestMessage } from "../SideMessaging";
import { SideFetchRequest, SideFetchResult } from "./Types";
import { MessageContext } from "../SideMessaging/Types";
import { ResponseWrapper } from "./ResponseWrapper";
import { glob } from "../../zosx/internal";

/**
 * Side-service fetch handler.
 *
 * @param ctx Message context
 * @param payload Request
 */
function processFetchRequest(ctx: MessageContext, payload: SideFetchRequest) {
    const [_, url, options, body] = payload;
    const rq = {
        url,
        method: options.method,
        headers: options.headers ?? {},
        body: body instanceof Buffer ? body.buffer : undefined,
    };
    const resp: SideFetchResult = [
        {
            status: 0,
            headers: {},
        },
        "",
    ];

    console.log("[fetch_in]", rq);
    // Side-service fetch has no typings and didn't match with real JS one...
    (fetch as any)(rq).then((r: any) => {
        resp[0].status = r.status;
        resp[0].headers = r.headers;

        return r.arrayBuffer ? r.arrayBuffer() : r.body;
    }).then((d: ArrayBuffer | string) => {
        if(d instanceof ArrayBuffer) {
            resp[1] = Buffer.from(d)
        } else {
            resp[1] = d;
        }

        console.log("[fetch_out]", resp);
        ctx.response({data: resp});
    }).catch((e: Error) => {
        console.error("fetch_fwd_err", e);

        resp[0].status = 0;
        ctx.response({data: resp});
    })
}

/**
 * Client fetch function
 * @param url URL to fetch
 * @param userOptions Extra options
 */
function clientFetch(url: string, userOptions?: RequestInit): Promise<ResponseWrapper> {
    let body: Buffer | null = null;
    if(userOptions && userOptions.body)
        body = Buffer.from(userOptions.body as any);

    const options = {
        method: (userOptions && userOptions.method) ? userOptions.method : "GET",
        header: (userOptions && userOptions.headers) ? userOptions.headers : {},
    }
    return sendRequestMessage<SideFetchRequest, SideFetchResult>(["mzfw.fetch", url, options, body]).then((d) => {
        return new ResponseWrapper(url, d);
    })
}

/**
 * This function will fet up global `fetch` function in device side,
 * and their handler in side-service side.
 */
export function initFetchProvider() {
    if(IS_SIDE_SERVICE) {

        registerMessageHandler((ctx) => {
            if(ctx.request.payload instanceof Array && ctx.request.payload.length > 0 && ctx.request.payload[0] == "mzfw.fetch") {
                processFetchRequest(ctx, ctx.request.payload as SideFetchRequest);
            }
        });

    } else {

        glob.fetch = clientFetch;

    }
}
