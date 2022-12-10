import { fetch } from './fetch';
export declare function fetchSSE(url: string, options: Parameters<typeof fetch>[1] & {
    onMessage: (data: string) => void;
}): Promise<void>;
