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
exports.Concept = void 0;
const path_1 = require("path");
const core_1 = require("@angular-devkit/core");
const pluralize = require('pluralize');
const basic_kodyfire_1 = require("basic-kodyfire");
const engine_1 = require("./engine");
class Concept extends basic_kodyfire_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
        this.extension = '.kody'; // replace with your extension
        this.engine = new engine_1.Engine();
        // Register functions you want to use in your templates with the engine builder registerHelper method.
        this.engine.builder.registerHelper('uppercase', (value) => {
            return value.toUpperCase();
        });
        this.engine.builder.registerHelper('pluralize', (value) => {
            return pluralize(value);
        });
        this.engine.builder.registerHelper('lowercase', (value) => {
            return value === null || value === void 0 ? void 0 : value.toLowerCase();
        });
        for (const key in core_1.strings) {
            this.engine.builder.registerHelper(key, (value) => {
                /* @ts-ignore */
                return core_1.strings[key](value);
            });
        }
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            // We resolve the template name here
            _data.template = this.resolveTemplateName(_data.template, this.name);
            const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
            const compiled = this.engine.compile(template, _data);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data), compiled);
        });
    }
    // resolve template name if it does not have template extension
    resolveTemplateName(templateName, name) {
        if (templateName.includes('.template'))
            return templateName;
        // The format of a template : {conceptName}.{templateName}.{extension}.template
        // example : concept.api.php.template
        return `${name.toLowerCase()}.${templateName}${this.extension}.template`;
    }
    getFilename(data) {
        if (data.filename)
            return data.filename;
        return (0, path_1.join)(data.outputDir, `${data.name}.${data.extension || this.getExtension(data.template)}`);
    }
    getExtension(templateName) {
        return templateName.replace('.template', '').split('.').pop();
    }
    getTemplatesPath() {
        return this.technology.params.templatesPath
            ? this.technology.params.templatesPath
            : (0, path_1.relative)(process.cwd(), __dirname);
    }
}
exports.Concept = Concept;
//# sourceMappingURL=concept.js.map