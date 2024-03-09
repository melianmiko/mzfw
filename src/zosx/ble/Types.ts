export type ZeppBleLibrary = {
    // Only side-service connection features are available.
    // If you need other, use osImport(...) to access 3.0's BLE
    createConnect(callback: (index: number, data: ArrayBuffer, size: number) => any): void;
    disConnect(): void;
    connectStatus(): boolean;
    addListener(callback: (status: boolean) => any): void;
    send(data: ArrayBuffer, size: number): void;
}
