"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToText = void 0;
function markdownToText(markdown) {
    const remark = require('remark');
    const stripMarkdown = require('strip-markdown');
    return remark()
        .use(stripMarkdown)
        .processSync(markdown !== null && markdown !== void 0 ? markdown : '')
        .toString();
}
exports.markdownToText = markdownToText;
//# sourceMappingURL=utils.js.map