"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.textArray = exports.mdArray = exports.conceptArray = exports.text = exports.md = exports.concept = void 0;
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
exports.md = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        outputDir: { type: 'string' }
    },
    required: ['name'],
};
exports.text = {
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
exports.mdArray = {
    type: 'array',
    items: exports.md,
};
exports.textArray = {
    type: 'array',
    items: exports.text,
};
exports.schema = {
    type: 'object',
    properties: {
        project: { type: 'string' },
        name: { type: 'string' },
        rootDir: { type: 'string' },
        concept: exports.conceptArray,
        md: exports.mdArray,
        text: exports.textArray,
    },
    required: ['name'],
};
//# sourceMappingURL=schema.js.map