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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSSE = void 0;
const eventsource_parser_1 = require("eventsource-parser");
const fetch_1 = require("./fetch");
const stream_async_iterable_1 = require("./stream-async-iterable");
function fetchSSE(url, options) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const { onMessage } = options, fetchOptions = __rest(options, ["onMessage"]);
        const res = yield (0, fetch_1.fetch)(url, fetchOptions);
        if (!res.ok) {
            throw new Error(`ChatGPTAPI error ${res.status || res.statusText}`);
        }
        const parser = (0, eventsource_parser_1.createParser)((event) => {
            if (event.type === 'event') {
                onMessage(event.data);
            }
        });
        if (!res.body.getReader) {
            // Vercel polyfills `fetch` with `node-fetch`, which doesn't conform to
            // web standards, so this is a workaround...
            const body = res.body;
            if (!body.on || !body.read) {
                throw new Error('unsupported "fetch" implementation');
            }
            body.on('readable', () => {
                let chunk;
                while (null !== (chunk = body.read())) {
                    parser.feed(chunk.toString());
                }
            });
        }
        else {
            try {
                for (var _d = true, _e = __asyncValues((0, stream_async_iterable_1.streamAsyncIterable)(res.body)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        const str = new TextDecoder().decode(chunk);
                        parser.feed(str);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    });
}
exports.fetchSSE = fetchSSE;
//# sourceMappingURL=fetch-sse.js.map