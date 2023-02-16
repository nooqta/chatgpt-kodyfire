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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Md = void 0;
const path_1 = require("path");
const core_1 = require("@angular-devkit/core");
const pluralize = require("pluralize");
const basic_kodyfire_1 = require("basic-kodyfire");
const engine_1 = require("./engine");
const esm_ts_1 = require("esm-ts");
const dotenv = __importStar(require("dotenv"));
class Md extends basic_kodyfire_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
        this.extension = ".md"; // replace with your extension
        dotenv.config();
        this.engine = new engine_1.Engine();
        this.params = technology.params;
        // Register functions you want to use in your templates with the engine builder registerHelper method.
        this.engine.builder.registerHelper("uppercase", (value) => {
            return value.toUpperCase();
        });
        this.engine.builder.registerHelper("pluralize", (value) => {
            return pluralize(value);
        });
        this.engine.builder.registerHelper("lowercase", (value) => {
            return value === null || value === void 0 ? void 0 : value.toLowerCase();
        });
        for (const key in core_1.strings) {
            this.engine.builder.registerHelper(key, (value) => {
                /* @ts-ignore */
                return core_1.strings[key](value);
            });
        }
    }
    generate(_data, api = null, attemps = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let prompt = '';
            let thread = [];
            try {
                let keepConversation = true;
                const prompts = require("prompts");
                const { value } = yield prompts({
                    type: "text",
                    name: "value",
                    message: `🤖 Hi there, how can I help you today?\n`,
                }, {
                    onCancel: () => {
                        keepConversation = false;
                        process.exit(0);
                    },
                });
                prompt = value;
                // We check if the user has provided a session token
                if (!this.params.env || !this.params.env.OPENAI_EMAIL) {
                    throw new Error("Make sure you provide a Openai credentials in your .env file. \nie: OPENAI_EMAIL=your-openai-email\nOPENAI_PASSWORD=your-openai-password");
                }
                const chatgpt = yield (0, esm_ts_1.requiresm)("chatgpt");
                const { ChatGPTAPI } = chatgpt;
                if (!api) {
                    api = new ChatGPTAPI({
                        apiKey: process.env.OPENAI_API_KEY
                    });
                }
                // send a message and wait for the response
                // @ts-ignore
                const { oraPromise } = (yield (0, esm_ts_1.requiresm)("ora"));
                let conversationId, parentMessageId = null;
                let res = yield oraPromise(api.sendMessage(prompt, {}), {
                    text: prompt,
                });
                ({ keepConversation, prompt, thread } = yield this.prompt(res, thread, prompts, keepConversation, prompt));
                while (keepConversation) {
                    conversationId = res.conversationId;
                    parentMessageId = res.messageId;
                    res = yield oraPromise(api.sendMessage(prompt, {
                        conversationId,
                        parentMessageId,
                    }), {
                        text: prompt,
                    });
                    // @ts-ignore
                    ({ keepConversation, prompt, thread } = yield this.prompt(res, thread, prompts, keepConversation, prompt));
                }
            }
            catch (error) {
                console.log(error.message);
                if (attemps < 3) {
                    attemps++;
                    yield this.generate(_data, api);
                }
            }
            // @ts-ignore
            _data.thread = thread.join("\\");
            // We resolve the template name here
            _data.template = this.resolveTemplateName(_data.template, this.name);
            const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
            const compiled = this.engine.compile(template, _data);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data), compiled);
        });
    }
    prompt(res, thread, prompts, keepConversation, prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { text: response } = res;
            const md = yield require("cli-md");
            thread.push(response);
            const { value } = yield prompts({
                type: "text",
                name: "value",
                message: `${md(response)}\n`,
            }, {
                onCancel: () => {
                    keepConversation = false;
                },
            });
            prompt = value;
            return { keepConversation, prompt, thread };
        });
    }
    // resolve template name if it does not have template extension
    resolveTemplateName(templateName, name) {
        if (templateName && templateName.includes(".template"))
            return templateName;
        // The format of a template : {conceptName}.{templateName}.{extension}.template
        // example : concept.api.php.template
        templateName = templateName ? `.${templateName}` : '';
        return `${name.toLowerCase()}${templateName}${this.extension}.template`;
    }
    getFilename(data) {
        if (data.filename)
            return data.filename;
        return (0, path_1.join)(data.outputDir, `${data.name}.${data.extension || this.getExtension(data.template)}`);
    }
    getExtension(templateName) {
        return templateName.replace(".template", "").split(".").pop();
    }
    getTemplatesPath() {
        return this.technology.params.templatesPath
            ? this.technology.params.templatesPath
            : (0, path_1.relative)(process.cwd(), __dirname);
    }
}
exports.Md = Md;
//# sourceMappingURL=md.js.map