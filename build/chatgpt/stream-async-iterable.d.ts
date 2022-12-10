export declare function streamAsyncIterable<T>(stream: ReadableStream<T>): AsyncGenerator<Awaited<T>, void, unknown>;
