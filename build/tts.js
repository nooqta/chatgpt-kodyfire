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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tts = void 0;
const path_1 = require("path");
const core_1 = require("@angular-devkit/core");
const pluralize = require("pluralize");
const basic_kodyfire_1 = require("basic-kodyfire");
const engine_1 = require("./engine");
const esm_ts_1 = require("esm-ts");
const fs = require('fs');
const util = require('util');
class Tts extends basic_kodyfire_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
        this.extension = ".txt"; // replace with your extension
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
                const { OPENAI_EMAIL, OPENAI_PASSWORD } = this.params.env;
                const chatgpt = yield (0, esm_ts_1.requiresm)("chatgpt");
                const { ChatGPTAPIBrowser } = chatgpt;
                // use puppeteer to bypass cloudflare (headful because of captchas)
                if (!api) {
                    api = new ChatGPTAPIBrowser({
                        email: OPENAI_EMAIL,
                        password: OPENAI_PASSWORD
                    });
                }
                yield api.initSession();
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
            _data.thread = thread;
            yield api.closeSession();
            // We resolve the template name here
            _data.template = this.resolveTemplateName(_data.template, this.name);
            const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
            const compiled = this.engine.compile(template, _data);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data), compiled);
        });
    }
    prompt(res, thread, prompts, keepConversation, prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            let { response } = res;
            const md = require("cli-md");
            const text = yield this.markdownToText(response);
            thread.push(text);
            const textToSpeech = require('@google-cloud/text-to-speech');
            // Creates a client
            const client = new textToSpeech.TextToSpeechClient();
            // Construct the request
            const request = {
                input: { text: text },
                // Select the language and SSML voice gender (optional)
                voice: { languageCode: "en-US" },
                // select the type of audio encoding
                audioConfig: { audioEncoding: 'MP3' },
            };
            // Performs the text-to-speech request
            const [ttsResponse] = yield client.synthesizeSpeech(request);
            // Write the binary audio content to a local file
            const writeFile = util.promisify(fs.writeFile);
            const filename = (0, path_1.join)(this.technology.rootDir, this.outputDir, `output-${thread.length}.mp3`);
            yield writeFile(filename, ttsResponse.audioContent, 'binary');
            const { exec } = require('child_process');
            const os = require('os');
            const player = os.platform() == "darwin" ? "afplay" : (os.platform() == "win32" ? "start" : "play");
            // for mac os, linux & windows only
            exec(`${player} ${filename}`);
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
    markdownToText(markdown) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const { remark } = yield (0, esm_ts_1.requiresm)('remark');
            // @ts-ignore
            const { stripMarkdown } = yield (0, esm_ts_1.requiresm)('strip-markdown');
            // @ts-ignore
            return remark()
                .use(stripMarkdown)
                .processSync(markdown !== null && markdown !== void 0 ? markdown : '')
                .toString();
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
exports.Tts = Tts;
//# sourceMappingURL=tts.js.map