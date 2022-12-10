"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.chatgptArray = exports.conceptArray = exports.chatgpt = exports.concept = void 0;
exports.concept = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        template: {
            type: 'string',
        },
        outputDir: { type: 'string' },
    },
};
exports.chatgpt = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        outputDir: { type: 'string' }
    },
    required: ['name'],
};
exports.conceptArray = {
    type: 'array',
    items: exports.concept,
};
exports.chatgptArray = {
    type: 'array',
    items: exports.chatgpt,
};
exports.schema = {
    type: 'object',
    properties: {
        project: { type: 'string' },
        name: { type: 'string' },
        rootDir: { type: 'string' },
        concept: exports.conceptArray,
        chatgpt: exports.chatgptArray,
    },
    required: ['name'],
};
//# sourceMappingURL=schema.js.map