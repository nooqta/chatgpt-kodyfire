"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kody = void 0;
const basic_kodyfire_1 = require("basic-kodyfire");
const technology_1 = require("./technology");
const schema_1 = require("./schema");
const assets_json_1 = __importDefault(require("./assets.json"));
class Kody extends basic_kodyfire_1.Kody {
    constructor(params, _schema = schema_1.schema, technology = new technology_1.Technology(params, assets_json_1.default)) {
        // override the templateDir property to point to our directory
        params.templatesPath = __dirname;
        // override the assets.json to include custom concepts when needed
        super(params, schema_1.schema, technology);
    }
}
exports.Kody = Kody;
//# sourceMappingURL=kody.js.map