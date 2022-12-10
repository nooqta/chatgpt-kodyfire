"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPTConversation = void 0;
/**
 * A conversation wrapper around the ChatGPTAPI. This allows you to send
 * multiple messages to ChatGPT and receive responses, without having to
 * manually pass the conversation ID and parent message ID for each message.
 */
class ChatGPTConversation {
    /**
     * Creates a new conversation wrapper around the ChatGPT API.
     *
     * @param api - The ChatGPT API instance to use
     * @param opts.conversationId - Optional ID of a conversation to continue
     * @param opts.parentMessageId - Optional ID of the previous message in the conversation
     */
    constructor(api, opts = {}) {
        this.conversationId = undefined;
        this.parentMessageId = undefined;
        this.api = api;
        this.conversationId = opts.conversationId;
        this.parentMessageId = opts.parentMessageId;
    }
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
    sendMessage(message, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { onConversationResponse } = opts, rest = __rest(opts, ["onConversationResponse"]);
            return this.api.sendMessage(message, Object.assign(Object.assign({}, rest), { conversationId: this.conversationId, parentMessageId: this.parentMessageId, onConversationResponse: (response) => {
                    var _a;
                    if (response.conversation_id) {
                        this.conversationId = response.conversation_id;
                    }
                    if ((_a = response.message) === null || _a === void 0 ? void 0 : _a.id) {
                        this.parentMessageId = response.message.id;
                    }
                    if (onConversationResponse) {
                        return onConversationResponse(response);
                    }
                } }));
        });
    }
}
exports.ChatGPTConversation = ChatGPTConversation;
//# sourceMappingURL=chatgpt-conversation.js.map