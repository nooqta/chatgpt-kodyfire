import ExpiryMap from 'expiry-map';
import * as types from './types';
import { ChatGPTConversation } from './chatgpt-conversation';
export declare class ChatGPTAPI {
    protected _sessionToken: string;
    protected _markdown: boolean;
    protected _apiBaseUrl: string;
    protected _backendApiBaseUrl: string;
    protected _userAgent: string;
    protected _accessTokenCache: ExpiryMap<string, string>;
    /**
     * Creates a new client wrapper around the unofficial ChatGPT REST API.
     *
     * @param opts.sessionToken = **Required** OpenAI session token which can be found in a valid session's cookies (see readme for instructions)
     * @param apiBaseUrl - Optional override; the base URL for ChatGPT webapp's API (`/api`)
     * @param backendApiBaseUrl - Optional override; the base URL for the ChatGPT backend API (`/backend-api`)
     * @param userAgent - Optional override; the `user-agent` header to use with ChatGPT requests
     * @param accessTokenTTL - Optional override; how long in milliseconds access tokens should last before being forcefully refreshed
     */
    constructor(opts: {
        sessionToken: string;
        /** @defaultValue `true` **/
        markdown?: boolean;
        /** @defaultValue `'https://chat.openai.com/api'` **/
        apiBaseUrl?: string;
        /** @defaultValue `'https://chat.openai.com/backend-api'` **/
        backendApiBaseUrl?: string;
        /** @defaultValue `'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'` **/
        userAgent?: string;
        /** @defaultValue 60000 (60 seconds) */
        accessTokenTTL?: number;
    });
    /**
     * Sends a message to ChatGPT, waits for the response to resolve, and returns
     * the response.
     *
     * If you want to receive a stream of partial responses, use `opts.onProgress`.
     * If you want to receive the full response, including message and conversation IDs,
     * you can use `opts.onConversationResponse` or use the `ChatGPTAPI.getConversation`
     * helper.
     *
     * @param message - The prompt message to send
     * @param opts.conversationId - Optional ID of a conversation to continue
     * @param opts.parentMessageId - Optional ID of the previous message in the conversation
     * @param opts.timeoutMs - Optional timeout in milliseconds (defaults to no timeout)
     * @param opts.onProgress - Optional callback which will be invoked every time the partial response is updated
     * @param opts.onConversationResponse - Optional callback which will be invoked every time the partial response is updated with the full conversation response
     * @param opts.abortSignal - Optional callback used to abort the underlying `fetch` call using an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
     *
     * @returns The response from ChatGPT
     */
    sendMessage(message: string, opts?: types.SendMessageOptions): Promise<string>;
    /**
     * @returns `true` if the client has a valid acces token or `false` if refreshing
     * the token fails.
     */
    getIsAuthenticated(): Promise<boolean>;
    /**
     * Refreshes the client's access token which will succeed only if the session
     * is still valid.
     */
    ensureAuth(): Promise<string>;
    /**
     * Attempts to refresh the current access token using the ChatGPT
     * `sessionToken` cookie.
     *
     * Access tokens will be cached for up to `accessTokenTTL` milliseconds to
     * prevent refreshing access tokens too frequently.
     *
     * @returns A valid access token
     * @throws An error if refreshing the access token fails.
     */
    refreshAccessToken(): Promise<string>;
    /**
     * Gets a new ChatGPTConversation instance, which can be used to send multiple
     * messages as part of a single conversation.
     *
     * @param opts.conversationId - Optional ID of the previous message in a conversation
     * @param opts.parentMessageId - Optional ID of the previous message in a conversation
     * @returns The new conversation instance
     */
    getConversation(opts?: {
        conversationId?: string;
        parentMessageId?: string;
    }): ChatGPTConversation;
}
