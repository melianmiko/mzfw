import { glob } from "../../zosx/internal";

const sessionStore = glob["__session_storage"] || {};
glob["__session_storage"] = sessionStore;

export class SessionStoragePolyfill implements Storage {
    get length(): number {
        return Object.keys(sessionStore).length;
    }

    clear(): void {
        for(const key in sessionStore)
            delete sessionStore[key];
    }

    getItem(key: string): string | null {
        return sessionStore[key] ?? null;
    }

    key(index: number): string | null {
        return Object.keys(sessionStore)[index];
    }

    removeItem(key: string): void {
        delete sessionStore[key];
    }

    setItem(key: string, value: string): void {
        sessionStore[key] = value;
    }
}
