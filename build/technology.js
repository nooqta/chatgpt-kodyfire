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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Technology = void 0;
const basic_kodyfire_1 = require("basic-kodyfire");
const concept_1 = require("./concept");
const classes = __importStar(require("."));
const assets = __importStar(require("./assets.json"));
const kodyfire_core_1 = require("kodyfire-core");
const path_1 = require("path");
const fs = require('fs');
class Technology extends basic_kodyfire_1.Technology {
    constructor(params, _assets = assets) {
        try {
            super(params, _assets);
            this.assets = _assets;
            this.params = params;
            this.updateTemplatesPath(params);
            this.initConcepts();
        }
        catch (error) {
            console.log(error);
        }
    }
    initConcepts() {
        // add dynamic property for technology
        for (const concept of this.assets.concepts) {
            if (typeof classes[(0, kodyfire_core_1.capitalize)(concept.name)] !== 'undefined') {
                this.concepts.set(concept.name, new classes[(0, kodyfire_core_1.capitalize)(concept.name)](concept, this));
            }
            else {
                this.concepts.set(concept.name, new concept_1.Concept(concept, this));
            }
        }
    }
    updateTemplatesPath(params) {
        const templatesPath = (0, path_1.join)(process.cwd(), '.kody', params.name);
        // we check if the path exists
        if (fs.existsSync(templatesPath)) {
            this.params.templatesPath = templatesPath;
            // We overwrite the assets property if assets.json exists in the .kody folder
            if (fs.existsSync((0, path_1.join)(templatesPath, 'assets.json'))) {
                this.assets = require((0, path_1.join)(templatesPath, 'assets.json'));
            }
        }
    }
}
exports.Technology = Technology;
//# sourceMappingURL=technology.js.map