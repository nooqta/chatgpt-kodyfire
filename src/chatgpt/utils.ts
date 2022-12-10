
export function markdownToText(markdown?: string): string {
  const remark = require('remark');
  const stripMarkdown = require('strip-markdown');
  return remark()
    .use(stripMarkdown)
    .processSync(markdown ?? '')
    .toString()
}
