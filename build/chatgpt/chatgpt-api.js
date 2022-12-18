"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPTAPI = void 0;
const expiry_map_1 = __importDefault(require("expiry-map"));
const uuid_1 = require("uuid");
const chatgpt_conversation_1 = require("./chatgpt-conversation");
const fetch_1 = require("./fetch");
const fetch_sse_1 = require("./fetch-sse");
const utils_1 = require("./utils");
const KEY_ACCESS_TOKEN = 'accessToken';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36';
class ChatGPTAPI {
    /**
     * Creates a new client wrapper around the unofficial ChatGPT REST API.
     *
     * @param opts.sessionToken = **Required** OpenAI session token which can be found in a valid session's cookies (see readme for instructions)
     * @param apiBaseUrl - Optional override; the base URL for ChatGPT webapp's API (`/api`)
     * @param backendApiBaseUrl - Optional override; the base URL for the ChatGPT backend API (`/backend-api`)
     * @param userAgent - Optional override; the `user-agent` header to use with ChatGPT requests
     * @param accessTokenTTL - Optional override; how long in milliseconds access tokens should last before being forcefully refreshed
     */
    constructor(opts) {
        const { sessionToken, markdown = true, apiBaseUrl = 'https://chat.openai.com/api', backendApiBaseUrl = 'https://chat.openai.com/backend-api', userAgent = USER_AGENT, accessTokenTTL = 60000 // 60 seconds
         } = opts;
        this._sessionToken = sessionToken;
        this._markdown = !!markdown;
        this._apiBaseUrl = apiBaseUrl;
        this._backendApiBaseUrl = backendApiBaseUrl;
        this._userAgent = userAgent;
        this._accessTokenCache = new expiry_map_1.default(accessTokenTTL);
        if (!this._sessionToken) {
            throw new Error('ChatGPT invalid session token');
        }
    }
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
    sendMessage(message, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conversationId, parentMessageId = (0, uuid_1.v4)(), timeoutMs, onProgress, onConversationResponse } = opts;
            let { abortSignal } = opts;
            // @ts-ignore
            let abortController = undefined;
            if (timeoutMs && !abortSignal) {
                abortController = new AbortController();
                abortSignal = abortController.signal;
            }
            const accessToken = yield this.refreshAccessToken();
            const body = {
                action: 'next',
                messages: [
                    {
                        id: (0, uuid_1.v4)(),
                        role: 'user',
                        content: {
                            content_type: 'text',
                            parts: [message]
                        }
                    }
                ],
                model: 'text-davinci-002-render',
                parent_message_id: parentMessageId
            };
            if (conversationId) {
                body.conversation_id = conversationId;
            }
            const url = `${this._backendApiBaseUrl}/conversation`;
            let response = '';
            const responseP = new Promise((resolve, reject) => {
                (0, fetch_sse_1.fetchSSE)(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'User-Agent': this._userAgent
                    },
                    body: JSON.stringify(body),
                    signal: abortSignal,
                    onMessage: (data) => {
                        var _a, _b;
                        if (data === '[DONE]') {
                            return resolve(response);
                        }
                        try {
                            const parsedData = JSON.parse(data);
                            if (onConversationResponse) {
                                onConversationResponse(parsedData);
                            }
                            const message = parsedData.message;
                            // console.log('event', JSON.stringify(parsedData, null, 2))
                            if (message) {
                                let text = (_b = (_a = message === null || message === void 0 ? void 0 : message.content) === null || _a === void 0 ? void 0 : _a.parts) === null || _b === void 0 ? void 0 : _b[0];
                                if (text) {
                                    if (!this._markdown) {
                                        text = (0, utils_1.markdownToText)(text);
                                    }
                                    response = text;
                                    if (onProgress) {
                                        onProgress(text);
                                    }
                                }
                            }
                        }
                        catch (err) {
                            console.warn('fetchSSE onMessage unexpected error', err);
                            reject(err);
                        }
                    }
                }).catch(reject);
            });
            if (timeoutMs) {
                if (abortController) {
                    // This will be called when a timeout occurs in order for us to forcibly
                    // ensure that the underlying HTTP request is aborted.
                    ;
                    responseP.cancel = () => {
                        abortController.abort();
                    };
                }
                const pTimeout = yield (yield Promise.resolve().then(() => __importStar(require('p-timeout')))).default;
                return pTimeout(responseP, {
                    milliseconds: timeoutMs,
                    message: 'ChatGPT timed out waiting for response'
                });
            }
            else {
                return responseP;
            }
        });
    }
    /**
     * @returns `true` if the client has a valid acces token or `false` if refreshing
     * the token fails.
     */
    getIsAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                void (yield this.refreshAccessToken());
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    /**
     * Refreshes the client's access token which will succeed only if the session
     * is still valid.
     */
    ensureAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.refreshAccessToken();
        });
    }
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
    refreshAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedAccessToken = this._accessTokenCache.get(KEY_ACCESS_TOKEN);
            if (cachedAccessToken) {
                return cachedAccessToken;
            }
            try {
                const res = yield (0, fetch_1.fetch)('https://chat.openai.com/api/auth/session', {
                    headers: {
                        cookie: `__Secure-next-auth.session-token=${this._sessionToken}`,
                        'user-agent': this._userAgent
                    }
                }).then((r) => {
                    if (!r.ok) {
                        throw new Error(`${r.status} ${r.statusText}`);
                    }
                    return r.json();
                });
                const accessToken = res === null || res === void 0 ? void 0 : res.accessToken;
                if (!accessToken) {
                    throw new Error('Unauthorized');
                }
                const error = res === null || res === void 0 ? void 0 : res.error;
                if (error) {
                    if (error === 'RefreshAccessTokenError') {
                        throw new Error('session token may have expired');
                    }
                    else {
                        throw new Error(error);
                    }
                }
                this._accessTokenCache.set(KEY_ACCESS_TOKEN, accessToken);
                return accessToken;
            }
            catch (err) {
                throw new Error(`ChatGPT failed to refresh auth token. ${err.toString()}`);
            }
        });
    }
    /**
     * Gets a new ChatGPTConversation instance, which can be used to send multiple
     * messages as part of a single conversation.
     *
     * @param opts.conversationId - Optional ID of the previous message in a conversation
     * @param opts.parentMessageId - Optional ID of the previous message in a conversation
     * @returns The new conversation instance
     */
    getConversation(opts = {}) {
        return new chatgpt_conversation_1.ChatGPTConversation(this, opts);
    }
}
exports.ChatGPTAPI = ChatGPTAPI;
//# sourceMappingURL=chatgpt-api.js.map