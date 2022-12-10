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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
const chatgpt_api_1 = require("./chatgpt-api");
dotenv_safe_1.default.config();
const isCI = !!process.env.CI;
(0, ava_1.default)('ChatGPTAPI invalid session token', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.timeout(30 * 1000); // 30 seconds
    t.throws(() => new chatgpt_api_1.ChatGPTAPI({ sessionToken: '' }), {
        message: 'ChatGPT invalid session token'
    });
    yield t.throwsAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const chatgpt = new chatgpt_api_1.ChatGPTAPI({ sessionToken: 'invalid' });
        yield chatgpt.ensureAuth();
    }), {
        message: 'ChatGPT failed to refresh auth token. Error: Unauthorized'
    });
}));
(0, ava_1.default)('ChatGPTAPI valid session token', (t) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isCI) {
        t.timeout(2 * 60 * 1000); // 2 minutes
    }
    t.notThrows(() => new chatgpt_api_1.ChatGPTAPI({ sessionToken: 'fake valid session token' }));
    yield t.notThrowsAsync((() => __awaiter(void 0, void 0, void 0, function* () {
        const chatgpt = new chatgpt_api_1.ChatGPTAPI({
            sessionToken: process.env.SESSION_TOKEN || ''
        });
        // Don't make any real API calls using our session token if we're running on CI
        if (!isCI) {
            yield chatgpt.ensureAuth();
            const response = yield chatgpt.sendMessage('test');
            console.log('chatgpt response', response);
            t.truthy(response);
            t.is(typeof response, 'string');
        }
    }))());
}));
if (!isCI) {
    (0, ava_1.default)('ChatGPTAPI expired session token', (t) => __awaiter(void 0, void 0, void 0, function* () {
        t.timeout(30 * 1000); // 30 seconds
        const expiredSessionToken = process.env.TEST_EXPIRED_SESSION_TOKEN || '';
        yield t.throwsAsync(() => __awaiter(void 0, void 0, void 0, function* () {
            const chatgpt = new chatgpt_api_1.ChatGPTAPI({ sessionToken: expiredSessionToken });
            yield chatgpt.ensureAuth();
        }), {
            message: 'ChatGPT failed to refresh auth token. Error: session token may have expired'
        });
    }));
}
if (!isCI) {
    (0, ava_1.default)('ChatGPTAPI timeout', (t) => __awaiter(void 0, void 0, void 0, function* () {
        t.timeout(30 * 1000); // 30 seconds
        yield t.throwsAsync(() => __awaiter(void 0, void 0, void 0, function* () {
            const chatgpt = new chatgpt_api_1.ChatGPTAPI({
                sessionToken: process.env.SESSION_TOKEN || ''
            });
            yield chatgpt.sendMessage('test', {
                timeoutMs: 1
            });
        }), {
            message: 'ChatGPT timed out waiting for response'
        });
    }));
    (0, ava_1.default)('ChatGPTAPI abort', (t) => __awaiter(void 0, void 0, void 0, function* () {
        t.timeout(30 * 1000); // 30 seconds
        yield t.throwsAsync(() => __awaiter(void 0, void 0, void 0, function* () {
            const chatgpt = new chatgpt_api_1.ChatGPTAPI({
                sessionToken: process.env.SESSION_TOKEN || ''
            });
            const abortController = new AbortController();
            setTimeout(() => abortController.abort(), 10);
            yield chatgpt.sendMessage('test', {
                abortSignal: abortController.signal
            });
        }), {
            message: 'testing abort'
        });
    }));
}
//# sourceMappingURL=chatgpt-api.test.js.map