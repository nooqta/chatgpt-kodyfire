export const concept = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    template: {
      type: 'string',
    },
    outputDir: { type: 'string' },
  },
};

export const md = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    outputDir: { type: 'string' }
  },
  required: ['name'],
}
export const text = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    outputDir: { type: 'string' }
  },
  required: ['name'],
}

export const conceptArray = {
  type: 'array',
  items: concept,
};
export const mdArray = {
  type: 'array',
  items: md,
};
export const textArray = {
  type: 'array',
  items: text,
};
export const schema = {
  type: 'object',
  properties: {
    project: { type: 'string' },
    name: { type: 'string' },
    rootDir: { type: 'string' },
    concept: conceptArray,
    md: mdArray,
    text: textArray,
  },
  required: ['name'],
};
