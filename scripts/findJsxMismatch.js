const fs = require('fs');
const path = process.argv[2] || 'src/App.tsx';
const src = fs.readFileSync(path, 'utf8');
const tagRe = /<(\/)?([A-Za-z0-9_\-:.]+)([^>]*)>/g;
const selfClosingRe = /\/$/;
let match;
const stack = [];
while ((match = tagRe.exec(src)) !== null) {
  const isClose = !!match[1];
  const tag = match[2];
  const rest = match[3] || '';
  const before = src.slice(Math.max(0, match.index-40), match.index);
  const line = src.slice(0, match.index).split('\n').length;
  if (!isClose) {
    // ignore self-closing
    if (selfClosingRe.test(rest.trim()) || rest.includes('/>') || rest.trim().endsWith('/')) {
      continue;
    }
    // ignore fragments and JSX expressions like <Component /> if self-closing handled. push tag
    stack.push({ tag, index: match.index, line });
  } else {
    if (stack.length === 0) {
      console.log(`Unmatched closing </${tag}> at line ${line}`);
      process.exit(1);
    }
    const last = stack.pop();
    if (last.tag !== tag) {
      console.log(`Tag mismatch at line ${line}: closing </${tag}> but last opened was <${last.tag}> (opened at line ${last.line})`);
      process.exit(1);
    }
  }
}
if (stack.length) {
  const last = stack.pop();
  console.log(`Unclosed tag <${last.tag}> opened at line ${last.line}`);
  process.exit(1);
}
console.log('No mismatched tags found.');
