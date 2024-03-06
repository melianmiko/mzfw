import {isLegacyAPI, osImport} from "./index";

const sysRouter = osImport("@zos/router", "hmApp");

export type IHmAppGoToParams = HmWearableProgram.DeviceSide.AppRouter.IHmAppGoToParams;

export function push(opt: {url: string, params: string}) {
    return isLegacyAPI ? sysRouter.gotoPage({
        url: opt.url,
        param: opt.params,
    }) : sysRouter.push(opt);
}

export const back: () => void = isLegacyAPI ? sysRouter.goBack : sysRouter.back;
