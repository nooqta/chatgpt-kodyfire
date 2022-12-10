"use strict";
/// <reference lib="dom" />
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
let _undici;
// Use `undici` for node.js 16 and 17
// Use `fetch` for node.js >= 18
// Use `fetch` for all other environments, including browsers
// NOTE: The top-level await is removed in a `postbuild` npm script for the
// browser build
const fetch = (_a = globalThis.fetch) !== null && _a !== void 0 ? _a : function undiciFetchWrapper(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!_undici) {
            _undici = yield Promise.resolve().then(() => __importStar(require('undici')));
        }
        if (typeof (_undici === null || _undici === void 0 ? void 0 : _undici.fetch) !== 'function') {
            throw new Error('Invalid undici installation; please make sure undici is installed correctly in your node_modules. Note that this package requires Node.js >= 16.8');
        }
        return _undici.fetch(...args);
    });
};
exports.fetch = fetch;
//# sourceMappingURL=fetch.js.map