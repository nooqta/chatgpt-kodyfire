import * as types from './types';
import { type ChatGPTAPI } from './chatgpt-api';
/**
 * A conversation wrapper around the ChatGPTAPI. This allows you to send
 * multiple messages to ChatGPT and receive responses, without having to
 * manually pass the conversation ID and parent message ID for each message.
 */
export declare class ChatGPTConversation {
    api: ChatGPTAPI;
    conversationId: string;
    parentMessageId: string;
    /**
     * Creates a new conversation wrapper around the ChatGPT API.
     *
     * @param api - The ChatGPT API instance to use
     * @param opts.conversationId - Optional ID of a conversation to continue
     * @param opts.parentMessageId - Optional ID of the previous message in the conversation
     */
    constructor(api: ChatGPTAPI, opts?: {
        conversationId?: string;
        parentMessageId?: string;
    });
    /**
     * Sends a message to ChatGPT, waits for the response to resolve, and returns
     * the response.
     *
     * If this is the first message in the conversation, the conversation ID and
     * parent message ID will be automatically set.
     *
     * This allows you to send multiple messages to ChatGPT and receive responses,
     * without having to manually pass the conversation ID and parent message ID
     * for each message.
     *
     * @param message - The prompt message to send
     * @param opts.onProgress - Optional callback which will be invoked every time the partial response is updated
     * @param opts.onConversationResponse - Optional callback which will be invoked every time the partial response is updated with the full conversation response
     * @param opts.abortSignal - Optional callback used to abort the underlying `fetch` call using an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
     *
     * @returns The response from ChatGPT
     */
    sendMessage(message: string, opts?: types.SendConversationMessageOptions): Promise<string>;
}
