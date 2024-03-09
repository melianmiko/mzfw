export type ZeppSideServiceMessaging = {
    peerSocket: {
        addListener(event: "message", callback: (message: Buffer) => any): void;
        send(buffer: Buffer): void;
    }
}
