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

export const chatgpt = {
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
export const chatgptArray = {
  type: 'array',
  items: chatgpt,
};
export const schema = {
  type: 'object',
  properties: {
    project: { type: 'string' },
    name: { type: 'string' },
    rootDir: { type: 'string' },
    concept: conceptArray,
    chatgpt: chatgptArray,
  },
  required: ['name'],
};
